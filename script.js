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
        this.tournamentNameInput = document.getElementById('tournamentNameInput');
        this.participantInput = document.getElementById('racerNameInput');
        this.addRacerBtn = document.getElementById('addRacerBtn');
        this.startTournamentBtn = document.getElementById('startTournamentBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.racersGrid = document.getElementById('racersGrid');
        this.racerCount = document.getElementById('racerCount');
        this.participantCount = document.getElementById('participantCount');
        this.currentTournamentName = document.getElementById('currentTournamentName');
        
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
        
        // Tournament name events
        this.tournamentNameInput?.addEventListener('input', () => this.updateTournamentName());
        this.tournamentNameInput?.addEventListener('blur', () => this.autoSave());
        
        // Team management events
        this.ageGroupFilter?.addEventListener('change', () => this.filterByAgeGroup());
        this.bulkAssignBtn?.addEventListener('click', () => this.bulkAssignTeam());
        
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
        this.autoSave();
    }

    addRacerToGrid(racer) {
        if (!this.racersGrid) return;
        
        const racerCard = document.createElement('div');
        racerCard.className = 'racer-card';
        racerCard.innerHTML = `
            <div class="racer-info">
                <div class="racer-name">${racer.name}</div>
                <div class="car-number">Car #${racer.carNumber}</div>
                ${racer.ageGroup ? `<div class="team-badge team-${racer.ageGroup.toLowerCase()}">${racer.ageGroup}</div>` : ''}
            </div>
            <button class="remove-racer-btn" onclick="this.parentElement.remove(); raceManager.updateCounts(); raceManager.updateStartButton(); raceManager.autoSave();">×</button>
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
            ageGroup: card.querySelector('.team-badge')?.textContent || ''
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
            if (this.tournamentNameInput) this.tournamentNameInput.value = '';
            this.updateTournamentName();
            this.updateCounts();
            this.updateStartButton();
            this.autoSave();
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
            
            // The heat system automatically advances to the next heat
            // No need to manually advance here
            this.updateRaceDisplay();
        }
    }

    updateStandings() {
        const standings = window.heatRacing.getStandings();
        
        if (!this.standingsList) return;
        
        this.standingsList.innerHTML = standings.map((racer, index) => {
            // Get team from racer's ageGroup property
            const team = racer.ageGroup || '';
            const teamBadge = team ? `<span class="team-badge-small team-${team.toLowerCase()}">${team}</span>` : '';
            
            return `
            <div class="standing-item">
                <div class="position">${index + 1}</div>
                <div class="racer-details">
                    <div class="name">${racer.name} ${teamBadge}</div>
                    <div class="car-info">Car #${racer.carNumber} • ${racer.totalPoints} pts</div>
                </div>
                <div class="races-count">${racer.races.length}/3</div>
            </div>`;
        }).join('');
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
                ageGroup: i % 2 === 0 ? 'Guardians' : 'Knights'
            });
        }
        
        this.updateCounts();
        this.updateStartButton();
        this.autoSave();
    }

    loadSavedData() {
        // Load saved tournament setup
        if (this.loadSavedSetup()) {
            console.log('✅ Loaded saved tournament setup');
        } else {
            console.log('💡 No saved setup found, starting fresh');
        }
        
        // Also try to load heat racing state if available
        if (window.heatRacing.loadState()) {
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

    updateDisplay() {
        this.updateCounts();
        this.updateStartButton();
        this.updateTournamentName(); // Set default name
    }
    
    // Auto-save functionality
    autoSave() {
        const racers = this.getCurrentRacers();
        const tournamentName = this.tournamentNameInput?.value?.trim() || 'Pinewood Derby';
        const saveData = {
            tournamentName: tournamentName,
            racers: racers,
            timestamp: Date.now(),
            teams: ['Guardians', 'Knights']
        };
        
        try {
            localStorage.setItem('pinewood_derby_setup', JSON.stringify(saveData));
            console.log('💾 Auto-saved:', racers.length, 'racers');
            this.showSaveIndicator();
        } catch (error) {
            console.error('❌ Auto-save failed:', error);
        }
    }
    
    showSaveIndicator() {
        let indicator = document.getElementById('save-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'save-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #48bb78;
                color: white;
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s;
                box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
            `;
            document.body.appendChild(indicator);
        }
        
        indicator.textContent = '💾 Saved';
        indicator.style.opacity = '1';
        
        setTimeout(() => {
            indicator.style.opacity = '0';
        }, 1500);
    }
    
    getCurrentRacers() {
        const racerCards = this.racersGrid?.querySelectorAll('.racer-card') || [];
        return Array.from(racerCards).map(card => ({
            name: card.querySelector('.racer-name')?.textContent || '',
            carNumber: parseInt(card.querySelector('.car-number')?.textContent?.match(/\d+/)?.[0] || '1'),
            ageGroup: card.querySelector('.team-badge')?.textContent || ''
        }));
    }
    
    loadSavedSetup() {
        try {
            const saved = localStorage.getItem('pinewood_derby_setup');
            if (saved) {
                const saveData = JSON.parse(saved);
                console.log('📂 Loading saved setup...', saveData.racers?.length || 0, 'racers');
                
                if (saveData.racers && Array.isArray(saveData.racers) && saveData.racers.length > 0) {
                    // Restore tournament name
                    if (saveData.tournamentName && this.tournamentNameInput) {
                        this.tournamentNameInput.value = saveData.tournamentName;
                        this.updateTournamentName();
                    }
                    
                    // Clear existing racers
                    if (this.racersGrid) {
                        this.racersGrid.innerHTML = '';
                    }
                    
                    // Load saved racers
                    saveData.racers.forEach(racer => {
                        this.addRacerToGrid({
                            name: racer.name,
                            carNumber: racer.carNumber,
                            ageGroup: racer.ageGroup || ''
                        });
                    });
                    
                    this.updateCounts();
                    this.updateStartButton();
                    console.log('✅ Saved setup loaded successfully');
                    return true;
                }
            }
        } catch (error) {
            console.error('❌ Error loading saved setup:', error);
        }
        return false;
    }
    
    // Tournament name management
    updateTournamentName() {
        const name = this.tournamentNameInput?.value?.trim() || 'Pinewood Derby';
        if (this.currentTournamentName) {
            this.currentTournamentName.textContent = name;
        }
        console.log('📝 Tournament name updated:', name);
    }
    
    // Team management functionality
    filterByAgeGroup() {
        const selectedTeam = this.ageGroupFilter?.value;
        const racerCards = this.racersGrid?.querySelectorAll('.racer-card') || [];
        
        console.log('🔍 Filtering by team:', selectedTeam || 'All');
        
        racerCards.forEach(card => {
            const teamBadge = card.querySelector('.team-badge');
            const teamName = teamBadge?.textContent || '';
            
            if (!selectedTeam || teamName === selectedTeam) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    bulkAssignTeam() {
        const racerCards = this.racersGrid?.querySelectorAll('.racer-card') || [];
        
        if (racerCards.length === 0) {
            alert('No racers to assign teams to!');
            return;
        }
        
        // Show dialog to select team for bulk assignment
        const team = prompt('Assign which team to ALL racers?\n\nEnter:\n• "Guardians" for Guardians team\n• "Knights" for Knights team\n• "Clear" to remove all team assignments');
        
        if (!team) {
            console.log('❌ Bulk assign cancelled');
            return;
        }
        
        const teamNormalized = team.trim();
        let count = 0;
        
        racerCards.forEach(card => {
            // Apply to ALL racers regardless of filter state
            const racerInfo = card.querySelector('.racer-info');
            const existingBadge = card.querySelector('.team-badge');
            
            // Remove existing team badge
            if (existingBadge) {
                existingBadge.remove();
            }
            
            // Add new team badge if not clearing
            if (teamNormalized.toLowerCase() !== 'clear') {
                if (teamNormalized === 'Guardians' || teamNormalized === 'Knights') {
                    const teamBadge = document.createElement('div');
                    teamBadge.className = `team-badge team-${teamNormalized.toLowerCase()}`;
                    teamBadge.textContent = teamNormalized;
                    racerInfo.appendChild(teamBadge);
                    count++;
                } else {
                    alert('Invalid team name! Use "Guardians" or "Knights"');
                    return;
                }
            } else {
                count++;
            }
        });
        
        // Reset filter to show all racers after bulk assignment
        if (this.ageGroupFilter) {
            this.ageGroupFilter.value = '';
        }
        this.filterByAgeGroup(); // Apply the "show all" filter
        
        this.autoSave();
        
        if (teamNormalized.toLowerCase() === 'clear') {
            console.log(`✅ Cleared teams from ${count} racers`);
            alert(`Cleared teams from ${count} racers. Filter reset to show all racers.`);
        } else {
            console.log(`✅ Assigned ${teamNormalized} team to ${count} racers`);
            alert(`Assigned ${teamNormalized} team to ${count} racers. Filter reset to show all racers.`);
        }
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