/**
 * 🏁 Minimal Heat Racing System - Debug Version
 */

class SimpleRaceManager {
    constructor() {
        console.log('🍌 SimpleRaceManager starting...');
        
        // Essential elements only
        this.racerInput = document.getElementById('racerNameInput');
        this.teamSelect = document.getElementById('ageGroupInput');
        this.addBtn = document.getElementById('addRacerBtn');
        this.quickSetup8Btn = document.getElementById('quickSetup8');
        this.quickSetup16Btn = document.getElementById('quickSetup16');
        this.racersGrid = document.getElementById('racersGrid');
        this.racerCount = document.getElementById('racerCount');
        this.startBtn = document.getElementById('startTournamentBtn');
        
        // Tournament management buttons
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
        
        console.log('🔍 Elements found:', {
            racerInput: !!this.racerInput,
            teamSelect: !!this.teamSelect,
            addBtn: !!this.addBtn,
            quickSetup8Btn: !!this.quickSetup8Btn,
            quickSetup16Btn: !!this.quickSetup16Btn,
            racersGrid: !!this.racersGrid,
            racerCount: !!this.racerCount,
            startBtn: !!this.startBtn,
            newTournamentBtn: !!this.newTournamentBtn,
            exportTournamentBtn: !!this.exportTournamentBtn,
            importRacersBtn: !!this.importRacersBtn
        });
        
        this.bindBasicEvents();
        this.updateCounts();
        
        console.log('✅ SimpleRaceManager ready!');
    }
    
    bindBasicEvents() {
        if (this.addBtn) {
            this.addBtn.addEventListener('click', () => {
                console.log('🎯 Add Racer clicked');
                this.addRacer();
            });
        }
        
        if (this.quickSetup8Btn) {
            this.quickSetup8Btn.addEventListener('click', () => {
                console.log('🎯 Quick Setup 8 clicked');
                this.quickSetup(8);
            });
        }
        
        if (this.quickSetup16Btn) {
            this.quickSetup16Btn.addEventListener('click', () => {
                console.log('🎯 Quick Setup 16 clicked');
                this.quickSetup(16);
            });
        }
        
        if (this.racerInput) {
            this.racerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    console.log('🎯 Enter key pressed');
                    this.addRacer();
                }
            });
        }
        
        // Tournament management events
        if (this.newTournamentBtn) {
            this.newTournamentBtn.addEventListener('click', () => {
                console.log('🎯 New Tournament clicked');
                this.newTournament();
            });
        }
        
        if (this.cloneTournamentBtn) {
            this.cloneTournamentBtn.addEventListener('click', () => {
                console.log('🎯 Clone Tournament clicked');
                this.cloneTournament();
            });
        }
        
        if (this.createByAgeGroupBtn) {
            this.createByAgeGroupBtn.addEventListener('click', () => {
                console.log('🎯 Create by Age Group clicked');
                this.createByTeam();
            });
        }
        
        if (this.exportTournamentBtn) {
            this.exportTournamentBtn.addEventListener('click', () => {
                console.log('🎯 Export Tournament clicked');
                this.exportTournament();
            });
        }
        
        if (this.importTournamentBtn) {
            this.importTournamentBtn.addEventListener('click', () => {
                console.log('🎯 Import Tournament clicked');
                this.importFileInput?.click();
            });
        }
        
        if (this.importRacersBtn) {
            this.importRacersBtn.addEventListener('click', () => {
                console.log('🎯 Import Racers clicked');
                this.importRacersInput?.click();
            });
        }
        
        if (this.downloadTemplateBtn) {
            this.downloadTemplateBtn.addEventListener('click', () => {
                console.log('🎯 Download Template clicked');
                this.downloadTemplate();
            });
        }
        
        // File input events
        if (this.importFileInput) {
            this.importFileInput.addEventListener('change', (e) => {
                console.log('🎯 Tournament file selected');
                this.handleTournamentImport(e);
            });
        }
        
        if (this.importRacersInput) {
            this.importRacersInput.addEventListener('change', (e) => {
                console.log('🎯 Racers file selected');
                this.handleRacersImport(e);
            });
        }
    }
    
    addRacer() {
        if (!this.racerInput || !this.racerInput.value.trim()) {
            console.log('❌ No racer name entered');
            return;
        }
        
        const name = this.racerInput.value.trim();
        const team = this.teamSelect ? this.teamSelect.value : '';
        const carNumber = this.getNextCarNumber();
        
        console.log('➕ Adding racer:', name, 'Team:', team || 'None', 'Car #' + carNumber);
        
        this.addRacerToGrid(name, carNumber, team);
        this.racerInput.value = '';
        this.updateCounts();
    }
    
    addRacerToGrid(name, carNumber, team) {
        if (!this.racersGrid) return;
        
        const racerCard = document.createElement('div');
        racerCard.className = 'racer-card';
        racerCard.innerHTML = `
            <div class="racer-info">
                <div class="racer-name">${name}</div>
                <div class="car-number">Car #${carNumber}</div>
                ${team ? `<div class="team-badge team-${team.toLowerCase()}">${team}</div>` : ''}
            </div>
            <button class="remove-racer-btn" onclick="this.parentElement.remove(); window.raceManager.updateCounts();">×</button>
        `;
        
        this.racersGrid.appendChild(racerCard);
    }
    
    getNextCarNumber() {
        if (!this.racersGrid) return 1;
        
        const existingCards = this.racersGrid.querySelectorAll('.racer-card');
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
    
    quickSetup(count) {
        console.log('🚀 Quick setup with', count, 'racers');
        
        const names = [
            'Alex', 'Bailey', 'Charlie', 'Dana', 'Evan', 'Finley', 'Gray', 'Harper',
            'Izzy', 'Jordan', 'Kai', 'Luna', 'Max', 'Nova', 'Oakley', 'Parker',
            'Quinn', 'River', 'Sage', 'Taylor', 'Uma', 'Vale', 'Wren', 'Zara'
        ];
        
        // Clear existing
        if (this.racersGrid) {
            this.racersGrid.innerHTML = '';
        }
        
        // Add racers with alternating teams
        for (let i = 0; i < count && i < names.length; i++) {
            const team = i % 2 === 0 ? 'Guardians' : 'Knights';
            this.addRacerToGrid(names[i], i + 1, team);
        }
        
        this.updateCounts();
        console.log('✅ Quick setup complete');
    }
    
    updateCounts() {
        const count = this.racersGrid ? this.racersGrid.children.length : 0;
        
        if (this.racerCount) {
            this.racerCount.textContent = count;
        }
        
        if (this.startBtn) {
            this.startBtn.disabled = count < 4;
            this.startBtn.textContent = count < 4 ? 
                `Add ${4 - count} more racers` : 'Start Heat Racing';
        }
        
        console.log('📊 Updated counts:', count, 'racers');
    }
    
    // Tournament Management Methods
    newTournament() {
        if (confirm('Start a new tournament? All current racers will be cleared.')) {
            console.log('🗑️ Clearing tournament...');
            if (this.racersGrid) {
                this.racersGrid.innerHTML = '';
            }
            this.updateCounts();
            console.log('✅ New tournament started');
        }
    }
    
    cloneTournament() {
        console.log('📋 Cloning tournament (placeholder)');
        alert('Clone Tournament - Feature coming soon!');
    }
    
    createByTeam() {
        const racerCards = this.racersGrid?.querySelectorAll('.racer-card') || [];
        if (racerCards.length === 0) {
            alert('Add some racers first!');
            return;
        }
        
        console.log('🎯 Creating tournaments by team...');
        alert('Create Tournaments by Team - Feature coming soon!');
    }
    
    exportTournament() {
        const racers = this.getCurrentRacers();
        if (racers.length === 0) {
            alert('No racers to export!');
            return;
        }
        
        console.log('📤 Exporting tournament...', racers.length, 'racers');
        
        const tournamentData = {
            name: 'Guardians vs Knights Derby',
            date: new Date().toISOString().split('T')[0],
            racers: racers,
            teams: ['Guardians', 'Knights']
        };
        
        const dataStr = JSON.stringify(tournamentData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `pinewood-derby-${tournamentData.date}.json`;
        link.click();
        
        console.log('✅ Tournament exported');
    }
    
    downloadTemplate() {
        console.log('📋 Downloading racer template...');
        
        const template = [
            ['Name', 'Team', 'Car Number'],
            ['Example Racer 1', 'Guardians', '1'],
            ['Example Racer 2', 'Knights', '2'],
            ['Example Racer 3', 'Guardians', '3'],
            ['Example Racer 4', 'Knights', '4']
        ];
        
        const csvContent = template.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], {type: 'text/csv'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'pinewood-derby-template.csv';
        link.click();
        
        console.log('✅ Template downloaded');
    }
    
    getCurrentRacers() {
        const racerCards = this.racersGrid?.querySelectorAll('.racer-card') || [];
        return Array.from(racerCards).map(card => {
            const name = card.querySelector('.racer-name')?.textContent || '';
            const carNumber = parseInt(card.querySelector('.car-number')?.textContent?.match(/\d+/)?.[0] || '1');
            const team = card.querySelector('.team-badge')?.textContent || '';
            return { name, carNumber, team };
        });
    }
    
    handleTournamentImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        console.log('📥 Importing tournament file:', file.name);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                console.log('📊 Tournament data loaded:', data);
                
                if (data.racers && Array.isArray(data.racers)) {
                    // Clear existing racers
                    if (this.racersGrid) {
                        this.racersGrid.innerHTML = '';
                    }
                    
                    // Import racers
                    data.racers.forEach(racer => {
                        this.addRacerToGrid(racer.name, racer.carNumber || this.getNextCarNumber(), racer.team || '');
                    });
                    
                    this.updateCounts();
                    console.log('✅ Tournament imported successfully');
                } else {
                    alert('Invalid tournament file format!');
                }
            } catch (error) {
                console.error('❌ Error importing tournament:', error);
                alert('Error reading tournament file!');
            }
        };
        reader.readAsText(file);
    }
    
    handleRacersImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        console.log('👥 Importing racers file:', file.name);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                let data;
                
                if (file.name.endsWith('.json')) {
                    data = JSON.parse(e.target.result);
                } else if (file.name.endsWith('.csv')) {
                    const lines = e.target.result.split('\n');
                    const headers = lines[0].split(',');
                    data = lines.slice(1).filter(line => line.trim()).map(line => {
                        const values = line.split(',');
                        return {
                            name: values[0]?.trim() || '',
                            team: values[1]?.trim() || '',
                            carNumber: parseInt(values[2]) || null
                        };
                    });
                }
                
                if (data && Array.isArray(data)) {
                    // Clear existing racers
                    if (this.racersGrid) {
                        this.racersGrid.innerHTML = '';
                    }
                    
                    // Import racers
                    data.forEach(racer => {
                        if (racer.name) {
                            this.addRacerToGrid(racer.name, racer.carNumber || this.getNextCarNumber(), racer.team || '');
                        }
                    });
                    
                    this.updateCounts();
                    console.log('✅ Racers imported successfully');
                } else {
                    alert('Invalid racers file format!');
                }
            } catch (error) {
                console.error('❌ Error importing racers:', error);
                alert('Error reading racers file!');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🍌 DOM loaded, starting SimpleRaceManager...');
    try {
        window.raceManager = new SimpleRaceManager();
    } catch (error) {
        console.error('❌ Error:', error);
    }
});