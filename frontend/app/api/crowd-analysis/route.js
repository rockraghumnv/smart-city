export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('image');
  
  // Mock AI analysis results
  const analysisResults = [
    {
      status: 'Safe',
      crowdDensity: 'Low',
      riskLevel: 'Normal',
      peopleCount: Math.floor(Math.random() * 30) + 10,
      confidence: Math.floor(Math.random() * 10) + 90,
      timestamp: new Date().toISOString(),
      location: 'Brigade Road',
      recommendations: [
        'Continue normal operations',
        'Monitor for any changes',
        'Maintain current security level'
      ]
    },
    {
      status: 'Moderate Risk',
      crowdDensity: 'Medium',
      riskLevel: 'Caution',
      peopleCount: Math.floor(Math.random() * 50) + 50,
      confidence: Math.floor(Math.random() * 15) + 80,
      timestamp: new Date().toISOString(),
      location: 'Commercial Street',
      recommendations: [
        'Increase security presence',
        'Monitor crowd movement patterns',
        'Prepare crowd control measures',
        'Alert nearby authorities'
      ]
    },
    {
      status: 'High Risk',
      crowdDensity: 'High',
      riskLevel: 'Alert',
      peopleCount: Math.floor(Math.random() * 100) + 100,
      confidence: Math.floor(Math.random() * 8) + 88,
      timestamp: new Date().toISOString(),
      location: 'MG Road',
      recommendations: [
        'Immediate crowd control needed',
        'Deploy additional security personnel',
        'Consider crowd dispersal measures',
        'Notify emergency services',
        'Implement traffic diversions'
      ]
    }
  ];

  // Randomly select one result
  const result = analysisResults[Math.floor(Math.random() * analysisResults.length)];
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return Response.json({
    success: true,
    analysis: result,
    processedAt: new Date().toISOString()
  });
}

export async function GET() {
  // Return current city safety overview
  const overview = {
    totalCameras: 45,
    safeZones: Math.floor(Math.random() * 20) + 120,
    monitoring: Math.floor(Math.random() * 10) + 5,
    highRisk: Math.floor(Math.random() * 5) + 1,
    recentAlerts: [
      {
        id: 1,
        location: 'Brigade Road',
        time: new Date(Date.now() - 2 * 60000).toISOString(),
        status: 'High Risk',
        type: 'Overcrowding',
        severity: 'high'
      },
      {
        id: 2,
        location: 'Commercial Street',
        time: new Date(Date.now() - 15 * 60000).toISOString(),
        status: 'Resolved',
        type: 'Crowd Dispersed',
        severity: 'low'
      }
    ]
  };

  return Response.json(overview);
}
