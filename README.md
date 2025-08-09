# Multiplayer Quiz Tic-Tac-Toe

A real-time multiplayer game that combines trivia questions with classic Tic-Tac-Toe strategy. Players must answer quiz questions correctly to earn their turns on the board.

## Key Features

### Unique Gameplay Mechanics
- **Quiz-Based Turns**: Players compete to answer trivia questions first to earn the right to place their symbol
- **Timed Challenges**: 10-second timer for answering questions, 5-second timer for making moves
- **Real-Time Competition**: First player to answer correctly gets the turn

### Multiplayer Experience
- **Real-Time Synchronization**: Powered by Firebase Realtime Database
- **Room-Based Games**: Create or join games using unique room codes
- **Enhanced Spectator Mode**: Watch games with real-time player choice tracking
- **Cross-Device Compatible**: Play with friends across different devices
- **Secure Room Management**: 2-player limit with URL manipulation protection

### Rich Media Experience
- **Dynamic Sound Effects**: Pop sounds for moves, victory fanfare, and draw sounds
- **Animated Celebrations**: Victory and draw animations with custom GIFs
- **Modern UI**: Clean design with smooth animations and responsive layout

## How to Play

### Game Flow
1. **Join a Game**: Create a new room or join an existing one with a room code
2. **Answer Questions**: When a question appears, be the first to answer correctly
3. **Make Your Move**: If you answered correctly, you have 5 seconds to place your symbol
4. **Win the Game**: Get three symbols in a row (horizontal, vertical, or diagonal)

### Player Roles
- **Player X (Host)**: Creates the game room and manages question flow
- **Player O (Guest)**: Joins using the room code
- **Spectator**: Watches the game with enhanced view of both players' answer choices

### Timing System
- **Question Timer**: 10 seconds to answer trivia questions (continues on wrong answers)
- **Move Timer**: 5 seconds to place your symbol after answering correctly
- **Smart Timer Management**: Timers don't reset unexpectedly during gameplay

## Quick Start

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection for Firebase synchronization

### Setup Instructions
1. **Clone/Download** all project files to your local machine
2. **Ensure File Structure**: Keep all files in the same directory
3. **Open the Game**: Start with `login.html` in your web browser
4. **Create or Join**: Use the lobby to create a new game or join an existing one

### File Structure
```
prototype-tictac/
├── login.html              # Game lobby and room management
├── index.html              # Main game board and interface
├── login.js                # Lobby functionality and room handling
├── script.js               # Core game logic and Firebase integration
├── style.css               # Styling and animations
├── pop.mp3                 # Move sound effect
├── gameover.mp3            # Victory sound effect
├── amongus.mp3             # Draw sound effect
├── shin-chan-kiss-my-ass.gif  # Victory celebration
├── Dogmeme.gif             # Draw celebration
└── tumblr_60c9c5fc9a0f7f9fb2a52e5e938d798a_c5aff1db_250.gif
```

## Technical Architecture

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase Realtime Database
- **Styling**: Custom CSS with modern design principles
- **Fonts**: Adobe Fonts (Aboreto family)
- **Audio**: HTML5 Audio API

### Security Features
- **Room Capacity Limits**: Strict 2-player enforcement
- **URL Manipulation Protection**: Server-side validation prevents unauthorized access
- **Player Slot Validation**: Prevents duplicate players and unauthorized joins
- **Real-time State Validation**: Continuous game state verification

### Game State Management
```javascript
// Game state structure in Firebase
{
  board: Array(9),           // Game board state
  turn: String,              // Current player's turn
  players: Object,           // Connected players
  status: String,            // Game status (waiting/active/inprogress)
  question: Object,          // Current question data
  winner: String,            // Winner symbol
  draw: Boolean,             // Draw state
  answers: Object            // Player answer tracking
}
```

## Enhanced Spectator Mode

### Features
- **Real-time Player Choice Tracking**: See both players' answer selections instantly
- **Compact Layout**: All answer options visible simultaneously
- **Visual Indicators**: Clear marking of chosen vs unchosen answers
- **Professional Styling**: Clean, modern interface optimized for viewing

### Spectator View
Spectators can see:
- Current question and all answer options
- Which player chose which answer in real-time
- Game board updates and player moves
- Timer countdowns and game status

## Quiz System

### Question Categories
Currently includes general knowledge questions covering:
- Geography (capitals, countries)
- Science (planets, basic facts)
- Easily expandable for more categories

### Adding New Questions
Questions are stored in the `questions` array in `script.js`:
```javascript
const questions = [
    { 
        question: "Your question here?", 
        answers: ["Option 1", "Option 2", "Option 3"], 
        correct: "Correct Answer" 
    },
    // Add more questions...
];
```

## Game Modes

### Standard Multiplayer
- Two players compete in real-time
- Quiz questions determine turn order
- First to three in a row wins

### Enhanced Spectator Mode
- Watch ongoing games with detailed player choice tracking
- Perfect for tournaments, learning, or entertainment
- Real-time updates with professional interface

## Customization Options

### Sound Effects
Replace audio files with your own:
- `pop.mp3` - Move placement sound
- `gameover.mp3` - Victory sound
- `amongus.mp3` - Draw sound

### Visual Celebrations
Replace GIF files for custom celebrations:
- `shin-chan-kiss-my-ass.gif` - Victory animation
- `Dogmeme.gif` - Draw animation

### Styling
Modify `style.css` to customize:
- Color schemes and themes
- Layout and spacing
- Animations and transitions
- Font choices and typography

## Browser Compatibility

### Fully Supported
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Requirements
- JavaScript enabled
- Local storage access
- Audio playback capability
- Internet connection for multiplayer

## Troubleshooting

### Common Issues

**Game Won't Load**
- Check internet connection
- Ensure JavaScript is enabled
- Try refreshing the page

**Audio Not Playing**
- Check browser audio permissions
- Ensure audio files are in the correct directory
- Some browsers require user interaction before playing audio

**Firebase Connection Issues**
- Verify internet connection
- Check browser console for error messages
- Ensure Firebase configuration is correct

**Room Access Issues**
- Verify the room code is entered correctly (case-sensitive)
- Check if room is full (2-player limit)
- Ensure the host has created the room

### Performance Tips
- Close unnecessary browser tabs
- Ensure stable internet connection
- Use modern browsers for best performance
- Clear browser cache if experiencing issues

## Recent Updates

### Version 2.0 Features
- **Fixed Timer System**: Timers no longer reset unexpectedly on wrong answers
- **Enhanced Security**: Complete protection against URL manipulation
- **Improved Spectator Mode**: Real-time player choice tracking with compact layout
- **Better UX**: No-scroll page design with optimized positioning
- **Clean Code**: Removed all CSS comments for production-ready code

## Future Enhancements

### Planned Features
- User accounts and profiles
- Leaderboards and statistics
- More question categories
- Tournament mode
- Mobile app version
- Custom room settings
- AI opponent mode

### Contributing
This project is open for contributions. Ideas for improvements:
- Additional question categories
- New game modes
- UI/UX enhancements
- Performance optimizations
- Mobile responsiveness improvements

## License

This project is open source and available under the MIT License.

## Credits

- **Game Concept**: Innovative fusion of trivia and strategy
- **Sound Effects**: Carefully selected for engaging gameplay
- **Visual Design**: Modern, clean aesthetic
- **Firebase Integration**: Real-time multiplayer functionality
- **Security Implementation**: Robust room management and access control

---

**Ready to test your knowledge and strategy?**

Start playing by opening `login.html` in your browser and challenge your friends to this unique gaming experience!
