export async function POST(request) {
  const data = await request.json();
  
  // Mock recycle pickup request
  const response = {
    success: true,
    message: 'Pickup request submitted successfully!',
    requestId: 'REC-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    estimatedPickup: new Date(Date.now() + Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimatedPoints: calculateRecyclePoints(data),
    assignedRecycler: getRandomRecycler(),
    request: {
      ...data,
      submittedAt: new Date().toISOString(),
      status: 'Scheduled'
    }
  };

  return Response.json(response);
}

export async function GET() {
  // Return recycling dashboard data
  const dashboard = {
    userStats: {
      totalPoints: Math.floor(Math.random() * 1000) + 2000,
      itemsRecycled: Math.floor(Math.random() * 50) + 50,
      carbonSaved: Math.floor(Math.random() * 100) + 100,
      rank: getRank(Math.floor(Math.random() * 1000) + 2000),
      monthlyTarget: 3000,
      currentMonth: Math.floor(Math.random() * 500) + 1500
    },
    recentPickups: [
      {
        id: 1,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: 'Plastic Bottles (15 items)',
        status: 'Completed',
        points: 150,
        recycler: 'EcoRecycle Bengaluru'
      },
      {
        id: 2,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: 'Electronics (2 items)',
        status: 'Completed',
        points: 100,
        recycler: 'TechRecycle Solutions'
      },
      {
        id: 3,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: 'Paper/Cardboard (25 items)',
        status: 'Scheduled',
        points: 125,
        recycler: 'GreenCycle Co.'
      }
    ],
    nearbyRecyclers: [
      {
        id: 1,
        name: 'EcoRecycle Bengaluru',
        rating: 4.8,
        distance: '1.2 km',
        specialties: ['Plastic', 'Paper', 'Metal'],
        nextPickup: 'Tomorrow',
        available: true
      },
      {
        id: 2,
        name: 'TechRecycle Solutions',
        rating: 4.9,
        distance: '2.5 km',
        specialties: ['Electronics', 'Batteries'],
        nextPickup: 'Today',
        available: true
      },
      {
        id: 3,
        name: 'GreenCycle Co.',
        rating: 4.7,
        distance: '3.1 km',
        specialties: ['Paper', 'Textiles', 'Glass'],
        nextPickup: 'Sep 22',
        available: false
      }
    ]
  };

  return Response.json(dashboard);
}

function calculateRecyclePoints(data) {
  const pointsMap = {
    'plastic': 10,
    'paper': 5,
    'metal': 15,
    'electronics': 50,
    'glass': 8,
    'textiles': 12
  };

  const basePoints = pointsMap[data.category] || 5;
  const quantity = parseInt(data.quantity) || 1;
  
  return basePoints * Math.min(quantity, 20); // Cap at 20 items for demo
}

function getRandomRecycler() {
  const recyclers = [
    'EcoRecycle Bengaluru',
    'TechRecycle Solutions',
    'GreenCycle Co.',
    'Urban Waste Management',
    'CleanEarth Recycling'
  ];
  
  return recyclers[Math.floor(Math.random() * recyclers.length)];
}

function getRank(points) {
  if (points >= 2500) return 'Gold';
  if (points >= 1000) return 'Silver';
  return 'Bronze';
}
