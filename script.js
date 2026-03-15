// Multi-Tournament Pinewood Derby Bracket System
class TournamentManager {
    constructor() {
        this.tournaments = new Map();
        this.activeTournament = null;
        this.activeTournamentId = null;
        this.raceDayMode = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadTournaments();
        this.updateTournamentSelector();
    }

    initializeElements() {
        // Tournament management elements
        this.tournamentSelector = document.getElementById('tournamentSelector');
        this.newTournamentBtn = document.getElementById('newTournamentBtn');
        this.cloneTournamentBtn = document.getElementById('cloneTournamentBtn');
        this.createByAgeGroupBtn = document.getElementById('createByAgeGroupBtn');
        this.deleteTournamentBtn = document.getElementById('deleteTournamentBtn');
        this.exportTournamentBtn = document.getElementById('exportTournamentBtn');
        this.importTournamentBtn = document.getElementById('importTournamentBtn');
        this.importRacersBtn = document.getElementById('importRacersBtn');
        this.downloadTemplateBtn = document.getElementById('downloadTemplateBtn');
        this.importFileInput = document.getElementById('importFileInput');
        this.importRacersInput = document.getElementById('importRacersInput');
        this.raceDayModeBtn = document.getElementById('raceDayModeBtn');
        this.tournamentManagementSection = document.getElementById('tournamentManagement');
        this.currentTournamentName = document.getElementById('currentTournamentName');
        this.tournamentStatus = document.getElementById('tournamentStatus');
    }

    bindEvents() {
        this.tournamentSelector?.addEventListener('change', (e) => {
            if (e.target.value) {
                this.switchToTournament(e.target.value);
            }
        });

        this.newTournamentBtn?.addEventListener('click', () => this.createNewTournament());
        this.cloneTournamentBtn?.addEventListener('click', () => this.cloneTournament());
        this.createByAgeGroupBtn?.addEventListener('click', () => this.createTournamentsByAgeGroup());
        this.deleteTournamentBtn?.addEventListener('click', () => this.deleteTournament());
        this.exportTournamentBtn?.addEventListener('click', () => this.exportTournament());
        this.importTournamentBtn?.addEventListener('click', () => this.importFileInput?.click());
        this.importRacersBtn?.addEventListener('click', () => this.importRacersInput?.click());
        this.downloadTemplateBtn?.addEventListener('click', () => this.downloadTemplate());
        this.importFileInput?.addEventListener('change', (e) => this.importTournament(e));
        this.importRacersInput?.addEventListener('change', (e) => this.importRacers(e));
        this.raceDayModeBtn?.addEventListener('click', () => this.toggleRaceDayMode());
    }

    createNewTournament() {
        const name = prompt('Enter tournament name:');
        if (!name || !name.trim()) return;

        const tournamentId = `tournament_${Date.now()}`;
        const timestamp = new Date().toLocaleDateString();
        const tournamentName = `${name.trim()} (${timestamp})`;
        
        const tournament = new PinewoodDerbyTournament(tournamentId, tournamentName);
        this.tournaments.set(tournamentId, tournament);
        
        this.switchToTournament(tournamentId);
        this.saveTournamentsList();
        this.updateTournamentSelector();
    }

    cloneTournament() {
        if (!this.activeTournament) {
            alert('No active tournament to clone');
            return;
        }

        const name = prompt('Enter name for cloned tournament:');
        if (!name || !name.trim()) return;

        const tournamentId = `tournament_${Date.now()}`;
        const timestamp = new Date().toLocaleDateString();
        const tournamentName = `${name.trim()} (${timestamp})`;
        
        // Clone the current tournament data
        const currentData = this.activeTournament.getState();
        const tournament = new PinewoodDerbyTournament(tournamentId, tournamentName);
        
        // Copy racers but reset tournament state
        tournament.racers = [...currentData.racers];
        tournament.updateRacersDisplay();
        
        this.tournaments.set(tournamentId, tournament);
        this.switchToTournament(tournamentId);
        this.saveTournamentsList();
        this.updateTournamentSelector();
    }

    deleteTournament() {
        if (!this.activeTournamentId || this.tournaments.size <= 1) {
            alert('Cannot delete the only tournament');
            return;
        }

        const tournamentName = this.tournaments.get(this.activeTournamentId).name;
        if (!confirm(`Delete tournament "${tournamentName}"? This cannot be undone.`)) {
            return;
        }

        // Remove from localStorage
        localStorage.removeItem(`tournament_${this.activeTournamentId}`);
        
        // Remove from memory
        this.tournaments.delete(this.activeTournamentId);
        
        // Switch to the first available tournament
        const firstTournamentId = this.tournaments.keys().next().value;
        if (firstTournamentId) {
            this.switchToTournament(firstTournamentId);
        } else {
            // Create a new tournament if none exist
            this.createNewTournament();
        }
        
        this.saveTournamentsList();
        this.updateTournamentSelector();
    }

    exportTournament() {
        if (!this.activeTournament) return;

        const data = {
            name: this.activeTournament.name,
            exportDate: new Date().toISOString(),
            tournamentData: this.activeTournament.getState()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.activeTournament.name.replace(/[^a-z0-9]/gi, '_')}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importTournament(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (!data.tournamentData) {
                    alert('Invalid tournament file format');
                    return;
                }

                const tournamentId = `tournament_${Date.now()}`;
                const tournamentName = `${data.name} (Imported)`;
                
                const tournament = new PinewoodDerbyTournament(tournamentId, tournamentName);
                tournament.loadState(data.tournamentData);
                
                this.tournaments.set(tournamentId, tournament);
                this.switchToTournament(tournamentId);
                this.saveTournamentsList();
                this.updateTournamentSelector();
                
                alert('Tournament imported successfully!');
            } catch (error) {
                alert('Error importing tournament file');
                console.error(error);
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    createTournamentsByAgeGroup() {
        if (!this.activeTournament || this.activeTournament.racers.length === 0) {
            alert('Please add some racers first');
            return;
        }

        const ageGroups = this.activeTournament.getAgeGroups();
        
        if (ageGroups.length === 0) {
            alert('No age groups found. Please assign age groups to racers first.');
            return;
        }

        if (!confirm(`Create ${ageGroups.length} tournaments for age groups: ${ageGroups.join(', ')}?`)) {
            return;
        }

        ageGroups.forEach(ageGroup => {
            const racersInGroup = this.activeTournament.racers.filter(racer => racer.ageGroup === ageGroup);
            if (racersInGroup.length >= 4) {
                const tournamentId = `tournament_${Date.now()}_${ageGroup.replace(/\s+/g, '_')}`;
                const tournamentName = `${ageGroup} Division (${new Date().toLocaleDateString()})`;
                
                const tournament = new PinewoodDerbyTournament(tournamentId, tournamentName);
                tournament.racers = racersInGroup.map(racer => ({
                    ...racer,
                    id: Date.now() + Math.random() // Generate new ID to avoid conflicts
                }));
                tournament.updateRacersDisplay();
                
                this.tournaments.set(tournamentId, tournament);
            } else {
                alert(`Skipping ${ageGroup} - needs at least 4 racers (found ${racersInGroup.length})`);
            }
        });

        this.saveTournamentsList();
        this.updateTournamentSelector();
        alert('Age group tournaments created successfully!');
    }

    downloadTemplate() {
        const template = {
            racers: [
                { name: "John Doe", ageGroup: "Tigers" },
                { name: "Jane Smith", ageGroup: "Wolves" },
                { name: "Mike Johnson", ageGroup: "Bears" },
                { name: "Sarah Wilson", ageGroup: "Webelos" }
            ]
        };

        const csvTemplate = "name,ageGroup\nJohn Doe,Tigers\nJane Smith,Wolves\nMike Johnson,Bears\nSarah Wilson,Webelos";

        // Create a ZIP-like multi-format download
        const jsonBlob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
        const csvBlob = new Blob([csvTemplate], { type: 'text/csv' });

        // Download JSON template
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        jsonLink.download = 'pinewood_derby_racers_template.json';
        jsonLink.click();
        URL.revokeObjectURL(jsonUrl);

        // Download CSV template
        setTimeout(() => {
            const csvUrl = URL.createObjectURL(csvBlob);
            const csvLink = document.createElement('a');
            csvLink.href = csvUrl;
            csvLink.download = 'pinewood_derby_racers_template.csv';
            csvLink.click();
            URL.revokeObjectURL(csvUrl);
        }, 100);
    }

    importRacers(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                let racersData;
                
                if (file.name.endsWith('.csv')) {
                    // Parse CSV
                    const text = e.target.result;
                    const lines = text.split('\n').filter(line => line.trim());
                    const headers = lines[0].split(',').map(h => h.trim());
                    
                    racersData = lines.slice(1).map(line => {
                        const values = line.split(',').map(v => v.trim());
                        const racer = {};
                        headers.forEach((header, index) => {
                            racer[header] = values[index] || '';
                        });
                        return racer;
                    });
                } else {
                    // Parse JSON
                    const data = JSON.parse(e.target.result);
                    racersData = data.racers || data;
                }

                if (!Array.isArray(racersData) || racersData.length === 0) {
                    alert('No racer data found in file');
                    return;
                }

                // Validate and import racers
                let importedCount = 0;
                racersData.forEach(racerData => {
                    if (racerData.name && racerData.name.trim()) {
                        this.activeTournament.addRacerWithAgeGroup(racerData.name.trim(), racerData.ageGroup || '');
                        importedCount++;
                    }
                });

                // Store for reload functionality
                localStorage.setItem('lastRacerImport', JSON.stringify(racersData));
                
                alert(`Successfully imported ${importedCount} racers!`);
                
                // Enable reload button
                const reloadBtn = document.getElementById('reloadRacersBtn');
                if (reloadBtn) reloadBtn.disabled = false;
                
            } catch (error) {
                alert('Error importing racer file. Please check the format.');
                console.error(error);
            }
        };
        
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    switchToTournament(tournamentId) {
        if (this.activeTournament) {
            this.activeTournament.saveState();
        }

        this.activeTournamentId = tournamentId;
        this.activeTournament = this.tournaments.get(tournamentId);
        
        if (this.activeTournament) {
            this.activeTournament.show();
            this.updateCurrentTournamentDisplay();
            localStorage.setItem('activeTournamentId', tournamentId);
        }
    }

    updateTournamentSelector() {
        if (!this.tournamentSelector) return;

        this.tournamentSelector.innerHTML = '<option value="">Select Tournament...</option>';
        
        for (const [id, tournament] of this.tournaments) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = tournament.name;
            if (id === this.activeTournamentId) {
                option.selected = true;
            }
            this.tournamentSelector.appendChild(option);
        }

        // Enable/disable management buttons
        const hasActive = !!this.activeTournamentId;
        const canDelete = this.tournaments.size > 1;
        
        if (this.cloneTournamentBtn) this.cloneTournamentBtn.disabled = !hasActive;
        if (this.deleteTournamentBtn) this.deleteTournamentBtn.disabled = !hasActive || !canDelete;
        if (this.exportTournamentBtn) this.exportTournamentBtn.disabled = !hasActive;
    }

    updateCurrentTournamentDisplay() {
        if (this.currentTournamentName && this.activeTournament) {
            this.currentTournamentName.textContent = this.activeTournament.name;
        }
        
        if (this.tournamentStatus && this.activeTournament) {
            let status = 'Setup';
            if (this.activeTournament.tournamentStarted) {
                if (this.activeTournament.isComplete()) {
                    status = 'Completed';
                } else {
                    status = 'In Progress';
                }
            }
            this.tournamentStatus.textContent = status;
            this.tournamentStatus.className = `tournament-status status-${status.toLowerCase().replace(' ', '-')}`;
        }
    }

    toggleRaceDayMode() {
        this.raceDayMode = !this.raceDayMode;
        document.body.classList.toggle('race-day-mode', this.raceDayMode);
        
        if (this.raceDayModeBtn) {
            this.raceDayModeBtn.textContent = this.raceDayMode ? '🏁 Exit Race Day' : '🏁 Race Day Mode';
        }
        
        if (this.tournamentManagementSection) {
            this.tournamentManagementSection.style.display = this.raceDayMode ? 'none' : 'block';
        }
    }

    saveTournamentsList() {
        const tournamentsList = [];
        for (const [id, tournament] of this.tournaments) {
            tournamentsList.push({
                id: id,
                name: tournament.name,
                created: tournament.created || new Date().toISOString()
            });
        }
        localStorage.setItem('tournamentsList', JSON.stringify(tournamentsList));
    }

    loadTournaments() {
        const savedList = localStorage.getItem('tournamentsList');
        if (savedList) {
            const tournamentsList = JSON.parse(savedList);
            
            for (const tournamentInfo of tournamentsList) {
                const tournament = new PinewoodDerbyTournament(tournamentInfo.id, tournamentInfo.name);
                tournament.loadState();
                this.tournaments.set(tournamentInfo.id, tournament);
            }
        }

        // If no tournaments exist, create a default one
        if (this.tournaments.size === 0) {
            const defaultId = `tournament_${Date.now()}`;
            const defaultName = `Tournament (${new Date().toLocaleDateString()})`;
            const tournament = new PinewoodDerbyTournament(defaultId, defaultName);
            this.tournaments.set(defaultId, tournament);
        }

        // Load the last active tournament or the first one
        const lastActiveId = localStorage.getItem('activeTournamentId');
        if (lastActiveId && this.tournaments.has(lastActiveId)) {
            this.switchToTournament(lastActiveId);
        } else {
            const firstId = this.tournaments.keys().next().value;
            this.switchToTournament(firstId);
        }
    }
}

class PinewoodDerbyTournament {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.created = new Date().toISOString();
        this.racers = [];
        this.bracket = {};
        this.currentRound = 1;
        this.maxRounds = 0;
        this.tournamentStarted = false;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDateTime();
    }

    initializeElements() {
        // Setup phase elements
        this.setupPhase = document.getElementById('setupPhase');
        this.tournamentPhase = document.getElementById('tournamentPhase');
        this.racerNameInput = document.getElementById('racerNameInput');
        this.ageGroupInput = document.getElementById('ageGroupInput');
        this.addRacerBtn = document.getElementById('addRacerBtn');

        this.racersList = document.getElementById('racersList');
        this.racersGrid = document.getElementById('racersGrid');
        this.racerCount = document.getElementById('racerCount');
        this.ageGroupFilter = document.getElementById('ageGroupFilter');
        this.ageGroupStats = document.getElementById('ageGroupStats');
        this.bulkAssignBtn = document.getElementById('bulkAssignBtn');
        this.reloadRacersBtn = document.getElementById('reloadRacersBtn');
        this.preloadTestDataBtn = document.getElementById('preloadTestDataBtn');
        this.startTournamentBtn = document.getElementById('startTournamentBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');

        // Tournament phase elements
        this.backToSetupBtn = document.getElementById('backToSetupBtn');
        this.resetTournamentBtn = document.getElementById('resetTournamentBtn');
        this.currentRoundSpan = document.getElementById('currentRound');
        this.roundName = document.getElementById('roundName');
        this.bracketContainer = document.getElementById('bracketContainer');
        this.winnerAnnouncement = document.getElementById('winnerAnnouncement');
        this.winnerName = document.getElementById('winnerName');
        this.newTournamentBtn = document.getElementById('newTournamentBtn');

        // Info elements
        this.participantCount = document.getElementById('participantCount');
        this.tournamentDate = document.getElementById('tournamentDate');
    }

    bindEvents() {
        // Setup phase events
        this.addRacerBtn?.addEventListener('click', () => this.addRacer());
        this.racerNameInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addRacer();
        });

        this.ageGroupFilter?.addEventListener('change', () => this.updateRacersDisplay());
        this.bulkAssignBtn?.addEventListener('click', () => this.showBulkAssignDialog());
        this.reloadRacersBtn?.addEventListener('click', () => this.reloadLastImport());
        this.preloadTestDataBtn?.addEventListener('click', () => this.preloadTestData());

        this.startTournamentBtn?.addEventListener('click', () => this.startTournament());
        this.clearAllBtn?.addEventListener('click', () => this.clearAllRacers());

        // Tournament phase events
        this.backToSetupBtn?.addEventListener('click', () => this.backToSetup());
        this.resetTournamentBtn?.addEventListener('click', () => this.resetTournament());
        this.newTournamentBtn?.addEventListener('click', () => this.newTournament());
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        if (this.tournamentDate) {
            this.tournamentDate.textContent = now.toLocaleDateString('en-US', options);
        }
    }

    addRacer() {
        const name = this.racerNameInput?.value.trim();
        const ageGroup = this.ageGroupInput?.value || '';
        
        if (!name) {
            alert('Please enter a racer name');
            return;
        }
        
        if (this.racers.length >= 32) {
            alert('Maximum 32 racers allowed');
            return;
        }

        if (this.racers.some(racer => racer.name.toLowerCase() === name.toLowerCase())) {
            alert('Racer name already exists');
            return;
        }

        this.racers.push({
            id: Date.now() + Math.random(),
            name: name,
            ageGroup: ageGroup,
            eliminated: false
        });

        this.racerNameInput.value = '';
        this.ageGroupInput.value = '';
        this.updateRacersDisplay();
        this.updateAgeGroupFilter();
        this.racerNameInput.focus();
        this.saveState();
    }

    addRacerWithAgeGroup(name, ageGroup) {
        if (!name) return;
        
        if (this.racers.length >= 32) {
            alert('Maximum 32 racers allowed');
            return;
        }

        if (this.racers.some(racer => racer.name.toLowerCase() === name.toLowerCase())) {
            console.warn('Racer name already exists:', name);
            return;
        }

        this.racers.push({
            id: Date.now() + Math.random(),
            name: name,
            ageGroup: ageGroup || '',
            eliminated: false
        });

        this.updateRacersDisplay();
        this.updateAgeGroupFilter();
        this.saveState();
    }



    removeRacer(racerId) {
        this.racers = this.racers.filter(racer => racer.id !== racerId);
        this.updateRacersDisplay();
        this.updateAgeGroupFilter();
        this.saveState();
    }

    getAgeGroups() {
        const ageGroups = [...new Set(this.racers
            .filter(racer => racer.ageGroup && racer.ageGroup.trim())
            .map(racer => racer.ageGroup))];
        return ageGroups.sort();
    }

    updateAgeGroupFilter() {
        if (!this.ageGroupFilter) return;
        
        const currentValue = this.ageGroupFilter.value;
        const ageGroups = this.getAgeGroups();
        
        this.ageGroupFilter.innerHTML = '<option value="">All Age Groups</option>';
        ageGroups.forEach(group => {
            const option = document.createElement('option');
            option.value = group;
            option.textContent = group;
            this.ageGroupFilter.appendChild(option);
        });
        
        // Restore previous selection if still valid
        if (ageGroups.includes(currentValue)) {
            this.ageGroupFilter.value = currentValue;
        }
        
        this.updateAgeGroupStats();
    }

    updateAgeGroupStats() {
        if (!this.ageGroupStats) return;
        
        const ageGroups = this.getAgeGroups();
        if (ageGroups.length === 0) {
            this.ageGroupStats.style.display = 'none';
            return;
        }

        this.ageGroupStats.style.display = 'block';
        
        const stats = ageGroups.map(group => {
            const count = this.racers.filter(racer => racer.ageGroup === group).length;
            return `${group}: ${count} racer${count !== 1 ? 's' : ''}`;
        });
        
        this.ageGroupStats.innerHTML = `<div class="age-group-stats-content">${stats.join(' | ')}</div>`;
    }

    showBulkAssignDialog() {
        const ageGroups = ['Tigers', 'Wolves', 'Bears', 'Webelos', 'Arrow of Light', 'Scouts BSA', 'Adults', 'Open'];
        const racersWithoutAgeGroup = this.racers.filter(racer => !racer.ageGroup || !racer.ageGroup.trim());
        
        if (racersWithoutAgeGroup.length === 0) {
            alert('All racers already have age groups assigned.');
            return;
        }

        const ageGroup = prompt(
            `Assign age group to ${racersWithoutAgeGroup.length} racers without age groups.\n\nAvailable groups:\n${ageGroups.join(', ')}\n\nEnter age group:`
        );

        if (ageGroup && ageGroup.trim()) {
            racersWithoutAgeGroup.forEach(racer => {
                racer.ageGroup = ageGroup.trim();
            });
            this.updateRacersDisplay();
            this.updateAgeGroupFilter();
            this.saveState();
            alert(`Assigned "${ageGroup.trim()}" to ${racersWithoutAgeGroup.length} racers.`);
        }
    }

    reloadLastImport() {
        const lastImport = localStorage.getItem('lastRacerImport');
        if (!lastImport) {
            alert('No previous import found.');
            return;
        }

        if (!confirm('This will clear all current racers and reload from the last import. Continue?')) {
            return;
        }

        try {
            const racersData = JSON.parse(lastImport);
            this.racers = [];
            
            let importedCount = 0;
            racersData.forEach(racerData => {
                if (racerData.name && racerData.name.trim()) {
                    this.addRacerWithAgeGroup(racerData.name.trim(), racerData.ageGroup || '');
                    importedCount++;
                }
            });

            alert(`Reloaded ${importedCount} racers from last import.`);
        } catch (error) {
            alert('Error reloading racers.');
            console.error(error);
        }
    }

    preloadTestData() {
        if (this.racers.length > 0) {
            if (!confirm('This will clear all current racers and load test data. Continue?')) {
                return;
            }
        }

        // Clear existing racers
        this.racers = [];

        // Sample test data for age group testing
        const testRacers = [
            { name: "Johnny Smith", ageGroup: "Cubs" },
            { name: "Sarah Johnson", ageGroup: "Cubs" },
            { name: "Mike Wilson", ageGroup: "Cubs" },
            { name: "Emma Davis", ageGroup: "Cubs" },
            { name: "Alex Brown", ageGroup: "Cubs" },
            { name: "Katie Miller", ageGroup: "Cubs" },
            { name: "Ryan Garcia", ageGroup: "Cubs" },
            { name: "Zoe Martinez", ageGroup: "Cubs" },
            { name: "Tommy Anderson", ageGroup: "Webelos" },
            { name: "Jessica Thompson", ageGroup: "Webelos" },
            { name: "Brandon Lee", ageGroup: "Webelos" },
            { name: "Mia Rodriguez", ageGroup: "Webelos" },
            { name: "Tyler Clark", ageGroup: "Webelos" },
            { name: "Chloe Lewis", ageGroup: "Webelos" },
            { name: "Jordan Walker", ageGroup: "Webelos" },
            { name: "Sophia Hall", ageGroup: "Webelos" }
        ];

        // Add test racers using the existing method
        testRacers.forEach(racer => {
            this.addRacerWithAgeGroup(racer.name, racer.ageGroup);
        });

        alert(`Loaded ${testRacers.length} test racers (8 Cubs + 8 Webelos) for testing age group functionality!`);
    }

    updateRacersDisplay() {
        // Filter racers based on age group selection
        const filterValue = this.ageGroupFilter?.value || '';
        const filteredRacers = filterValue ? 
            this.racers.filter(racer => racer.ageGroup === filterValue) : 
            this.racers;

        if (this.racerCount) {
            this.racerCount.textContent = this.racers.length;
        }
        if (this.participantCount) {
            this.participantCount.textContent = `${this.racers.length} racers`;
        }
        
        if (this.racersGrid) {
            this.racersGrid.innerHTML = '';
            filteredRacers.forEach(racer => {
                const racerCard = document.createElement('div');
                racerCard.className = 'racer-card';
                if (racer.ageGroup) {
                    racerCard.className += ` age-group-${racer.ageGroup.replace(/\s+/g, '-').toLowerCase()}`;
                }
                racerCard.innerHTML = `
                    <div class="racer-info">
                        <span class="racer-name">${racer.name}</span>
                        ${racer.ageGroup ? `<span class="racer-age-group">${racer.ageGroup}</span>` : '<span class="racer-age-group no-age">No Age Group</span>'}
                    </div>
                    <button class="remove-racer" onclick="tournamentManager.activeTournament.removeRacer(${racer.id})">&times;</button>
                `;
                this.racersGrid.appendChild(racerCard);
            });

            // Show filter status if filtering
            if (filterValue && filteredRacers.length !== this.racers.length) {
                const filterStatus = document.createElement('div');
                filterStatus.className = 'filter-status';
                filterStatus.innerHTML = `Showing ${filteredRacers.length} of ${this.racers.length} racers (${filterValue})`;
                this.racersGrid.insertBefore(filterStatus, this.racersGrid.firstChild);
            }
        }

        // Update age group stats
        this.updateAgeGroupStats();

        // Enable/disable start button
        if (this.startTournamentBtn) {
            this.startTournamentBtn.disabled = this.racers.length < 4;
        }

        // Update tournament management buttons
        this.updateManagementButtons();
    }

    updateManagementButtons() {
        // Enable "Create by Age Group" button if there are multiple age groups with enough racers
        const ageGroups = this.getAgeGroups();
        const validAgeGroups = ageGroups.filter(group => {
            return this.racers.filter(racer => racer.ageGroup === group).length >= 4;
        });

        const createByAgeGroupBtn = document.getElementById('createByAgeGroupBtn');
        if (createByAgeGroupBtn) {
            createByAgeGroupBtn.disabled = validAgeGroups.length === 0;
        }

        // Enable reload button if there's a last import
        if (this.reloadRacersBtn) {
            this.reloadRacersBtn.disabled = !localStorage.getItem('lastRacerImport');
        }
    }

    clearAllRacers() {
        if (this.racers.length === 0) return;
        
        if (confirm('Clear all racers?')) {
            this.racers = [];
            this.updateRacersDisplay();
            this.saveState();
        }
    }

    startTournament() {
        if (this.racers.length < 4) {
            alert('Need at least 4 racers to start tournament');
            return;
        }

        this.tournamentStarted = true;
        this.currentRound = 1;
        this.generateBracket();
        this.showTournamentPhase();
        this.saveState();
    }

    generateBracket() {
        // Calculate number of rounds needed
        this.maxRounds = Math.ceil(Math.log2(this.racers.length));
        
        // Shuffle racers for random seeding
        const shuffledRacers = [...this.racers].sort(() => Math.random() - 0.5);
        
        // Calculate next power of 2 to determine bracket size
        const bracketSize = Math.pow(2, this.maxRounds);
        
        // Create first round with byes if needed
        this.bracket = {};
        
        for (let round = 1; round <= this.maxRounds; round++) {
            this.bracket[round] = [];
        }

        // Populate first round
        const firstRoundMatches = bracketSize / 2;
        let racerIndex = 0;

        for (let i = 0; i < firstRoundMatches; i++) {
            const match = {
                id: `r1m${i}`,
                round: 1,
                participants: [],
                winner: null,
                completed: false
            };

            // Add first participant
            if (racerIndex < shuffledRacers.length) {
                match.participants.push({
                    racer: shuffledRacers[racerIndex],
                    score: 0
                });
                racerIndex++;
            }

            // Add second participant
            if (racerIndex < shuffledRacers.length) {
                match.participants.push({
                    racer: shuffledRacers[racerIndex],
                    score: 0
                });
                racerIndex++;
            }

            // If only one participant, they get a bye
            if (match.participants.length === 1) {
                match.winner = match.participants[0].racer;
                match.completed = true;
            }

            this.bracket[1].push(match);
        }

        // Create placeholder matches for subsequent rounds
        for (let round = 2; round <= this.maxRounds; round++) {
            const numMatches = Math.pow(2, this.maxRounds - round);
            for (let i = 0; i < numMatches; i++) {
                this.bracket[round].push({
                    id: `r${round}m${i}`,
                    round: round,
                    participants: [],
                    winner: null,
                    completed: false
                });
            }
        }
    }

    showTournamentPhase() {
        if (this.setupPhase) this.setupPhase.style.display = 'none';
        if (this.tournamentPhase) this.tournamentPhase.style.display = 'block';
        this.updateBracketDisplay();
    }

    showSetupPhase() {
        if (this.setupPhase) this.setupPhase.style.display = 'block';
        if (this.tournamentPhase) this.tournamentPhase.style.display = 'none';
        if (this.winnerAnnouncement) this.winnerAnnouncement.style.display = 'none';
    }

    updateBracketDisplay() {
        if (!this.bracketContainer) return;
        
        this.bracketContainer.innerHTML = '';
        
        for (let round = 1; round <= this.maxRounds; round++) {
            const roundDiv = document.createElement('div');
            roundDiv.className = 'bracket-round';
            
            const roundHeader = document.createElement('h3');
            roundHeader.className = 'round-header';
            roundHeader.textContent = this.getRoundName(round);
            roundDiv.appendChild(roundHeader);
            
            const matchesContainer = document.createElement('div');
            matchesContainer.className = 'matches-container';
            
            this.bracket[round].forEach(match => {
                const matchDiv = this.createMatchElement(match);
                matchesContainer.appendChild(matchDiv);
            });
            
            roundDiv.appendChild(matchesContainer);
            this.bracketContainer.appendChild(roundDiv);
        }
        
        this.updateRoundDisplay();
    }

    createMatchElement(match) {
        const matchDiv = document.createElement('div');
        matchDiv.className = `match ${match.completed ? 'completed' : 'active'}`;
        matchDiv.dataset.matchId = match.id;
        
        let matchHTML = '<div class="match-header">Race</div>';
        
        if (match.participants.length === 0) {
            matchHTML += '<div class="participant waiting">Waiting for previous round...</div>';
        } else if (match.participants.length === 1) {
            // Bye
            const participant = match.participants[0];
            matchHTML += `
                <div class="participant bye">
                    <span class="name">${participant.racer.name}</span>
                    <span class="bye-label">BYE</span>
                </div>
            `;
        } else {
            // Regular match
            match.participants.forEach((participant, index) => {
                const isWinner = match.winner && match.winner.id === participant.racer.id;
                const participantClass = match.completed ? (isWinner ? 'winner' : 'loser') : '';
                
                matchHTML += `
                    <div class="participant ${participantClass}">
                        <span class="name">${participant.racer.name}</span>
                        <span class="score">${participant.score}</span>
                        ${!match.completed ? `<button class="win-btn" onclick="tournamentManager.activeTournament.declareWinner('${match.id}', ${index})">Win</button>` : ''}
                    </div>
                `;
            });
        }
        
        matchDiv.innerHTML = matchHTML;
        return matchDiv;
    }

    declareWinner(matchId, participantIndex) {
        const match = this.findMatch(matchId);
        if (!match || match.completed) return;
        
        const winner = match.participants[participantIndex];
        match.winner = winner.racer;
        match.completed = true;
        
        // Update score (simple win/loss)
        match.participants.forEach((p, i) => {
            p.score = i === participantIndex ? 1 : 0;
        });
        
        // Mark loser as eliminated
        match.participants.forEach((p, i) => {
            if (i !== participantIndex) {
                p.racer.eliminated = true;
            }
        });
        
        // Advance winner to next round
        this.advanceWinner(match);
        
        // Check if tournament is complete
        if (this.isTournamentComplete()) {
            this.showWinner(match.winner);
        }
        
        this.updateBracketDisplay();
        this.saveState();
        
        // Update tournament manager display
        if (window.tournamentManager) {
            tournamentManager.updateCurrentTournamentDisplay();
        }
    }

    findMatch(matchId) {
        for (let round = 1; round <= this.maxRounds; round++) {
            const match = this.bracket[round].find(m => m.id === matchId);
            if (match) return match;
        }
        return null;
    }

    advanceWinner(completedMatch) {
        if (completedMatch.round === this.maxRounds) return; // Final round
        
        const nextRound = completedMatch.round + 1;
        const nextMatchIndex = Math.floor(this.bracket[completedMatch.round].indexOf(completedMatch) / 2);
        const nextMatch = this.bracket[nextRound][nextMatchIndex];
        
        if (nextMatch) {
            nextMatch.participants.push({
                racer: completedMatch.winner,
                score: 0
            });
        }
    }

    isTournamentComplete() {
        const finalRound = this.bracket[this.maxRounds];
        return finalRound && finalRound[0] && finalRound[0].completed;
    }

    showWinner(winner) {
        if (this.winnerName) {
            this.winnerName.textContent = winner.name;
        }
        if (this.winnerAnnouncement) {
            this.winnerAnnouncement.style.display = 'block';
        }
    }

    getRoundName(round) {
        const totalRounds = this.maxRounds;
        if (round === totalRounds) return 'Final';
        if (round === totalRounds - 1) return 'Semi-Final';
        if (round === totalRounds - 2) return 'Quarter-Final';
        return `Round ${round}`;
    }

    updateRoundDisplay() {
        if (this.currentRoundSpan) {
            this.currentRoundSpan.textContent = this.currentRound;
        }
        if (this.roundName) {
            this.roundName.textContent = this.getRoundName(this.currentRound);
        }
    }

    backToSetup() {
        this.showSetupPhase();
    }

    resetTournament() {
        if (confirm('Reset tournament? All progress will be lost.')) {
            this.tournamentStarted = false;
            this.bracket = {};
            this.currentRound = 1;
            this.maxRounds = 0;
            
            // Reset racer elimination status
            this.racers.forEach(racer => {
                racer.eliminated = false;
            });
            
            this.showSetupPhase();
            this.updateRacersDisplay();
            this.saveState();
            
            // Update tournament manager display
            if (window.tournamentManager) {
                tournamentManager.updateCurrentTournamentDisplay();
            }
        }
    }

    newTournament() {
        if (window.tournamentManager) {
            tournamentManager.createNewTournament();
        }
    }

    show() {
        this.updateRacersDisplay();
        if (this.tournamentStarted) {
            this.showTournamentPhase();
            this.updateBracketDisplay();
        } else {
            this.showSetupPhase();
        }
    }

    isComplete() {
        return this.tournamentStarted && this.isTournamentComplete();
    }

    getState() {
        return {
            id: this.id,
            name: this.name,
            created: this.created,
            racers: this.racers,
            tournamentStarted: this.tournamentStarted,
            bracket: this.bracket,
            currentRound: this.currentRound,
            maxRounds: this.maxRounds
        };
    }

    loadState(state = null) {
        if (state) {
            // Load from provided state (for import)
            this.racers = state.racers || [];
            this.tournamentStarted = state.tournamentStarted || false;
            this.bracket = state.bracket || {};
            this.currentRound = state.currentRound || 1;
            this.maxRounds = state.maxRounds || 0;
        } else {
            // Load from localStorage
            const saved = localStorage.getItem(`tournament_${this.id}`);
            if (saved) {
                const savedState = JSON.parse(saved);
                this.racers = savedState.racers || [];
                this.tournamentStarted = savedState.tournamentStarted || false;
                this.bracket = savedState.bracket || {};
                this.currentRound = savedState.currentRound || 1;
                this.maxRounds = savedState.maxRounds || 0;
            }
        }
    }

    saveState() {
        const state = this.getState();
        localStorage.setItem(`tournament_${this.id}`, JSON.stringify(state));
    }
}

// Global tournament manager
let tournamentManager;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tournament manager after a short delay to ensure DOM is ready
    setTimeout(() => {
        tournamentManager = new TournamentManager();
        window.tournamentManager = tournamentManager; // Make it globally accessible
    }, 100);
});

// Save all tournament states periodically
setInterval(() => {
    if (tournamentManager && tournamentManager.activeTournament) {
        tournamentManager.activeTournament.saveState();
        tournamentManager.saveTournamentsList();
    }
}, 10000);

// Handle page refresh/close
window.addEventListener('beforeunload', (e) => {
    if (tournamentManager && tournamentManager.activeTournament) {
        tournamentManager.activeTournament.saveState();
        tournamentManager.saveTournamentsList();
    }
});