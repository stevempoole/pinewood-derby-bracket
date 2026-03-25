# 🏁 Heat-Based Racing System - Implementation Plan

## Overview
Converting from bracket tournament to heat-based racing system based on Trailblazers Excel analysis.

## Core Features to Build

### 1. PPN Heat Scheduling Algorithm
- Generate fair heat schedules for 4-25 cars
- Each car races exactly 3 times
- Perfect lane distribution: 1 race in Lane 1, Lane 2, and Lane 4
- Lane 3 unused to support 3-car heats on 4-lane track

### 2. Heat Management UI
- Current heat display (like Excel's H2 cell selector)
- Show current heat participants with names and car numbers
- Next heat preview
- Heat progress indicator (Heat X of Y)

### 3. Real-Time Results Entry
- Quick finish position entry: 1st, 2nd, 3rd place for current heat
- Touch-friendly buttons for race officials
- Immediate score calculation and display
- Heat completion validation

### 4. Scoring System
- 3 points for 1st place
- 2 points for 2nd place  
- 1 point for 3rd place
- Real-time cumulative scoring
- Automatic leaderboard updates

### 5. Live Dashboard
- Current standings with points totals
- Race progress tracking
- Individual car performance summary
- Final results and awards ceremony mode

## Technical Implementation

### Data Structure
```javascript
const raceData = {
  racers: [
    { id: 1, name: "Luke", carNumber: 1, totalPoints: 0, races: [] },
    // ...
  ],
  heats: [
    { 
      heatNumber: 1, 
      lane1: 1, lane2: 3, lane3: 0, lane4: 6,
      results: { first: null, second: null, third: null },
      completed: false 
    },
    // ...
  ],
  currentHeat: 1,
  raceCompleted: false
}
```

### PPN Algorithm Function
```javascript
function generatePPNSchedule(carCount) {
  // Implement PPN algorithm based on Excel analysis
  // Returns array of heat objects with lane assignments
}
```

## UI/UX Design

### Heat Management Screen
- Large current heat display
- Prominent "Enter Results" section
- Quick navigation between heats
- Live scoring sidebar

### Mobile Optimization
- Large touch targets for results entry
- Horizontal scroll for heat progression
- Simplified scorer interface

## Compatibility
- Keep existing racer import/export features
- Maintain responsive design
- Preserve age group functionality
- Support screen projection mode

## Migration Strategy
1. Build new heat system alongside current bracket system
2. Add format selector: "Tournament Brackets" vs "Heat Racing"
3. Eventually phase out brackets if heat system works better
4. Maintain backwards compatibility for existing tournaments

## Testing Plan
- Test with 4, 8, 12, 16 car scenarios
- Verify PPN algorithm fairness
- Load test with Trailblazers sample data
- Mobile device compatibility testing