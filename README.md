# Multiplayer Quiz Tic-Tac-Toe

A real-time multiplayer game that combines trivia questions with classic Tic-Tac-Toe strategy. Players must answer quiz questions correctly to earn their turns on the board.

## Table of Contents
- [Key Features](#key-features)
- [How to Play](#how-to-play)
- [Quick Start](#quick-start)
- [Technical Architecture](#technical-architecture)
- [Game Modes](#game-modes)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Development](#development)

## Key Features

### Gameplay Mechanics
- **Quiz-Based Turns**: Players compete to answer trivia questions first to earn the right to place their symbol
- **Timed Challenges**: 10-second timer for answering questions, 5-second timer for making moves
- **Real-Time Competition**: First player to answer correctly gets the turn

### Multiplayer Experience
- **Real-Time Synchronization**: Powered by Firebase Realtime Database
- **Room-Based Games**: Create or join games using unique room codes
- **Enhanced Spectator Mode**: Watch games with real-time player choice tracking
- **Cross-Device Compatible**: Play with friends across different devices
- **Secure Room Management**: 2-player limit with URL manipulation protection

### Media Experience
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
- **Question Timer**: 10 seconds to answer trivia questions
- **Move Timer**: 5 seconds to place your symbol after answering correctly
- **Smart Timer Management**: Timers don't reset unexpectedly during gameplay

## Quick Start

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection for Firebase synchronization

### Setup Instructions
1. Download all project files to your local machine
2. Keep all files in the same directory
3. Open `login.html` in your web browser
4. Create a new game or join an existing one using the lobby

### File Structure
```
project/
├── login.html              # Game lobby and room management
├── index.html              # Main game board and interface
├── login.js                # Lobby functionality and room handling
├── script.js               # Core game logic and Firebase integration
├── gsap.js                 # Animation library
├── style.css               # Main styling and animations
├── login-card.css          # Login card styling
├── login-card-modal.css    # Modal styling
├── pop.mp3                 # Move sound effect
├── gameover.mp3            # Victory sound effect
├── amongus.mp3             # Draw sound effect
├── shin-chan-kiss-my-ass.gif  # Victory celebration
└── Dogmeme.gif             # Draw celebration
```

## Technical Architecture

### Technologies
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase Realtime Database
- **Styling**: Custom CSS with modern design principles
- **Animation**: GSAP library for smooth animations
- **Audio**: HTML5 Audio API

### Security Features
- Room capacity limits with strict 2-player enforcement
- Server-side validation prevents unauthorized access
- Player slot validation prevents duplicate players
- Real-time game state verification

### Game State Management
The game state is managed through Firebase Realtime Database with the following structure:
- Board state array
- Current player turn
- Connected players information
- Game status (waiting/active/in-progress)
- Current question data
- Winner and draw states
- Player answer tracking

## Game Modes

### Standard Multiplayer
Two players compete in real-time with quiz questions determining turn order. First to achieve three in a row wins the game.

### Enhanced Spectator Mode
Watch ongoing games with detailed player choice tracking, perfect for tournaments or learning. Features real-time updates with a professional interface.

## Customization

### Sound Effects
Replace the audio files to customize game sounds:
- `pop.mp3` - Move placement sound
- `gameover.mp3` - Victory sound
- `amongus.mp3` - Draw sound

### Visual Elements
Customize celebrations by replacing GIF files:
- `shin-chan-kiss-my-ass.gif` - Victory animation
- `Dogmeme.gif` - Draw animation

### Styling
Modify CSS files to customize:
- Color schemes and themes in `style.css`
- Login card styling in `login-card.css`
- Modal styling in `login-card-modal.css`
- Animations and transitions

## Troubleshooting

### Common Issues

**Game Loading Issues**
- Check internet connection
- Ensure JavaScript is enabled
- Refresh the page if needed

**Audio Problems**
- Check browser audio permissions
- Verify audio files are in correct directory
- Some browsers require user interaction before playing audio

**Connection Issues**
- Verify internet connection
- Check browser console for error messages
- Ensure Firebase configuration is correct

**Room Access Problems**
- Verify room code is entered correctly (case-sensitive)
- Check if room is full (2-player limit)
- Ensure host has created the room

### Performance Tips
- Close unnecessary browser tabs
- Ensure stable internet connection
- Use modern browsers for best performance
- Clear browser cache if experiencing issues

## Development

### Adding Questions
Questions are stored in the `questions` array in `script.js`:

```javascript
const questions = [
    { 
        question: "Your question here?", 
        answers: ["Option 1", "Option 2", "Option 3"], 
        correct: "Correct Answer" 
    }
    // Add more questions...
];
```

### Recent Updates
- Fixed timer system to prevent unexpected resets
- Enhanced security against URL manipulation
- Improved spectator mode with real-time choice tracking
- Better user experience with no-scroll page design
- Clean production-ready code

### Future Enhancements
- User accounts and profiles
- Leaderboards and statistics
- Additional question categories
- Tournament mode
- Mobile app version
- Custom room settings
- AI opponent mode

## License
This project is open source and available under the MIT License.

## Credits
- Innovative game concept combining trivia and strategy
- Carefully selected sound effects
- Modern, clean visual design
- Firebase integration for real-time multiplayer
- Robust security implementation

---

Start playing by opening `login.html` in your browser and challenge your friends to this unique gaming experience!
