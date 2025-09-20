// Demo data initialization script for MyImpact
// This can be used to populate the app with sample data for testing

export const initializeDemoData = () => {
  const demoEntries = [
    {
      id: 'demo-1',
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      type: 'water',
      value: 25,
      unit: 'liters',
      meta: { activity: 'shower' }
    },
    {
      id: 'demo-2', 
      date: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      type: 'travel',
      value: 5,
      unit: 'km',
      meta: { mode: 'bike', destination: 'work' }
    },
    {
      id: 'demo-3',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      type: 'electricity',
      value: 3.2,
      unit: 'kWh',
      meta: { source: 'home' }
    },
    {
      id: 'demo-4',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      type: 'recycle',
      value: 2,
      unit: 'kg',
      meta: { materials: ['plastic', 'paper'] }
    },
    {
      id: 'demo-5',
      date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      type: 'waste',
      value: 0.5,
      unit: 'kg',
      meta: { type: 'organic' }
    },
    {
      id: 'demo-6',
      date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      type: 'travel',
      value: 12,
      unit: 'km',
      meta: { mode: 'bus', route: 'home-work' }
    },
    {
      id: 'demo-7',
      date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
      type: 'water',
      value: 45,
      unit: 'liters',
      meta: { activity: 'daily_use' }
    }
  ];

  // Store demo entries
  localStorage.setItem('sustainability_entries', JSON.stringify(demoEntries));
  
  return demoEntries;
};

export const clearAllData = () => {
  localStorage.removeItem('sustainability_entries');
  localStorage.removeItem('sustainability_badges');
  localStorage.removeItem('sustainability_settings');
};

export const isDemoDataLoaded = () => {
  const entries = localStorage.getItem('sustainability_entries');
  return entries && JSON.parse(entries).some(entry => entry.id.startsWith('demo-'));
};
