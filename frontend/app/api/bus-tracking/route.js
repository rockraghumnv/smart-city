export async function GET() {
  // Mock bus tracking data
  const busData = {
    routes: [
      {
        id: 1,
        number: 'V-500C',
        name: 'Kempegowda Bus Station to Electronic City',
        crowdLevel: 'Low',
        nextArrival: Math.floor(Math.random() * 15) + 1,
        location: 'BTM Layout',
        delay: Math.floor(Math.random() * 5),
        stops: [
          { name: 'Kempegowda Bus Station', eta: 0, passed: true },
          { name: 'Banashankari', eta: 8, passed: true },
          { name: 'BTM Layout', eta: 15, passed: false },
          { name: 'Silk Board', eta: 25, passed: false },
          { name: 'Electronic City', eta: 35, passed: false }
        ]
      },
      {
        id: 2,
        number: 'G-9',
        name: 'Majestic to Whitefield',
        crowdLevel: 'High',
        nextArrival: Math.floor(Math.random() * 15) + 5,
        location: 'MG Road',
        delay: Math.floor(Math.random() * 8),
        stops: [
          { name: 'Majestic', eta: 0, passed: true },
          { name: 'MG Road', eta: 12, passed: false },
          { name: 'Brigade Road', eta: 18, passed: false },
          { name: 'Indiranagar', eta: 28, passed: false },
          { name: 'Marathahalli', eta: 45, passed: false },
          { name: 'Whitefield', eta: 60, passed: false }
        ]
      }
    ],
    nearbyStops: [
      {
        name: 'Brigade Road',
        distance: 200,
        buses: ['G-9', 'AC-40'],
        crowdLevel: 'Medium'
      },
      {
        name: 'MG Road Metro',
        distance: 350,
        buses: ['V-356', 'G-9'],
        crowdLevel: 'Low'
      }
    ]
  };

  return Response.json(busData);
}
