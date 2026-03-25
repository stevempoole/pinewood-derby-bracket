# 🏁 Pinewood Derby Heat Racing System

A complete, production-ready web application for managing pinewood derby heat racing with fair scheduling and professional scoring. Built with vanilla HTML, CSS, and JavaScript for maximum compatibility and ease of deployment.

**🔥 NEW: Heat-Based Racing System** - Converted from elimination brackets to the proven heat racing format used by professional pinewood derby organizations!

## ✨ Features

### 🏁 Heat Racing System (NEW!)
- **PPN Algorithm**: Partial Perfect N scheduling ensures maximum fairness
- **Equal Racing**: Each car races exactly 3 times with perfect lane distribution
- **4-Lane Support**: Designed for standard pinewood derby tracks (Lane 3 unused per PPN)
- **Points Scoring**: Professional 3-2-1 points system (3pts for 1st, 2pts for 2nd, 1pt for 3rd)
- **Real-time Heat Management**: Current heat display with next/previous navigation
- **Live Standings**: Real-time leaderboard with points totals and race progress
- **Official Interface**: Touch-friendly results entry for race officials

### Tournament Management
- **Multi-Tournament Support**: Create, manage, and switch between multiple tournaments  
- **Dynamic Heat Generation**: Supports 4-25 participants with automatic heat scheduling
- **Fair Competition**: Every racer gets equal opportunity regardless of track conditions
- **Professional Scoring**: Accumulative points system prevents single-race elimination
- **Progress Tracking**: Visual heat progress and completion indicators

### 🎯 Age Group Management (New!)
- **Age Group Assignment**: Assign racers to divisions (Tigers, Wolves, Bears, Webelos, etc.)
- **Visual Indicators**: Color-coded age group badges for easy identification
- **Auto-Tournament Creation**: Create separate tournaments for each age division
- **Filtering & Statistics**: Filter racers by age group and view division statistics
- **Bulk Operations**: Assign age groups to multiple racers at once

### 📁 Import/Export System (New!)
- **Bulk Racer Import**: Import racer lists from CSV or JSON files
- **Template Download**: Get properly formatted templates for easy setup
- **Reload Functionality**: Restore racers from previous imports
- **Tournament Export**: Export complete tournament data including age groups
- **Sample Data**: Includes sample racer files for testing

### User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Drag & Drop**: Reorder participants during setup (desktop)
- **Auto-save**: Automatically saves tournament state to prevent data loss
- **Keyboard Shortcuts**: ESC to close dialogs, Ctrl/Cmd+R to reset
- **Professional UI**: Clean, modern design suitable for family events

### Setup Options
- **Manual Entry**: Add participants one by one with custom names and age groups
- **Bulk Import**: Upload CSV/JSON files with racer information
- **Quick Setup**: Generate 8 or 16 placeholder participants instantly
- **Easy Management**: Remove participants with one click during setup
- **Validation**: Prevents duplicate names and enforces limits

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)
1. Fork or download this repository
2. Enable GitHub Pages in repository settings
3. Choose "Deploy from a branch" and select `main`
4. Your tournament will be live at `https://[username].github.io/pinewood-derby-bracket`

### Option 2: Local Development
1. Clone this repository:
   ```bash
   git clone https://github.com/[username]/pinewood-derby-bracket.git
   cd pinewood-derby-bracket
   ```

2. Open `index.html` in your web browser, or serve with a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (npx)
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. Navigate to `http://localhost:8000`

### Option 3: Direct File Access
Simply download all files and open `index.html` directly in any modern web browser.

## 📋 How to Use

### Setting Up the Race

1. **Add Racers**
   - Enter racer names in the input field
   - Press Enter or click "Add Racer"
   - Use Quick Setup buttons for testing (8 or 16 racers)
   - Remove racers by clicking the × button

2. **Start Heat Racing**
   - Minimum 4 racers required
   - Maximum 25 racers supported  
   - Click "Start Heat Racing" when ready
   - System automatically generates fair heat schedule using PPN algorithm

### Running the Race

1. **Heat Management**
   - Current heat display shows which cars race in which lanes
   - Navigate between heats using Previous/Next buttons or heat selector
   - Each heat races 3 cars simultaneously (Lane 1, 2, and 4)

2. **Enter Results**
   - After each heat, click lane buttons to record finish positions
   - Award 1st place (3 points), 2nd place (2 points), 3rd place (1 point)
   - Submit results to automatically advance to next heat
   - Live standings update in real-time

3. **Race Completion**
   - Continue through all heats until complete
   - Each car will have raced exactly 3 times
   - Final standings determined by total points
   - Podium ceremony with top 3 finishers

### Managing the Race

- **Reset Race**: Clear all heat results and start over with same racers
- **Back to Setup**: Return to racer management
- **New Race**: Clear everything and start fresh
- **Heat Navigation**: Jump to any heat to review or re-enter results
- **Export Results**: Save complete race data with all heat details

## 🧮 PPN Algorithm Explained

The **Partial Perfect N (PPN) algorithm** ensures maximum fairness:

- **Equal Races**: Every car races exactly 3 times
- **Lane Distribution**: Each car runs once in Lane 1, once in Lane 2, and once in Lane 4  
- **Fair Opposition**: Optimized matchups so no car faces the same opponents repeatedly
- **Track Bias Elimination**: Equal lane exposure accounts for track conditions

This is the same algorithm used by professional pinewood derby organizations worldwide.

## 🏆 Why Heat Racing vs Brackets?

**Heat Racing Advantages:**
- ✅ **More Fair**: Every car gets multiple chances, accounts for track conditions
- ✅ **More Fun**: Every racer gets to race multiple times, not eliminated after one loss
- ✅ **More Accurate**: Points accumulation over multiple races shows true performance
- ✅ **More Engaging**: Spectators see more racing, live standings create excitement
- ✅ **More Professional**: Used by official BSA pinewood derby competitions

**Old Bracket Problems:**
- ❌ Single elimination unfair for young racers
- ❌ Track conditions could eliminate best cars early  
- ❌ Faster rounds but less racing overall
- ❌ Half the field eliminated quickly

## 🏆 Age Group Tournament Workflow (New Feature!)

Perfect for Cub Scout packs and larger organizations:

### 1. Prepare Racer Data
- Download template files using "📋 Download Template" button
- Edit CSV/JSON with racer names and age groups
- Supported age groups: Tigers, Wolves, Bears, Webelos, Arrow of Light, Scouts BSA, Adults, Open

### 2. Import Racers
- Click "👥 Import Racers" and select your data file
- Review imported racers with age group assignments
- Use "Bulk Assign" for racers missing age groups

### 3. Create Age Divisions
- Click "🎯 Create Tournaments by Age Group"
- System automatically creates separate tournaments for each age group (4+ racers required)
- Switch between tournaments using the tournament selector

### 4. Run Multiple Tournaments
- Use tournament selector to switch between divisions
- Each tournament runs independently
- Export individual tournament results or all tournaments

### Sample Files Included
- `sample_racers.json` - Example JSON format with 28 racers across age groups
- `sample_racers.csv` - Example CSV format with same data

## 🛠️ Technical Details

### Browser Compatibility
- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Mobile Support**: iOS Safari 12+, Android Chrome 60+
- **Features Used**: ES6 classes, CSS Grid, Flexbox, LocalStorage

### File Structure
```
pinewood-derby-bracket/
├── index.html          # Main HTML structure
├── styles.css          # All CSS styling and responsive design
├── script.js           # Tournament logic and interactivity
└── README.md           # This documentation
```

### Dependencies
- **None!** Pure vanilla JavaScript, HTML, and CSS
- **Fonts**: Google Fonts (Inter) - gracefully degrades if offline
- **Icons**: Unicode emojis for universal support

## 🎨 Customization

### Styling
The application uses CSS custom properties for easy theming. Key variables are defined in the `:root` selector in `styles.css`:

```css
:root {
  --primary-color: #667eea;
  --success-color: #48bb78;
  --danger-color: #f56565;
  /* ... etc */
}
```

### Branding
- Update the title in `index.html`
- Modify the footer text
- Replace the favicon (add a `favicon.ico` file)
- Customize colors and fonts in `styles.css`

### Features
The modular JavaScript architecture makes it easy to:
- Add scoring systems
- Implement double-elimination brackets
- Add participant photos
- Include additional match data

## 📱 Mobile Experience

The application is fully optimized for mobile devices:

- **Touch-friendly**: Large tap targets for easy interaction
- **Responsive Layout**: Adapts to any screen size
- **Horizontal Scrolling**: Bracket scrolls smoothly on small screens
- **Readable Text**: Optimized typography for mobile viewing

## 🔧 Troubleshooting

### Common Issues

**Q: My changes aren't saving**
A: The app auto-saves to browser localStorage. Clear your browser cache if needed.

**Q: The bracket looks broken on mobile**
A: Try rotating your device to landscape mode for better viewing of larger brackets.

**Q: I can't click to select winners**
A: Ensure previous round matches are completed first. The tournament enforces proper progression.

**Q: The page won't load**
A: Check that all three files (HTML, CSS, JS) are in the same directory.

### Browser Storage
The application automatically saves your tournament state. To clear:
- Open browser developer tools (F12)
- Go to Application/Storage tab
- Clear localStorage for your domain

## 🤝 Contributing

This is a community project! Ways to contribute:

1. **Report Issues**: Found a bug? Open an issue with details
2. **Feature Requests**: Have an idea? Describe it in an issue
3. **Submit PRs**: Code improvements and new features welcome
4. **Documentation**: Help improve this README

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on desktop and mobile
5. Submit a pull request

## 📄 License

MIT License - feel free to use this for your events, modify it, or distribute it.

## 🏆 Perfect For

- **Official Cub Scout Pinewood Derby events**
- **BSA Pack competitions**
- **School science fair races**
- **Community racing events**
- **Multi-division derby competitions**
- **Any fair-racing competition that values participation over elimination**

## 🙋‍♂️ Support

Having issues? Here's how to get help:

1. Check this README for common solutions
2. Search existing GitHub issues
3. Create a new issue with:
   - Browser and device information
   - Steps to reproduce the problem
   - Expected vs actual behavior

## 🎯 Roadmap

Future enhancements being considered:
- [ ] Double-elimination bracket support
- [ ] Race time tracking
- [ ] Participant photos
- [ ] Print-friendly bracket layouts
- [ ] Export results to PDF
- [ ] Multi-day tournament support
- [ ] Advanced seeding options

---

Made with ❤️ for racing families everywhere. Happy racing! 🏁