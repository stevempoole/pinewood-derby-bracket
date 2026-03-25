/**
 * 🏁 Minimal Heat Racing System - Debug Version
 */

class SimpleRaceManager {
    constructor() {
        console.log('🍌 SimpleRaceManager starting...');
        
        // Essential elements only
        this.racerInput = document.getElementById('racerNameInput');
        this.addBtn = document.getElementById('addRacerBtn');
        this.quickSetup8Btn = document.getElementById('quickSetup8');
        this.quickSetup16Btn = document.getElementById('quickSetup16');
        this.racersGrid = document.getElementById('racersGrid');
        this.racerCount = document.getElementById('racerCount');
        this.startBtn = document.getElementById('startTournamentBtn');
        
        console.log('🔍 Elements found:', {
            racerInput: !!this.racerInput,
            addBtn: !!this.addBtn,
            quickSetup8Btn: !!this.quickSetup8Btn,
            quickSetup16Btn: !!this.quickSetup16Btn,
            racersGrid: !!this.racersGrid,
            racerCount: !!this.racerCount,
            startBtn: !!this.startBtn
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
    }
    
    addRacer() {
        if (!this.racerInput || !this.racerInput.value.trim()) {
            console.log('❌ No racer name entered');
            return;
        }
        
        const name = this.racerInput.value.trim();
        const carNumber = this.getNextCarNumber();
        
        console.log('➕ Adding racer:', name, 'Car #' + carNumber);
        
        this.addRacerToGrid(name, carNumber);
        this.racerInput.value = '';
        this.updateCounts();
    }
    
    addRacerToGrid(name, carNumber) {
        if (!this.racersGrid) return;
        
        const racerCard = document.createElement('div');
        racerCard.className = 'racer-card';
        racerCard.innerHTML = `
            <div class="racer-info">
                <div class="racer-name">${name}</div>
                <div class="car-number">Car #${carNumber}</div>
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
        
        // Add racers
        for (let i = 0; i < count && i < names.length; i++) {
            this.addRacerToGrid(names[i], i + 1);
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