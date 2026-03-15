// Preload Demo - Sample racer data for testing age group functionality

const SAMPLE_RACERS = [
  { name: "Johnny Smith", ageGroup: "Cubs", id: 1 },
  { name: "Sarah Johnson", ageGroup: "Cubs", id: 2 },
  { name: "Mike Wilson", ageGroup: "Cubs", id: 3 },
  { name: "Emma Davis", ageGroup: "Cubs", id: 4 },
  { name: "Alex Brown", ageGroup: "Cubs", id: 5 },
  { name: "Katie Miller", ageGroup: "Cubs", id: 6 },
  { name: "Ryan Garcia", ageGroup: "Cubs", id: 7 },
  { name: "Zoe Martinez", ageGroup: "Cubs", id: 8 },
  { name: "Tommy Anderson", ageGroup: "Webelos", id: 9 },
  { name: "Jessica Thompson", ageGroup: "Webelos", id: 10 },
  { name: "Brandon Lee", ageGroup: "Webelos", id: 11 },
  { name: "Mia Rodriguez", ageGroup: "Webelos", id: 12 },
  { name: "Tyler Clark", ageGroup: "Webelos", id: 13 },
  { name: "Chloe Lewis", ageGroup: "Webelos", id: 14 },
  { name: "Jordan Walker", ageGroup: "Webelos", id: 15 },
  { name: "Sophia Hall", ageGroup: "Webelos", id: 16 }
];

// Function to preload sample data
function preloadSampleRacers() {
  console.log('Preloading sample racers...');
  
  // Cubs Division (8 racers)
  const cubs = SAMPLE_RACERS.filter(r => r.ageGroup === 'Cubs');
  console.log(`Cubs Division: ${cubs.length} racers`);
  
  // Webelos Division (8 racers) 
  const webelos = SAMPLE_RACERS.filter(r => r.ageGroup === 'Webelos');
  console.log(`Webelos Division: ${webelos.length} racers`);
  
  return {
    all: SAMPLE_RACERS,
    cubs: cubs,
    webelos: webelos,
    ageGroups: ['Cubs', 'Webelos']
  };
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SAMPLE_RACERS, preloadSampleRacers };
}