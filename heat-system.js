/**
 * 🏁 Pinewood Derby Heat-Based Racing System
 * Implements PPN (Partial Perfect N) algorithm for fair heat scheduling
 * Based on Trailblazers Excel system analysis
 */

class HeatRacingSystem {
    constructor() {
        this.racers = [];
        this.heats = [];
        this.currentHeatIndex = 0;
        this.raceCompleted = false;
    }

    /**
     * Initialize the race with racers
     * @param {Array} racerList - Array of {name, carNumber, ageGroup} objects
     */
    setupRace(racerList) {
        this.racers = racerList.map((racer, index) => ({
            id: index + 1,
            name: racer.name,
            carNumber: racer.carNumber || (index + 1),
            ageGroup: racer.ageGroup || '',
            totalPoints: 0,
            races: [],
            position: null
        }));

        this.heats = this.generatePPNSchedule(this.racers.length);
        this.currentHeatIndex = 0;
        this.raceCompleted = false;

        this.saveState();
        return this.heats;
    }

    /**
     * Generate PPN heat schedule
     * Each car races exactly 3 times: once in lane 1, lane 2, and lane 4
     * @param {number} carCount - Number of cars in the race
     */
    generatePPNSchedule(carCount) {
        const heats = [];
        
        // PPN algorithm: create one heat per car
        for (let heatNum = 1; heatNum <= carCount; heatNum++) {
            const heat = {
                heatNumber: heatNum,
                lane1: 0,
                lane2: 0,
                lane3: 0, // Unused in PPN system
                lane4: 0,
                results: { first: null, second: null, third: null },
                completed: false
            };

            // Calculate lane assignments based on PPN algorithm
            // This ensures each car gets exactly one race in each lane (1, 2, 4)
            
            // Lane 1: Rotating assignment
            heat.lane1 = ((heatNum - 1) % carCount) + 1;
            
            // Lane 2: Offset rotation for opposition
            heat.lane2 = ((heatNum - 1 + Math.floor(carCount / 3)) % carCount) + 1;
            
            // Lane 4: Second offset for maximum opposition diversity  
            heat.lane4 = ((heatNum - 1 + Math.floor(carCount * 2 / 3)) % carCount) + 1;

            // Ensure no car races against itself
            if (heat.lane2 === heat.lane1) {
                heat.lane2 = (heat.lane2 % carCount) + 1;
            }
            if (heat.lane4 === heat.lane1 || heat.lane4 === heat.lane2) {
                heat.lane4 = ((heat.lane4 + 1) % carCount) + 1;
            }

            heats.push(heat);
        }

        // Optimize the schedule to ensure fair lane distribution
        this.optimizeLaneDistribution(heats, carCount);

        return heats;
    }

    /**
     * Optimize lane distribution to ensure each car races once per lane
     */
    optimizeLaneDistribution(heats, carCount) {
        const laneCount = {};
        
        // Initialize lane counters
        for (let car = 1; car <= carCount; car++) {
            laneCount[car] = { lane1: 0, lane2: 0, lane4: 0 };
        }

        // Count current lane assignments
        heats.forEach(heat => {
            if (heat.lane1) laneCount[heat.lane1].lane1++;
            if (heat.lane2) laneCount[heat.lane2].lane2++;
            if (heat.lane4) laneCount[heat.lane4].lane4++;
        });

        // Adjust assignments to ensure perfect distribution
        // This is a simplified optimization - the full PPN algorithm is more complex
        heats.forEach((heat, index) => {
            // Ensure each car appears in exactly 3 heats total
            const carsInHeat = [heat.lane1, heat.lane2, heat.lane4].filter(car => car > 0);
            
            // If we have fewer than 3 cars, add one more
            if (carsInHeat.length < 3 && carCount > 3) {
                for (let car = 1; car <= carCount; car++) {
                    if (!carsInHeat.includes(car)) {
                        // Find the best lane for this car
                        const carLanes = laneCount[car];
                        if (carLanes.lane1 === 0 && heat.lane1 === 0) {
                            heat.lane1 = car;
                            break;
                        } else if (carLanes.lane2 === 0 && heat.lane2 === 0) {
                            heat.lane2 = car;
                            break;
                        } else if (carLanes.lane4 === 0 && heat.lane4 === 0) {
                            heat.lane4 = car;
                            break;
                        }
                    }
                }
            }
        });
    }

    /**
     * Get current heat information
     */
    getCurrentHeat() {
        if (this.currentHeatIndex >= this.heats.length) {
            return null;
        }
        
        const heat = this.heats[this.currentHeatIndex];
        return {
            ...heat,
            racers: {
                lane1: this.getRacerInfo(heat.lane1),
                lane2: this.getRacerInfo(heat.lane2),
                lane3: null, // Lane 3 unused
                lane4: this.getRacerInfo(heat.lane4)
            }
        };
    }

    /**
     * Get racer information by ID
     */
    getRacerInfo(racerId) {
        if (!racerId) return null;
        return this.racers.find(racer => racer.id === racerId) || null;
    }

    /**
     * Enter heat results
     * @param {number} heatNumber - Heat number (1-indexed)
     * @param {Object} results - { first: laneNumber, second: laneNumber, third: laneNumber }
     */
    enterHeatResults(heatNumber, results) {
        const heat = this.heats.find(h => h.heatNumber === heatNumber);
        if (!heat || heat.completed) {
            return false;
        }

        // Map lane numbers to racer IDs
        const laneToRacerId = {
            1: heat.lane1,
            2: heat.lane2,
            4: heat.lane4
        };

        // Award points: 3 for 1st, 2 for 2nd, 1 for 3rd
        const pointsMap = { first: 3, second: 2, third: 1 };
        
        Object.entries(results).forEach(([place, lane]) => {
            if (lane && laneToRacerId[lane]) {
                const racerId = laneToRacerId[lane];
                const racer = this.racers.find(r => r.id === racerId);
                if (racer) {
                    const points = pointsMap[place];
                    racer.totalPoints += points;
                    racer.races.push({
                        heatNumber,
                        lane,
                        place,
                        points
                    });
                }
            }
        });

        heat.results = results;
        heat.completed = true;

        // Always advance to the next uncompleted heat
        this.advanceToNextHeat();

        // Check if race is complete
        if (this.heats.filter(h => !h.isFinalHeat).every(h => h.completed)) {
            // Check for ties in top 3 and create final heat if needed
            if (this.checkForTiesAndCreateFinalHeat()) {
                // Final heat created, continue racing
                return true;
            } else {
                // No ties, race is complete
                this.raceCompleted = true;
                this.calculateFinalStandings();
            }
        }

        this.saveState();
        return true;
    }

    /**
     * Check for ties in top 3 and create final heat if needed
     */
    checkForTiesAndCreateFinalHeat() {
        // Get current standings (before final standings calculation)
        const standings = this.getStandings();
        
        // Group racers by points to find ties
        const pointGroups = {};
        standings.forEach(racer => {
            if (!pointGroups[racer.totalPoints]) {
                pointGroups[racer.totalPoints] = [];
            }
            pointGroups[racer.totalPoints].push(racer);
        });
        
        // Find tied racers in top 3 positions
        const tiedRacers = [];
        let positionsChecked = 0;
        
        // Sort point groups by points (descending)
        const sortedPoints = Object.keys(pointGroups).map(p => parseInt(p)).sort((a, b) => b - a);
        
        for (const points of sortedPoints) {
            const racersWithPoints = pointGroups[points];
            
            // If this group has ties and involves top 3 positions
            if (racersWithPoints.length > 1 && positionsChecked < 3) {
                // Check if any of these positions would be in top 3
                if (positionsChecked + racersWithPoints.length > 1 && positionsChecked < 3) {
                    tiedRacers.push(...racersWithPoints);
                }
            }
            
            positionsChecked += racersWithPoints.length;
            if (positionsChecked >= 3) break;
        }
        
        // Create final heat if there are ties
        if (tiedRacers.length > 1) {
            this.createFinalHeat(tiedRacers);
            return true; // Final heat created
        }
        
        return false; // No ties, proceed to completion
    }
    
    /**
     * Create a special final heat with tied racers
     */
    createFinalHeat(tiedRacers) {
        const finalHeat = {
            heatNumber: this.heats.length + 1,
            isFinalHeat: true,
            tiedRacers: tiedRacers.map(r => r.id),
            lane1: tiedRacers[0]?.id || 0,
            lane2: tiedRacers[1]?.id || 0,
            lane3: 0, // Unused
            lane4: tiedRacers[2]?.id || 0,
            results: { first: null, second: null, third: null },
            completed: false
        };
        
        this.heats.push(finalHeat);
        this.currentHeatIndex = this.heats.length - 1;
        console.log('🏆 Final heat created with tied racers:', tiedRacers.map(r => r.name));
    }

    /**
     * Advance to the next uncompleted heat
     */
    advanceToNextHeat() {
        // Find the next uncompleted heat
        for (let i = 0; i < this.heats.length; i++) {
            if (!this.heats[i].completed) {
                this.currentHeatIndex = i;
                return;
            }
        }
        // If all heats are completed, set to end
        this.currentHeatIndex = this.heats.length;
    }

    /**
     * Calculate final standings
     */
    calculateFinalStandings() {
        // Check if there was a final heat and use its results for tied racers
        const finalHeat = this.heats.find(h => h.isFinalHeat && h.completed);
        
        if (finalHeat) {
            // Handle final heat results first
            this.applyFinalHeatResults(finalHeat);
        } else {
            // Standard sorting with enhanced tiebreaking
            this.racers.sort((a, b) => {
                // Primary: Total points (descending)
                if (b.totalPoints !== a.totalPoints) {
                    return b.totalPoints - a.totalPoints;
                }

                // Secondary: Best single race finish (1st is better than 2nd, etc.)
                const aBestFinish = Math.min(...a.races.map(race => 
                    race.place === 'first' ? 1 : race.place === 'second' ? 2 : 3
                ));
                const bBestFinish = Math.min(...b.races.map(race => 
                    race.place === 'first' ? 1 : race.place === 'second' ? 2 : 3
                ));
                
                if (aBestFinish !== bBestFinish) {
                    return aBestFinish - bBestFinish; // Lower is better (1st beats 2nd)
                }

                // Tertiary: Count of best finishes (more 1st places beats fewer)
                const aFirsts = a.races.filter(race => race.place === 'first').length;
                const bFirsts = b.races.filter(race => race.place === 'first').length;
                
                if (aFirsts !== bFirsts) {
                    return bFirsts - aFirsts; // More firsts is better
                }

                // Quaternary: Count of second places
                const aSeconds = a.races.filter(race => race.place === 'second').length;
                const bSeconds = b.races.filter(race => race.place === 'second').length;
                
                if (aSeconds !== bSeconds) {
                    return bSeconds - aSeconds; // More seconds is better
                }

                // Final fallback: Alphabetical by name
                return a.name.localeCompare(b.name);
            });
        }

        // Assign final positions
        this.racers.forEach((racer, index) => {
            racer.position = index + 1;
        });
    }
    
    /**
     * Apply final heat results to determine standings for tied racers
     */
    applyFinalHeatResults(finalHeat) {
        // Get racers who were not in the final heat
        const nonFinalHeatRacers = this.racers.filter(r => !finalHeat.tiedRacers.includes(r.id));
        const finalHeatRacers = this.racers.filter(r => finalHeat.tiedRacers.includes(r.id));
        
        // Sort non-final heat racers normally
        nonFinalHeatRacers.sort((a, b) => {
            if (b.totalPoints !== a.totalPoints) {
                return b.totalPoints - a.totalPoints;
            }
            return a.name.localeCompare(b.name);
        });
        
        // Sort final heat racers by their final heat results
        finalHeatRacers.sort((a, b) => {
            const aFinalRace = a.races.find(race => race.heatNumber === finalHeat.heatNumber);
            const bFinalRace = b.races.find(race => race.heatNumber === finalHeat.heatNumber);
            
            if (!aFinalRace && !bFinalRace) return a.name.localeCompare(b.name);
            if (!aFinalRace) return 1;
            if (!bFinalRace) return -1;
            
            const aPlace = aFinalRace.place === 'first' ? 1 : aFinalRace.place === 'second' ? 2 : 3;
            const bPlace = bFinalRace.place === 'first' ? 1 : bFinalRace.place === 'second' ? 2 : 3;
            
            return aPlace - bPlace;
        });
        
        // Combine results: final heat winners first, then others by points
        const tiedPoints = finalHeatRacers[0]?.totalPoints;
        const higherPointRacers = nonFinalHeatRacers.filter(r => r.totalPoints > tiedPoints);
        const lowerPointRacers = nonFinalHeatRacers.filter(r => r.totalPoints <= tiedPoints);
        
        this.racers = [...higherPointRacers, ...finalHeatRacers, ...lowerPointRacers];
    }

    /**
     * Get current standings
     */
    getStandings() {
        const standings = [...this.racers].sort((a, b) => {
            // Use same enhanced tiebreaking as calculateFinalStandings
            if (b.totalPoints !== a.totalPoints) {
                return b.totalPoints - a.totalPoints;
            }

            // Best single race finish tiebreaker
            const aBestFinish = Math.min(...a.races.map(race => 
                race.place === 'first' ? 1 : race.place === 'second' ? 2 : 3
            ));
            const bBestFinish = Math.min(...b.races.map(race => 
                race.place === 'first' ? 1 : race.place === 'second' ? 2 : 3
            ));
            
            if (aBestFinish !== bBestFinish) {
                return aBestFinish - bBestFinish;
            }

            // Count of first places tiebreaker
            const aFirsts = a.races.filter(race => race.place === 'first').length;
            const bFirsts = b.races.filter(race => race.place === 'first').length;
            
            if (aFirsts !== bFirsts) {
                return bFirsts - aFirsts;
            }

            // Count of second places tiebreaker
            const aSeconds = a.races.filter(race => race.place === 'second').length;
            const bSeconds = b.races.filter(race => race.place === 'second').length;
            
            if (aSeconds !== bSeconds) {
                return bSeconds - aSeconds;
            }

            return a.name.localeCompare(b.name);
        });

        return standings.map((racer, index) => ({
            ...racer,
            currentPosition: index + 1
        }));
    }

    /**
     * Get race progress
     */
    getRaceProgress() {
        const completedHeats = this.heats.filter(h => h.completed).length;
        return {
            completedHeats,
            totalHeats: this.heats.length,
            currentHeatNumber: this.currentHeatIndex + 1,
            percentComplete: Math.round((completedHeats / this.heats.length) * 100),
            raceCompleted: this.raceCompleted
        };
    }

    /**
     * Navigate to specific heat
     */
    goToHeat(heatNumber) {
        const heatIndex = heatNumber - 1;
        if (heatIndex >= 0 && heatIndex < this.heats.length) {
            this.currentHeatIndex = heatIndex;
            this.saveState();
            return true;
        }
        return false;
    }

    /**
     * Reset race
     */
    resetRace() {
        this.racers.forEach(racer => {
            racer.totalPoints = 0;
            racer.races = [];
            racer.position = null;
        });

        this.heats.forEach(heat => {
            heat.results = { first: null, second: null, third: null };
            heat.completed = false;
        });

        this.currentHeatIndex = 0;
        this.raceCompleted = false;
        this.saveState();
    }

    /**
     * Save state to localStorage
     */
    saveState() {
        const state = {
            racers: this.racers,
            heats: this.heats,
            currentHeatIndex: this.currentHeatIndex,
            raceCompleted: this.raceCompleted,
            timestamp: Date.now()
        };
        localStorage.setItem('heatRaceState', JSON.stringify(state));
    }

    /**
     * Load state from localStorage
     */
    loadState() {
        const saved = localStorage.getItem('heatRaceState');
        if (saved) {
            const state = JSON.parse(saved);
            this.racers = state.racers || [];
            this.heats = state.heats || [];
            this.currentHeatIndex = state.currentHeatIndex || 0;
            this.raceCompleted = state.raceCompleted || false;
            return true;
        }
        return false;
    }

    /**
     * Export race data
     */
    exportRaceData() {
        return {
            racers: this.racers,
            heats: this.heats,
            standings: this.getStandings(),
            progress: this.getRaceProgress(),
            exportDate: new Date().toISOString()
        };
    }
}

// Global instance
window.heatRacing = new HeatRacingSystem();