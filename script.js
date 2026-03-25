/**
 * 🏁 Pinewood Derby Heat Racing System - Main Script
 * Integrates with heat-system.js for PPN algorithm and race management
 */

class HeatRacingManager {
    constructor() {
        console.log('🔧 HeatRacingManager constructor started');
        this.raceSetup = true;  // Start in setup mode
        this.currentResults = { first: null, second: null, third: null };
        
        console.log('🔧 Initializing elements...');
        this.initializeElements();
        console.log('🔧 Binding events...');
        this.bindEvents();
        console.log('🔧 Loading saved data...');
        this.loadSavedData();
        console.log('🔧 Updating display...');
        this.updateDisplay();
        console.log('✅ HeatRacingManager constructor completed');
    }

    initializeElements() {
        // Setup phase elements
        this.setupPhase = document.getElementById('setupPhase');
        this.heatRacingPhase = document.getElementById('heatRacingPhase');
        this.participantInput = document.getElementById('racerNameInput');
        this.addRacerBtn = document.getElementById('addRacerBtn');
        this.startTournamentBtn = document.getElementById('startTournamentBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.racersGrid = document.getElementById('racersGrid');
        this.racerCount = document.getElementById('racerCount');
        this.participantCount = document.getElementById('participantCount');
        
        // Heat racing phase elements
        this.backToSetupBtn = document.getElementById('backToSetupBtn');
        this.resetRaceBtn = document.getElementById('resetRaceBtn');
        this.currentHeatNumber = document.getElementById('currentHeatNumber');
        this.totalHeats = document.getElementById('totalHeats');
        this.progressFill = document.getElementById('progressFill');
        this.progressPercent = document.getElementById('progressPercent');
        
        // Current heat elements
        this.heatSelector = document.getElementById('heatSelector');
        this.prevHeatBtn = document.getElementById('prevHeatBtn');
        this.nextHeatBtn = document.getElementById('nextHeatBtn');
        
        // Lane racer displays
        this.lane1CarNumber = document.getElementById('lane1CarNumber');
        this.lane1RacerName = document.getElementById('lane1RacerName');
        this.lane2CarNumber = document.getElementById('lane2CarNumber');
        this.lane2RacerName = document.getElementById('lane2RacerName');
        this.lane4CarNumber = document.getElementById('lane4CarNumber');
        this.lane4RacerName = document.getElementById('lane4RacerName');
        
        // Results entry elements
        this.resultsEntry = document.getElementById('resultsEntry');
        this.submitHeatBtn = document.getElementById('submitHeatBtn');
        this.clearResultsBtn = document.getElementById('clearResultsBtn');
        this.standingsList = document.getElementById('standingsList');
        this.heatGrid = document.getElementById('heatGrid');
        
        // Race completion elements
        this.raceCompletion = document.getElementById('raceCompletion');
        this.newRaceBtn = document.getElementById('newRaceBtn');
        this.exportResultsBtn = document.getElementById('exportResultsBtn');
        
        // Age group elements (keeping from original)
        this.ageGroupSelect = document.getElementById('ageGroupInput');
        this.ageGroupFilter = document.getElementById('ageGroupFilter');
        this.ageGroupStats = document.getElementById('ageGroupStats');
        this.bulkAssignBtn = document.getElementById('bulkAssignBtn');
    }

    bindEvents() {
        // Setup phase events
        this.participantInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addRacer();
        });
        this.addRacerBtn?.addEventListener('click', () => this.addRacer());
        this.startTournamentBtn?.addEventListener('click', () => this.startRace());
        this.clearAllBtn?.addEventListener('click', () => this.clearAll());
        
        // Heat racing events
        this.backToSetupBtn?.addEventListener('click', () => this.backToSetup());
        this.resetRaceBtn?.addEventListener('click', () => this.resetRace());
        this.prevHeatBtn?.addEventListener('click', () => this.previousHeat());
        this.nextHeatBtn?.addEventListener('click', () => this.nextHeat());
        this.heatSelector?.addEventListener('change', (e) => this.goToHeat(parseInt(e.target.value)));
        
        // Results entry events
        this.submitHeatBtn?.addEventListener('click', () => this.submitHeatResults());
        this.clearResultsBtn?.addEventListener('click', () => this.clearCurrentResults());
        
        // Race completion events
        this.newRaceBtn?.addEventListener('click', () => this.startNewRace());
        this.exportResultsBtn?.addEventListener('click', () => this.exportResults());
        
        // Finish button events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('finish-btn')) {
                this.handleFinishClick(e.target);
            }
        });
        
        // Age group events (keeping from original)
        this.ageGroupFilter?.addEventListener('change', () => this.filterByAgeGroup());
        this.bulkAssignBtn?.addEventListener('click', () => this.bulkAssignAgeGroup());
        
        // Quick setup buttons
        document.getElementById('quickSetup8')?.addEventListener('click', () => this.quickSetup(8));
        document.getElementById('quickSetup16')?.addEventListener('click', () => this.quickSetup(16));
    }

    addRacer() {
        const input = this.participantInput;
        if (!input || !input.value.trim()) return;

        const name = input.value.trim();
        const carNumber = this.getNextCarNumber();
        
        const racer = {
            name: name,
            carNumber: carNumber,
            ageGroup: this.ageGroupSelect?.value || ''
        };

        this.addRacerToGrid(racer);
        input.value = '';
        this.updateCounts();
        this.updateStartButton();
    }

    addRacerToGrid(racer) {
        if (!this.racersGrid) return;
        
        const racerCard = document.createElement('div');
        racerCard.className = 'racer-card';
        racerCard.innerHTML = `
            <div class="racer-info">
                <div class="racer-name">${racer.name}</div>
                <div class="car-number">Car #${racer.carNumber}</div>
                ${racer.ageGroup ? `<div class="age-group-badge">${racer.ageGroup}</div>` : ''}
            </div>
            <button class="remove-racer-btn" onclick="this.parentElement.remove(); raceManager.updateCounts(); raceManager.updateStartButton();">×</button>
        `;
        
        this.racersGrid.appendChild(racerCard);
    }

    getNextCarNumber() {
        const existingCards = this.racersGrid?.querySelectorAll('.racer-card') || [];
        const usedNumbers = Array.from(existingCards)
            .map(card => {
                const numberText = card.querySelector('.car-number')?.textContent || '';
                const match = numberText.match(/Car #(\d+)/);
                return match ? parseInt(match[1]) : 0;
            });
        
        let nextNumber = 1;
        while (usedNumbers.includes(nextNumber)) {
            nextNumber++;
        }
        return nextNumber;
    }

    getCurrentRacers() {
        const racerCards = this.racersGrid?.querySelectorAll('.racer-card') || [];
        return Array.from(racerCards).map(card => ({
            name: card.querySelector('.racer-name')?.textContent || '',
            carNumber: parseInt(card.querySelector('.car-number')?.textContent?.match(/\d+/)?.[0] || '1'),
            ageGroup: card.querySelector('.age-group-badge')?.textContent || ''
        }));
    }

    updateCounts() {
        const count = this.racersGrid?.children.length || 0;
        if (this.racerCount) this.racerCount.textContent = count;
        if (this.participantCount) this.participantCount.textContent = `${count} racers`;
    }

    updateStartButton() {
        const count = this.racersGrid?.children.length || 0;
        if (this.startTournamentBtn) {
            this.startTournamentBtn.disabled = count < 4;
            this.startTournamentBtn.textContent = count < 4 ? 
                `Add ${4 - count} more racers` : 'Start Heat Racing';
        }
    }

    clearAll() {
        if (confirm('Clear all racers? This cannot be undone.')) {
            if (this.racersGrid) this.racersGrid.innerHTML = '';
            this.updateCounts();
            this.updateStartButton();
        }
    }

    startRace() {
        const racers = this.getCurrentRacers();
        if (racers.length < 4) {
            alert('Need at least 4 racers to start the race!');
            return;
        }

        // Initialize the heat racing system
        window.heatRacing.setupRace(racers);
        
        // Switch to racing phase
        this.raceSetup = false;
        this.setupPhase.style.display = 'none';
        this.heatRacingPhase.style.display = 'block';
        
        this.initializeRaceInterface();
        this.updateRaceDisplay();
    }

    initializeRaceInterface() {
        // Populate heat selector
        if (this.heatSelector) {
            this.heatSelector.innerHTML = '';
            for (let i = 1; i <= window.heatRacing.heats.length; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                this.heatSelector.appendChild(option);
            }
        }
        
        // Set up heat grid
        this.updateHeatGrid();
    }

    updateRaceDisplay() {
        const progress = window.heatRacing.getRaceProgress();
        const currentHeat = window.heatRacing.getCurrentHeat();
        
        // Update progress
        if (this.currentHeatNumber) this.currentHeatNumber.textContent = progress.currentHeatNumber;
        if (this.totalHeats) this.totalHeats.textContent = progress.totalHeats;
        if (this.progressFill) this.progressFill.style.width = `${progress.percentComplete}%`;
        if (this.progressPercent) this.progressPercent.textContent = `${progress.percentComplete}%`;
        
        // Update heat selector
        if (this.heatSelector) this.heatSelector.value = progress.currentHeatNumber;
        
        // Update current heat display
        this.updateCurrentHeatDisplay(currentHeat);
        
        // Update standings
        this.updateStandings();
        
        // Update heat grid
        this.updateHeatGrid();
        
        // Check for race completion
        if (progress.raceCompleted) {
            this.showRaceCompletion();
        }
    }

    updateCurrentHeatDisplay(currentHeat) {
        if (!currentHeat) {
            this.showRaceCompletion();
            return;
        }

        // Update lane displays
        this.updateLaneDisplay(1, currentHeat.racers.lane1);
        this.updateLaneDisplay(2, currentHeat.racers.lane2);
        this.updateLaneDisplay(4, currentHeat.racers.lane4);
        
        // Show/hide results entry based on completion status
        const heat = window.heatRacing.heats.find(h => h.heatNumber === currentHeat.heatNumber);
        if (this.resultsEntry) {
            this.resultsEntry.style.display = heat?.completed ? 'none' : 'block';
        }
        
        // Update navigation buttons
        const heatIndex = window.heatRacing.currentHeatIndex;
        if (this.prevHeatBtn) this.prevHeatBtn.disabled = heatIndex <= 0;
        if (this.nextHeatBtn) this.nextHeatBtn.disabled = heatIndex >= window.heatRacing.heats.length - 1;
    }

    updateLaneDisplay(laneNumber, racer) {
        const carNumberEl = document.getElementById(`lane${laneNumber}CarNumber`);
        const racerNameEl = document.getElementById(`lane${laneNumber}RacerName`);
        
        if (racer) {
            if (carNumberEl) carNumberEl.textContent = `#${racer.carNumber}`;
            if (racerNameEl) racerNameEl.textContent = racer.name;
        } else {
            if (carNumberEl) carNumberEl.textContent = '-';
            if (racerNameEl) racerNameEl.textContent = 'Empty';
        }
    }

    handleFinishClick(button) {
        const lane = parseInt(button.dataset.lane);
        const place = button.dataset.place;
        
        // Clear previous selection for this place
        this.clearPlaceSelection(place);
        
        // Mark this button as selected
        button.classList.add('selected');
        
        // Store the selection
        this.currentResults[place] = lane;
        
        // Enable submit button if we have all three places
        this.updateSubmitButton();
    }

    clearPlaceSelection(place) {
        const buttons = document.querySelectorAll(`[data-place="${place}"]`);
        buttons.forEach(btn => btn.classList.remove('selected'));
    }

    updateSubmitButton() {
        const hasAllResults = this.currentResults.first && 
                             this.currentResults.second && 
                             this.currentResults.third;
        
        if (this.submitHeatBtn) {
            this.submitHeatBtn.disabled = !hasAllResults;
        }
    }

    clearCurrentResults() {
        this.currentResults = { first: null, second: null, third: null };
        
        // Clear all selected buttons
        const buttons = document.querySelectorAll('.finish-btn.selected');
        buttons.forEach(btn => btn.classList.remove('selected'));
        
        this.updateSubmitButton();
    }

    submitHeatResults() {
        const currentHeat = window.heatRacing.getCurrentHeat();
        if (!currentHeat) return;
        
        const success = window.heatRacing.enterHeatResults(
            currentHeat.heatNumber,
            this.currentResults
        );
        
        if (success) {
            this.clearCurrentResults();
            
            // Auto-advance to next heat if not complete
            if (!window.heatRacing.raceCompleted) {
                setTimeout(() => this.nextHeat(), 1000);
            }
            
            this.updateRaceDisplay();
        }
    }

    updateStandings() {
        const standings = window.heatRacing.getStandings();
        
        if (!this.standingsList) return;
        
        this.standingsList.innerHTML = standings.map((racer, index) => `
            <div class="standing-item ${index < 3 ? 'podium' : ''}">
                <div class="position">${index + 1}</div>
                <div class="racer-details">
                    <div class="name">${racer.name}</div>
                    <div class="car-info">Car #${racer.carNumber} • ${racer.totalPoints} pts</div>
                </div>
                <div class="races-count">${racer.races.length}/3</div>
            </div>
        `).join('');
    }

    updateHeatGrid() {
        if (!this.heatGrid) return;
        
        const heats = window.heatRacing.heats;
        const currentHeatIndex = window.heatRacing.currentHeatIndex;
        
        this.heatGrid.innerHTML = heats.map(heat => {
            const lane1Racer = window.heatRacing.getRacerInfo(heat.lane1);
            const lane2Racer = window.heatRacing.getRacerInfo(heat.lane2);
            const lane4Racer = window.heatRacing.getRacerInfo(heat.lane4);
            
            const isCurrent = heat.heatNumber === currentHeatIndex + 1;
            const isCompleted = heat.completed;
            
            return `
                <div class="heat-item ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}">
                    <div class="heat-number">Heat ${heat.heatNumber}</div>
                    <div class="heat-lanes">
                        <div class="lane-assignment">L1: ${lane1Racer?.name || 'Empty'}</div>
                        <div class="lane-assignment">L2: ${lane2Racer?.name || 'Empty'}</div>
                        <div class="lane-assignment">L4: ${lane4Racer?.name || 'Empty'}</div>
                    </div>
                    ${isCompleted ? '<div class="completed-badge">✓</div>' : ''}
                </div>
            `;
        }).join('');
    }

    previousHeat() {
        if (window.heatRacing.currentHeatIndex > 0) {
            window.heatRacing.currentHeatIndex--;
            this.updateRaceDisplay();
        }
    }

    nextHeat() {
        if (window.heatRacing.currentHeatIndex < window.heatRacing.heats.length - 1) {
            window.heatRacing.currentHeatIndex++;
            this.updateRaceDisplay();
        }
    }

    goToHeat(heatNumber) {
        window.heatRacing.goToHeat(heatNumber);
        this.updateRaceDisplay();
    }

    showRaceCompletion() {
        const standings = window.heatRacing.getStandings();
        
        if (this.raceCompletion && standings.length >= 3) {
            // Update podium
            this.updatePodiumPlace('firstPlace', standings[0]);
            this.updatePodiumPlace('secondPlace', standings[1]);
            this.updatePodiumPlace('thirdPlace', standings[2]);
            
            this.raceCompletion.style.display = 'block';
        }
    }

    updatePodiumPlace(elementId, racer) {
        const element = document.getElementById(elementId);
        if (element && racer) {
            element.querySelector('.name').textContent = racer.name;
            element.querySelector('.points').textContent = `${racer.totalPoints} pts`;
        }
    }

    backToSetup() {
        if (confirm('Return to setup? Current race progress will be lost.')) {
            this.raceSetup = true;
            this.setupPhase.style.display = 'block';
            this.heatRacingPhase.style.display = 'none';
            this.raceCompletion.style.display = 'none';
        }
    }

    resetRace() {
        if (confirm('Reset the current race? All results will be cleared.')) {
            window.heatRacing.resetRace();
            this.clearCurrentResults();
            this.raceCompletion.style.display = 'none';
            this.updateRaceDisplay();
        }
    }

    startNewRace() {
        this.raceCompletion.style.display = 'none';
        this.backToSetup();
    }

    exportResults() {
        const raceData = window.heatRacing.exportRaceData();
        const dataStr = JSON.stringify(raceData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `pinewood-derby-results-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    quickSetup(count) {
        const names = [
            'Alex', 'Bailey', 'Charlie', 'Dana', 'Evan', 'Finley', 'Gray', 'Harper',
            'Izzy', 'Jordan', 'Kai', 'Luna', 'Max', 'Nova', 'Oakley', 'Parker',
            'Quinn', 'River', 'Sage', 'Taylor', 'Uma', 'Vale', 'Wren', 'Zara'
        ];
        
        // Clear existing racers
        if (this.racersGrid) this.racersGrid.innerHTML = '';
        
        // Add racers
        for (let i = 0; i < count && i < names.length; i++) {
            this.addRacerToGrid({
                name: names[i],
                carNumber: i + 1,
                ageGroup: ''
            });
        }
        
        this.updateCounts();
        this.updateStartButton();
    }

    loadSavedData() {
        // Try to load saved race state
        if (window.heatRacing.loadState()) {
            // If we have saved data, check if we should restore the race interface
            if (window.heatRacing.racers.length > 0) {
                // Populate the setup phase with racers
                window.heatRacing.racers.forEach(racer => {
                    this.addRacerToGrid(racer);
                });
                this.updateCounts();
                this.updateStartButton();
                
                // If race was in progress, offer to continue
                if (window.heatRacing.heats.length > 0) {
                    const progress = window.heatRacing.getRaceProgress();
                    if (progress.completedHeats > 0) {
                        if (confirm('Continue previous race?')) {
                            this.startRace();
                        }
                    }
                }
            }
        }
    }

    updateDisplay() {
        this.updateCounts();
        this.updateStartButton();
    }
    
    // Age group functionality (keeping from original)
    filterByAgeGroup() {
        // Implementation for age group filtering
    }
    
    bulkAssignAgeGroup() {
        // Implementation for bulk age group assignment
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🍌 DOM Content Loaded, initializing HeatRacingManager...');
    try {
        window.raceManager = new HeatRacingManager();
        console.log('✅ HeatRacingManager initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing HeatRacingManager:', error);
    }
});

// Global helper functions for HTML onclick events
function removeRacer(button) {
    button.parentElement.remove();
    window.raceManager.updateCounts();
    window.raceManager.updateStartButton();
}