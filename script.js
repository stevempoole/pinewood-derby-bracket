class PinewoodDerbyTournament {
    constructor() {
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
        this.addRacerBtn = document.getElementById('addRacerBtn');
        this.add8Btn = document.getElementById('add8Btn');
        this.add16Btn = document.getElementById('add16Btn');
        this.racersList = document.getElementById('racersList');
        this.racersGrid = document.getElementById('racersGrid');
        this.racerCount = document.getElementById('racerCount');
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
        this.addRacerBtn.addEventListener('click', () => this.addRacer());
        this.racerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addRacer();
        });
        this.add8Btn.addEventListener('click', () => this.addQuickRacers(8));
        this.add16Btn.addEventListener('click', () => this.addQuickRacers(16));
        this.startTournamentBtn.addEventListener('click', () => this.startTournament());
        this.clearAllBtn.addEventListener('click', () => this.clearAllRacers());

        // Tournament phase events
        this.backToSetupBtn.addEventListener('click', () => this.backToSetup());
        this.resetTournamentBtn.addEventListener('click', () => this.resetTournament());
        this.newTournamentBtn.addEventListener('click', () => this.newTournament());
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        this.tournamentDate.textContent = now.toLocaleDateString('en-US', options);
    }

    addRacer() {
        const name = this.racerNameInput.value.trim();
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
            eliminated: false
        });

        this.racerNameInput.value = '';
        this.updateRacersDisplay();
        this.racerNameInput.focus();
    }

    addQuickRacers(count) {
        if (this.racers.length > 0) {
            if (!confirm('This will clear existing racers. Continue?')) {
                return;
            }
            this.racers = [];
        }

        for (let i = 1; i <= count; i++) {
            this.racers.push({
                id: Date.now() + Math.random() + i,
                name: `Racer ${i}`,
                eliminated: false
            });
        }

        this.updateRacersDisplay();
    }

    removeRacer(racerId) {
        this.racers = this.racers.filter(racer => racer.id !== racerId);
        this.updateRacersDisplay();
    }

    updateRacersDisplay() {
        this.racerCount.textContent = this.racers.length;
        this.participantCount.textContent = `${this.racers.length} racers`;
        
        this.racersGrid.innerHTML = '';
        this.racers.forEach(racer => {
            const racerCard = document.createElement('div');
            racerCard.className = 'racer-card';
            racerCard.innerHTML = `
                <span class="racer-name">${racer.name}</span>
                <button class="remove-racer" onclick="tournament.removeRacer(${racer.id})">&times;</button>
            `;
            this.racersGrid.appendChild(racerCard);
        });

        // Enable/disable start button
        this.startTournamentBtn.disabled = this.racers.length < 4;
    }

    clearAllRacers() {
        if (this.racers.length === 0) return;
        
        if (confirm('Clear all racers?')) {
            this.racers = [];
            this.updateRacersDisplay();
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

            // Add second participant or bye
            if (racerIndex < shuffledRacers.length) {
                match.participants.push({
                    racer: shuffledRacers[racerIndex],
                    score: 0
                });
                racerIndex++;
            } else {
                // Bye - first participant automatically wins
                match.participants.push({
                    racer: { name: 'BYE', id: 'bye' },
                    score: 0,
                    isBye: true
                });
                match.winner = match.participants[0].racer;
                match.completed = true;
            }

            this.bracket[1].push(match);
        }

        // Generate subsequent rounds
        for (let round = 2; round <= this.maxRounds; round++) {
            const prevRoundMatches = this.bracket[round - 1].length;
            const thisRoundMatches = Math.ceil(prevRoundMatches / 2);

            for (let i = 0; i < thisRoundMatches; i++) {
                this.bracket[round].push({
                    id: `r${round}m${i}`,
                    round: round,
                    participants: [],
                    winner: null,
                    completed: false,
                    prevMatches: [
                        this.bracket[round - 1][i * 2],
                        this.bracket[round - 1][i * 2 + 1]
                    ].filter(match => match) // Remove undefined matches
                });
            }
        }

        this.updateBracketDisplay();
    }

    updateBracketDisplay() {
        this.bracketContainer.innerHTML = '';
        
        const bracket = document.createElement('div');
        bracket.className = 'bracket';

        for (let round = 1; round <= this.maxRounds; round++) {
            const roundDiv = document.createElement('div');
            roundDiv.className = 'round';
            
            const roundTitle = document.createElement('div');
            roundTitle.className = 'round-title';
            roundTitle.textContent = this.getRoundName(round);
            roundDiv.appendChild(roundTitle);

            this.bracket[round].forEach(match => {
                const matchDiv = this.createMatchElement(match);
                roundDiv.appendChild(matchDiv);
            });

            bracket.appendChild(roundDiv);
        }

        this.bracketContainer.appendChild(bracket);
        this.updateRoundInfo();
    }

    createMatchElement(match) {
        const matchDiv = document.createElement('div');
        matchDiv.className = `match ${match.completed ? 'completed' : ''}`;
        matchDiv.dataset.matchId = match.id;

        const participantsDiv = document.createElement('div');
        participantsDiv.className = 'match-participants';

        match.participants.forEach((participant, index) => {
            const participantDiv = document.createElement('div');
            participantDiv.className = `participant ${participant.racer === match.winner ? 'winner' : ''} ${participant.isBye ? 'bye' : ''}`;
            participantDiv.dataset.participantIndex = index;
            
            if (!participant.isBye) {
                participantDiv.addEventListener('click', () => this.selectWinner(match, participant.racer));
            }

            participantDiv.innerHTML = `
                <span class="participant-name">${participant.racer.name}</span>
                ${!participant.isBye ? `<span class="participant-score">${participant.score || '-'}</span>` : ''}
            `;

            participantsDiv.appendChild(participantDiv);
        });

        matchDiv.appendChild(participantsDiv);

        if (match.winner && !match.participants.some(p => p.isBye)) {
            const winnerDiv = document.createElement('div');
            winnerDiv.className = 'match-winner';
            winnerDiv.textContent = `Winner: ${match.winner.name}`;
            matchDiv.appendChild(winnerDiv);
        }

        return matchDiv;
    }

    selectWinner(match, winner) {
        if (match.completed || match.participants.some(p => p.isBye)) return;

        // Check if this match can be played (previous rounds completed)
        if (match.prevMatches && !match.prevMatches.every(prevMatch => prevMatch.completed)) {
            alert('Previous matches must be completed first!');
            return;
        }

        // Set winner
        match.winner = winner;
        match.completed = true;

        // Advance winner to next round
        this.advanceWinner(match);
        
        // Update display
        this.updateBracketDisplay();
        
        // Check if tournament is complete
        this.checkTournamentComplete();
    }

    advanceWinner(completedMatch) {
        const nextRound = completedMatch.round + 1;
        if (nextRound > this.maxRounds) return;

        // Find the next match this winner should advance to
        const matchIndex = this.bracket[completedMatch.round].indexOf(completedMatch);
        const nextMatchIndex = Math.floor(matchIndex / 2);
        const nextMatch = this.bracket[nextRound][nextMatchIndex];

        if (nextMatch) {
            // Determine which position in the next match
            const position = matchIndex % 2;
            
            // Add or update participant
            while (nextMatch.participants.length <= position) {
                nextMatch.participants.push({
                    racer: { name: 'TBD', id: 'tbd' },
                    score: 0
                });
            }

            nextMatch.participants[position] = {
                racer: completedMatch.winner,
                score: 0
            };
        }
    }

    checkTournamentComplete() {
        const finalMatch = this.bracket[this.maxRounds][0];
        if (finalMatch && finalMatch.completed) {
            this.showWinner(finalMatch.winner);
        }
    }

    showWinner(winner) {
        this.winnerName.textContent = winner.name;
        this.winnerAnnouncement.style.display = 'flex';
    }

    getRoundName(round) {
        const totalRounds = this.maxRounds;
        if (round === totalRounds) return 'Final';
        if (round === totalRounds - 1) return 'Semi-Final';
        if (round === totalRounds - 2) return 'Quarter-Final';
        if (round === 1) return 'First Round';
        return `Round ${round}`;
    }

    updateRoundInfo() {
        // Find current round (first incomplete round)
        let currentRound = 1;
        for (let round = 1; round <= this.maxRounds; round++) {
            if (this.bracket[round].some(match => !match.completed)) {
                currentRound = round;
                break;
            }
            if (round === this.maxRounds) {
                currentRound = this.maxRounds;
            }
        }

        this.currentRound = currentRound;
        this.currentRoundSpan.textContent = currentRound;
        this.roundName.textContent = this.getRoundName(currentRound);
    }

    showTournamentPhase() {
        this.setupPhase.style.display = 'none';
        this.tournamentPhase.style.display = 'block';
    }

    backToSetup() {
        if (this.tournamentStarted) {
            if (!confirm('Going back will reset the tournament. Continue?')) {
                return;
            }
        }
        this.resetTournament();
    }

    resetTournament() {
        this.tournamentStarted = false;
        this.bracket = {};
        this.currentRound = 1;
        this.winnerAnnouncement.style.display = 'none';
        this.setupPhase.style.display = 'block';
        this.tournamentPhase.style.display = 'none';
    }

    newTournament() {
        this.resetTournament();
        this.racers = [];
        this.updateRacersDisplay();
    }
}

// Initialize tournament when page loads
let tournament;
document.addEventListener('DOMContentLoaded', () => {
    tournament = new PinewoodDerbyTournament();
});

// Drag and Drop functionality (optional enhancement)
document.addEventListener('DOMContentLoaded', () => {
    // Add drag and drop support for reordering racers in setup
    let draggedElement = null;

    document.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('racer-card')) {
            draggedElement = e.target;
            e.target.style.opacity = '0.5';
        }
    });

    document.addEventListener('dragend', (e) => {
        if (e.target.classList.contains('racer-card')) {
            e.target.style.opacity = '';
            draggedElement = null;
        }
    });

    document.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    document.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedElement && e.target.classList.contains('racer-card')) {
            const container = document.getElementById('racersGrid');
            const allCards = Array.from(container.children);
            const draggedIndex = allCards.indexOf(draggedElement);
            const targetIndex = allCards.indexOf(e.target);

            if (draggedIndex !== targetIndex) {
                // Reorder in the DOM
                if (draggedIndex < targetIndex) {
                    container.insertBefore(draggedElement, e.target.nextSibling);
                } else {
                    container.insertBefore(draggedElement, e.target);
                }

                // Reorder in the data array
                const draggedRacer = tournament.racers[draggedIndex];
                tournament.racers.splice(draggedIndex, 1);
                tournament.racers.splice(targetIndex, 0, draggedRacer);
            }
        }
    });

    // Make racer cards draggable
    document.addEventListener('click', (e) => {
        if (e.target.closest('.racer-card') && !tournament.tournamentStarted) {
            e.target.closest('.racer-card').draggable = true;
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close winner announcement
    if (e.key === 'Escape' && tournament.winnerAnnouncement.style.display === 'flex') {
        tournament.winnerAnnouncement.style.display = 'none';
    }
    
    // Ctrl/Cmd + R to reset tournament
    if ((e.ctrlKey || e.metaKey) && e.key === 'r' && tournament.tournamentStarted) {
        e.preventDefault();
        tournament.resetTournament();
    }
});

// Auto-save functionality using localStorage
function saveState() {
    const state = {
        racers: tournament.racers,
        tournamentStarted: tournament.tournamentStarted,
        bracket: tournament.bracket,
        currentRound: tournament.currentRound,
        maxRounds: tournament.maxRounds
    };
    localStorage.setItem('pinewoodDerbyState', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('pinewoodDerbyState');
    if (saved) {
        const state = JSON.parse(saved);
        tournament.racers = state.racers || [];
        tournament.tournamentStarted = state.tournamentStarted || false;
        tournament.bracket = state.bracket || {};
        tournament.currentRound = state.currentRound || 1;
        tournament.maxRounds = state.maxRounds || 0;
        
        tournament.updateRacersDisplay();
        if (tournament.tournamentStarted) {
            tournament.showTournamentPhase();
            tournament.updateBracketDisplay();
        }
    }
}

// Save state on important actions
document.addEventListener('DOMContentLoaded', () => {
    // Load saved state after tournament is initialized
    setTimeout(() => {
        loadState();
    }, 100);
});

// Auto-save every 10 seconds
setInterval(saveState, 10000);