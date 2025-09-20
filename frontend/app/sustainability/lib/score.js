// EarthScore calculation and badge logic
import { isWithinInterval, startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, format } from 'date-fns';
import { getEntries, getBadges, addBadge, getSettings } from './storage';
import { BADGE_DEFINITIONS } from '../data/sampleData';

// Calculate daily totals for a specific date
export function calculateDailyTotals(entries = [], targetDate) {
  const dayStart = startOfDay(new Date(targetDate));
  const dayEnd = endOfDay(new Date(targetDate));
  
  const dayEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return isWithinInterval(entryDate, { start: dayStart, end: dayEnd });
  });

  const totals = {
    water: 0,
    electricity: 0,
    travel: 0,
    waste: 0,
    recycle: 0,
    travelModes: { walk: 0, bike: 0, bus: 0, car: 0 }
  };

  dayEntries.forEach(entry => {
    if (entry.type in totals) {
      totals[entry.type] += entry.value;
    }
    
    // Track travel modes
    if (entry.type === 'travel' && entry.meta?.mode) {
      totals.travelModes[entry.meta.mode] += entry.value;
    }
  });

  return totals;
}

// Calculate weekly aggregates
export function calculateWeeklyAggregates(entries) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday start
  const days = [];
  
  for (let i = 0; i < 7; i++) {
    const date = subDays(new Date(), i);
    const dayTotals = calculateDailyTotals(entries, date);
    days.push({
      date: format(date, 'MMM dd'),
      fullDate: date,
      ...dayTotals
    });
  }
  
  return days.reverse(); // Return in chronological order
}

// Calculate EarthScore (0-100)
export function calculateEarthScore(dailyTotals, customBaselines = null, customWeights = null) {
  const settings = getSettings();
  const baselines = customBaselines || settings.baselines;
  const weights = customWeights || settings.weights;

  // Calculate component scores (0-100 each)
  const components = {};
  
  // Electricity score
  const electricityRatio = dailyTotals.electricity / (2 * baselines.electricityPerDay);
  components.electricity = Math.max(0, Math.min(100, (1 - electricityRatio) * 100));
  
  // Water score
  const waterRatio = dailyTotals.water / (2 * baselines.waterPerDay);
  components.water = Math.max(0, Math.min(100, (1 - waterRatio) * 100));
  
  // Travel score (lower is better for car travel)
  const travelRatio = dailyTotals.travel / (2 * baselines.travelKmPerDay);
  components.travel = Math.max(0, Math.min(100, (1 - travelRatio) * 100));
  
  // Waste score
  const wasteRatio = dailyTotals.waste / (2 * baselines.wasteKgPerDay);
  components.waste = Math.max(0, Math.min(100, (1 - wasteRatio) * 100));

  // Calculate weighted base score
  const baseScore = 
    components.electricity * weights.electricity +
    components.water * weights.water +
    components.travel * weights.travel +
    components.waste * weights.waste;

  // Calculate bonus points
  let bonus = 0;
  
  // Public transport/eco travel bonus (up to 8 points)
  const ecoTravel = dailyTotals.travelModes.walk + dailyTotals.travelModes.bike + dailyTotals.travelModes.bus;
  const totalTravel = dailyTotals.travel;
  if (totalTravel > 0) {
    const ecoRatio = ecoTravel / totalTravel;
    bonus += Math.min(8, ecoRatio * 8);
  }
  
  // Recycling bonus (up to 5 points)
  if (dailyTotals.recycle > 0) {
    bonus += Math.min(5, dailyTotals.recycle * 2);
  }
  
  // Cap bonus at 10 points
  bonus = Math.min(10, bonus);
  
  const finalScore = Math.max(0, Math.min(100, baseScore + bonus));
  
  return {
    score: Math.round(finalScore),
    components,
    bonus,
    breakdown: {
      electricity: components.electricity * weights.electricity,
      water: components.water * weights.water,
      travel: components.travel * weights.travel,
      waste: components.waste * weights.waste,
      bonus
    }
  };
}

// Check and award badges
export function checkAndAwardBadges(entries) {
  const currentBadges = getBadges();
  const newBadges = [];
  
  BADGE_DEFINITIONS.forEach(badgeDef => {
    // Skip if already earned
    if (currentBadges.some(b => b.badgeId === badgeDef.id)) return;
    
    let earned = false;
    
    switch (badgeDef.id) {
      case 'water_saver':
        earned = checkWaterSaverBadge(entries);
        break;
      case 'eco_rider':
        earned = checkEcoRiderBadge(entries);
        break;
      case 'recycler':
        earned = checkRecyclerBadge(entries);
        break;
      case 'energy_conscious':
        earned = checkEnergyConsciousBadge(entries);
        break;
      case 'waste_warrior':
        earned = checkWasteWarriorBadge(entries);
        break;
    }
    
    if (earned) {
      const badge = addBadge({
        badgeId: badgeDef.id,
        name: badgeDef.name,
        description: badgeDef.description,
        icon: badgeDef.icon,
        color: badgeDef.color
      });
      newBadges.push(badge);
    }
  });
  
  return newBadges;
}

// Badge checking functions
function checkWaterSaverBadge(entries) {
  // Check last 3 days for ≤50L each day
  for (let i = 0; i < 3; i++) {
    const date = subDays(new Date(), i);
    const dayTotals = calculateDailyTotals(entries, date);
    if (dayTotals.water > 50) return false;
  }
  return true;
}

function checkEcoRiderBadge(entries) {
  // Check last 7 days for 5 eco travel trips
  const weekEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const weekAgo = subDays(new Date(), 7);
    return entryDate >= weekAgo;
  });
  
  const ecoTrips = weekEntries.filter(entry => 
    entry.type === 'travel' && 
    entry.meta?.mode && 
    ['walk', 'bike', 'bus'].includes(entry.meta.mode)
  ).length;
  
  return ecoTrips >= 5;
}

function checkRecyclerBadge(entries) {
  // Check last 30 days for ≥5kg recycling
  const monthEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const monthAgo = subDays(new Date(), 30);
    return entryDate >= monthAgo;
  });
  
  const totalRecycling = monthEntries
    .filter(entry => entry.type === 'recycle')
    .reduce((sum, entry) => sum + entry.value, 0);
  
  return totalRecycling >= 5;
}

function checkEnergyConsciousBadge(entries) {
  // Check last 5 days for <3kWh each day
  let qualifyingDays = 0;
  for (let i = 0; i < 5; i++) {
    const date = subDays(new Date(), i);
    const dayTotals = calculateDailyTotals(entries, date);
    if (dayTotals.electricity < 3) qualifyingDays++;
  }
  return qualifyingDays >= 5;
}

function checkWasteWarriorBadge(entries) {
  // Check last 7 days for <0.3kg waste each day
  for (let i = 0; i < 7; i++) {
    const date = subDays(new Date(), i);
    const dayTotals = calculateDailyTotals(entries, date);
    if (dayTotals.waste > 0.3) return false;
  }
  return true;
}

// Calculate current streak
export function calculateStreak(entries) {
  if (!entries.length) return 0;
  
  let streak = 0;
  let currentDate = new Date();
  
  // Check each day going backwards
  while (true) {
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);
    
    const hasEntry = entries.some(entry => {
      const entryDate = new Date(entry.date);
      return isWithinInterval(entryDate, { start: dayStart, end: dayEnd });
    });
    
    if (hasEntry) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }
  
  return streak;
}

// Mission progress calculation
export function calculateMissionProgress(entries, mission) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= weekStart;
  });
  
  let progress = 0;
  
  switch (mission.type) {
    case 'travel_eco':
      progress = weekEntries.filter(entry => 
        entry.type === 'travel' && 
        entry.meta?.mode && 
        ['walk', 'bike', 'bus'].includes(entry.meta.mode)
      ).length;
      break;
      
    case 'water_limit':
      for (let i = 0; i < 7; i++) {
        const date = subDays(new Date(), i);
        const dayTotals = calculateDailyTotals(entries, date);
        if (dayTotals.water < 75) progress++;
      }
      break;
      
    case 'waste_reduction':
      progress = weekEntries.filter(entry => 
        entry.type === 'recycle' || 
        (entry.type === 'waste' && entry.value < 0.3)
      ).length;
      break;
  }
  
  return Math.min(progress, mission.target);
}
