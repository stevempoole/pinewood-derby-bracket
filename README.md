# 🏁 Pinewood Derby Tournament Bracket

A complete, production-ready web application for managing pinewood derby tournament brackets. Built with vanilla HTML, CSS, and JavaScript for maximum compatibility and ease of deployment.

## ✨ Features

### Tournament Management
- **Multi-Tournament Support**: Create, manage, and switch between multiple tournaments
- **Dynamic Bracket Generation**: Supports 4-32 participants with automatic bracket sizing
- **Elimination Format**: Standard single-elimination tournament structure
- **Bye Handling**: Automatically manages byes for non-power-of-2 participant counts
- **Winner Selection**: Click-to-select winners with automatic advancement
- **Real-time Updates**: Instant bracket updates as matches are completed

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

### Setting Up the Tournament

1. **Add Participants**
   - Enter racer names in the input field
   - Press Enter or click "Add Racer"
   - Use Quick Setup buttons for testing (8 or 16 racers)
   - Remove participants by clicking the × button

2. **Start Tournament**
   - Minimum 4 participants required
   - Maximum 32 participants supported
   - Click "Start Tournament" when ready

### Running the Tournament

1. **Navigate the Bracket**
   - Matches are organized by rounds (First Round, Quarter-Final, etc.)
   - Scroll horizontally to see all rounds on mobile devices

2. **Select Winners**
   - Click on the winning participant in each match
   - Winners automatically advance to the next round
   - Complete matches show in green with winner highlighted

3. **Tournament Completion**
   - Continue until all matches are completed
   - Final winner is announced with celebration animation
   - Option to start a new tournament

### Managing the Tournament

- **Reset Tournament**: Start over with same participants
- **Back to Setup**: Return to participant management
- **New Tournament**: Clear everything and start fresh
- **Clone Tournament**: Create a copy with same participants
- **Export/Import**: Save and restore tournament data

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

- **Cub Scout Pinewood Derby events**
- **School science fair races**
- **Community racing competitions**
- **Family tournament nights**
- **Any single-elimination tournament**

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