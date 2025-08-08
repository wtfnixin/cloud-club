# 🎯 Multiplayer Quiz Tic-Tac-Toe

A revolutionary twist on the classic Tic-Tac-Toe game! This real-time multiplayer game combines trivia questions with strategic gameplay, where players must answer quiz questions correctly to earn their turns on the board.

## 🌟 Key Features

### 🎮 Unique Gameplay Mechanics
- **Quiz-Based Turns**: Players compete to answer trivia questions first to earn the right to place their symbol
- **Timed Challenges**: 10-second timer for answering questions, 5-second timer for making moves
- **Real-Time Competition**: First player to answer correctly gets the turn

### 🌐 Multiplayer Experience
- **Real-Time Synchronization**: Powered by Firebase Realtime Database
- **Room-Based Games**: Create or join games using unique room codes
- **Spectator Mode**: Watch ongoing games without participating
- **Cross-Device Compatible**: Play with friends across different devices

### 🎨 Rich Media Experience
- **Dynamic Sound Effects**: 
  - Pop sound for moves
  - Victory fanfare for wins
  - Special draw sound (Among Us theme)
- **Animated Celebrations**:
  - Shin-chan GIF for victories
  - Dog meme GIF for draws
- **Modern UI**: Glassmorphism design with smooth animations

## 🎯 How to Play

### Game Flow
1. **Join a Game**: Create a new room or join an existing one with a room code
2. **Answer Questions**: When a question appears, be the first to answer correctly
3. **Make Your Move**: If you answered correctly, you have 5 seconds to place your symbol
4. **Win the Game**: Get three symbols in a row (horizontal, vertical, or diagonal)

### Player Roles
- **Player X (Host)**: Creates the game room and manages question flow
- **Player O (Guest)**: Joins using the room code
- **Spectator**: Watches the game without participating

### Timing System
- **Question Timer**: 10 seconds to answer trivia questions
- **Move Timer**: 5 seconds to place your symbol after answering correctly
- **Auto-Skip**: Timers automatically advance the game if time runs out

## 🚀 Quick Start

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

## 🛠️ Technical Architecture

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase Realtime Database
- **Styling**: Custom CSS with glassmorphism effects
- **Fonts**: Adobe Fonts (Aboreto family)
- **Audio**: HTML5 Audio API

### Firebase Integration
- **Real-time synchronization** of game state
- **Room-based architecture** for multiplayer sessions
- **Automatic cleanup** of game data
- **Cross-platform compatibility**

### Game State Management
```javascript
// Game state structure in Firebase
{
  board: Array(9),           // Game board state
  turn: String,              // Current player's turn
  players: Object,           // Connected players
  status: String,            // Game status (waiting/active)
  question: Object,          // Current question data
  winner: String,            // Winner symbol
  draw: Boolean              // Draw state
}
```

## 🎲 Quiz System

### Question Categories
Currently includes general knowledge questions covering:
- Geography (capitals, countries)
- Science (planets, basic facts)
- *Easily expandable for more categories*

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

## 🎮 Game Modes

### Standard Multiplayer
- Two players compete in real-time
- Quiz questions determine turn order
- First to three in a row wins

### Spectator Mode
- Watch ongoing games without participating
- Perfect for tournaments or learning
- Real-time updates without interaction ability

## 🔧 Customization Options

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
- Color schemes
- Animations
- Layout and spacing
- Font choices

## 🌐 Browser Compatibility

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

## 🔍 Troubleshooting

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

**Room Code Not Working**
- Verify the room code is entered correctly (case-sensitive)
- Ensure the host has created the room
- Try creating a new room

### Performance Tips
- Close unnecessary browser tabs
- Ensure stable internet connection
- Use modern browsers for best performance

## 🚀 Future Enhancements

### Planned Features
- [ ] User accounts and profiles
- [ ] Leaderboards and statistics
- [ ] More question categories
- [ ] Tournament mode
- [ ] Mobile app version
- [ ] Custom room settings
- [ ] AI opponent mode

### Contributing
This project is open for contributions! Ideas for improvements:
- Additional question categories
- New game modes
- UI/UX enhancements
- Performance optimizations
- Mobile responsiveness improvements

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Credits

- **Game Concept**: Innovative fusion of trivia and strategy
- **Sound Effects**: Carefully selected for engaging gameplay
- **Visual Design**: Modern glassmorphism aesthetic
- **Firebase Integration**: Real-time multiplayer functionality

---

**Ready to test your knowledge and strategy?** 🧠⚡

Start playing by opening `login.html` in your browser and challenge your friends to this unique gaming experience!
