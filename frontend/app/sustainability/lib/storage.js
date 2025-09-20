// LocalStorage utilities for MyImpact app
import { v4 as uuidv4 } from 'uuid';
import { SAMPLE_ENTRIES } from '../data/sampleData';

const STORAGE_KEYS = {
  ENTRIES: 'MYIMPACT_ENTRIES',
  BADGES: 'MYIMPACT_BADGES',
  SETTINGS: 'MYIMPACT_SETTINGS',
  LAST_SYNC: 'MYIMPACT_LAST_SYNC'
};

// Initialize storage with sample data if empty
export function initializeStorage() {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(STORAGE_KEYS.ENTRIES)) {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(SAMPLE_ENTRIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BADGES)) {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LAST_SYNC)) {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  }
}

// Entries management
export function getEntries() {
  if (typeof window === 'undefined') return SAMPLE_ENTRIES;
  try {
    const entries = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    return entries ? JSON.parse(entries) : SAMPLE_ENTRIES;
  } catch (error) {
    console.error('Error parsing entries:', error);
    return SAMPLE_ENTRIES;
  }
}

export function saveEntries(entries) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  } catch (error) {
    console.error('Error saving entries:', error);
  }
}

export function addEntry(entry) {
  const entries = getEntries();
  const newEntry = {
    ...entry,
    id: entry.id || uuidv4(),
    date: entry.date || new Date().toISOString()
  };
  const updatedEntries = [...entries, newEntry];
  saveEntries(updatedEntries);
  return newEntry;
}

export function updateEntry(entryId, updates) {
  const entries = getEntries();
  const updatedEntries = entries.map(entry => 
    entry.id === entryId ? { ...entry, ...updates } : entry
  );
  saveEntries(updatedEntries);
  return updatedEntries.find(e => e.id === entryId);
}

export function deleteEntry(entryId) {
  const entries = getEntries();
  const updatedEntries = entries.filter(entry => entry.id !== entryId);
  saveEntries(updatedEntries);
  return updatedEntries;
}

export function clearEntries() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.ENTRIES);
}

// Badges management
export function getBadges() {
  if (typeof window === 'undefined') return [];
  try {
    const badges = localStorage.getItem(STORAGE_KEYS.BADGES);
    return badges ? JSON.parse(badges) : [];
  } catch (error) {
    console.error('Error parsing badges:', error);
    return [];
  }
}

export function saveBadges(badges) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  } catch (error) {
    console.error('Error saving badges:', error);
  }
}

export function addBadge(badge) {
  const badges = getBadges();
  const newBadge = {
    ...badge,
    id: badge.id || uuidv4(),
    earnedAt: new Date().toISOString()
  };
  const updatedBadges = [...badges, newBadge];
  saveBadges(updatedBadges);
  return newBadge;
}

// Settings management
export function getSettings() {
  if (typeof window === 'undefined') return getDefaultSettings();
  try {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : getDefaultSettings();
  } catch (error) {
    console.error('Error parsing settings:', error);
    return getDefaultSettings();
  }
}

export function saveSettings(settings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

function getDefaultSettings() {
  return {
    baselines: {
      electricityPerDay: 6,   // kWh
      waterPerDay: 100,       // liters
      travelKmPerDay: 10,     // km (car baseline)
      wasteKgPerDay: 0.5      // kg
    },
    weights: {
      electricity: 0.35,
      travel: 0.30,
      water: 0.25,
      waste: 0.10
    }
  };
}

// Utility functions
export function generateId() {
  return uuidv4();
}

export function getLastSync() {
  if (typeof window === 'undefined') return new Date().toISOString();
  return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || new Date().toISOString();
}

// Simulate API latency for realistic demo
export function withDelay(fn, delay = 500) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(fn());
    }, delay);
  });
}
