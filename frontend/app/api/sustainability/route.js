export async function POST(request) {
  const data = await request.json();
  
  // Mock sustainability tracking
  const response = {
    success: true,
    message: 'Daily impact logged successfully!',
    todayStats: {
      water: parseInt(data.water) || 0,
      electricity: parseInt(data.electricity) || 0,
      transport: data.transport,
      carbonFootprint: calculateCarbonFootprint(data),
      points: calculatePoints(data)
    },
    updatedTotals: {
      waterSaved: Math.floor(Math.random() * 100) + 200,
      energySaved: Math.floor(Math.random() * 50) + 150,
      carbonReduced: Math.floor(Math.random() * 30) + 70,
      weeklyGoal: 300
    }
  };

  return Response.json(response);
}

function calculateCarbonFootprint(data) {
  let carbon = 0;
  
  // Water usage (kg CO2 per liter)
  if (data.water) {
    carbon += data.water * 0.0003;
  }
  
  // Electricity usage (kg CO2 per kWh)
  if (data.electricity) {
    carbon += data.electricity * 0.82;
  }
  
  // Transport emissions (kg CO2)
  const transportEmissions = {
    'bus': 0.05,
    'metro': 0.03,
    'bike': 0,
    'walk': 0,
    'car': 0.25,
    'motorcycle': 0.15
  };
  
  carbon += transportEmissions[data.transport] || 0.1;
  
  return Math.round(carbon * 100) / 100;
}

function calculatePoints(data) {
  let points = 0;
  
  // Points for sustainable choices
  if (data.transport === 'bike' || data.transport === 'walk') {
    points += 20;
  } else if (data.transport === 'bus' || data.transport === 'metro') {
    points += 10;
  }
  
  // Bonus points for low consumption
  if (data.water && data.water < 50) points += 10;
  if (data.electricity && data.electricity < 5) points += 10;
  
  return points;
}

export async function GET() {
  // Return user sustainability stats
  const stats = {
    waterSaved: Math.floor(Math.random() * 100) + 200,
    energySaved: Math.floor(Math.random() * 50) + 150,
    carbonReduced: Math.floor(Math.random() * 30) + 70,
    weeklyGoal: 300,
    currentStreak: Math.floor(Math.random() * 15) + 5,
    totalPoints: Math.floor(Math.random() * 1000) + 2000,
    tips: [
      'Switch to LED bulbs to reduce electricity consumption by up to 80%',
      'Take shorter showers to save water and energy',
      'Use public transport or bike to reduce carbon emissions',
      'Unplug electronics when not in use to save energy'
    ]
  };

  return Response.json(stats);
}
