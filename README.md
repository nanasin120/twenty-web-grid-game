# Twenty - Web Grid Game

A modern, interactive 4x4 grid puzzle game built with pure HTML, CSS, and JavaScript.

## Game Overview

**Twenty** is a strategic puzzle game where you:
- Drag number and modifier cards from your hand onto a 4x4 grid
- Make lines (horizontal, vertical, or diagonal) that sum to exactly 20
- Use +1 and -1 modifier cards to adjust existing numbers
- Keep playing until the grid is full with only number cards

## Features

✨ **Core Gameplay:**
- 4x4 grid with 5 available card slots
- Numbers: 1-9
- Modifiers: +1, -1
- Line clearing: Horizontal, Vertical, Diagonals (4 cells only)
- Score system

🎨 **Visual Design:**
- Light and dark theme toggle
- Responsive mobile design
- Smooth animations and transitions
- Intuitive drag-and-drop interface

🔊 **Audio:**
- Web Audio API sound effects
- Place, clear, adjust, and game-over sounds
- Mute toggle

## How to Play

1. **Place Cards**: Drag cards from your hand onto empty grid cells
2. **Make Lines**: Create horizontal, vertical, or diagonal lines that sum to 20
3. **Clear Lines**: When a line sums to 20, it clears and you score 10 points
4. **Use Modifiers**: Use +1 and -1 cards to adjust existing numbers (range: 1-9)
5. **Win Condition**: Create as many lines as possible before the grid fills
6. **Lose Condition**: Grid fills with only number cards (no modifiers left)

## Rules

- **Placement**: Number cards can only be placed on empty cells
- **Modifiers**: +1/-1 cards can be placed on both empty cells and occupied cells
- **Range**: Numbers must stay between 1-9 (can't place +1 on 9, or -1 on 1)
- **Clearing**: Lines with sum = 20 are automatically cleared
- **Game Over**: Game ends only when grid is completely filled with number cards

## Project Structure

```
twenty-web-grid-game/
├── index.html              # Main HTML file
├── css/
│   ├── style.css          # Main styles
│   └── theme.css          # Theme variables (light/dark)
├── js/
│   ├── main.js            # Entry point
│   ├── game.js            # Main game logic
│   ├── grid.js            # Grid management
│   ├── cards.js           # Card management
│   ├── drag-drop.js       # Drag and drop logic
│   ├── collision.js       # Collision detection
│   ├── sound.js           # Sound effects manager
│   └── theme.js           # Theme management
└── README.md              # This file
```

## Technologies Used

- **HTML5**: Structure
- **CSS3**: Styling with CSS Variables for theming
- **JavaScript (ES6+)**: Game logic and interactivity
- **Web Audio API**: Sound effects generation

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Installation & Running

1. Clone the repository:
```bash
git clone https://github.com/nanasin120/twenty-web-grid-game.git
cd twenty-web-grid-game
```

2. Open `index.html` in a web browser or serve with a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js
npx http-server
```

3. Open `http://localhost:8000` in your browser

## Controls

- **Mouse**: Click and drag cards to place
- **Touch**: Touch and drag cards on mobile
- **Theme Toggle**: Click the 🌙/☀️ button to switch themes
- **New Game**: Click "New Game" button after game ends

## Game Tips

- Plan ahead - think about how cards will align for clearing
- Use modifiers strategically to create sum = 20 combinations
- Keep modifier cards available in case you need to adjust numbers
- Don't fill the grid with just high numbers (1-5 are safer for clearing)

## Future Enhancements

- [ ] Leaderboard system
- [ ] Multiple game modes
- [ ] Difficulty levels
- [ ] Undo functionality
- [ ] Replay system
- [ ] Statistics tracking
- [ ] Achievements/Badges
- [ ] Multiplayer (local)

## License

MIT License - Feel free to use, modify, and distribute

## Author

Created by nanasin120

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues for bugs and feature requests.

---

**Enjoy the game! 🎮**