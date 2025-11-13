# Taiga Survival Simulation

A comprehensive survival simulation game built with Next.js, featuring advanced AI, dynamic weather systems, seasons, inventory management, shelter building, and more.

## Features

- **Advanced AI Survivor**: Intelligent AI that makes decisions based on current conditions
- **Dynamic Weather System**: Weather changes (sunny, rain, snow) affecting gameplay
- **Seasonal Changes**: Four seasons (Spring, Summer, Autumn, Winter) with temperature variations
- **Inventory Management**: Collect and craft items (wood, stone, food, fur, tools)
- **Shelter Building**: Build and upgrade shelters for protection
- **Mini-Map**: Real-time map overview
- **Sound Effects**: Audio feedback for important events
- **Achievements**: Unlock achievements based on survival milestones
- **Pause/Fast Forward**: Control game speed
- **Activity Log**: Detailed logging of all survivor actions
- **Export Logs**: Save your survival logs to file

## Game Mechanics

### Survivor Stats
- **Health**: Affected by warmth, hunger, and thirst
- **Warmth**: Maintained by fire, shelter, and clothing
- **Hunger**: Requires food collection and consumption
- **Thirst**: Requires water collection and consumption

### Resources
- **Wood**: For building shelters and making fires
- **Stone**: For shelter upgrades and tools
- **Food**: Obtained through hunting and fishing
- **Fur**: Used for crafting clothing and thread
- **Water**: Essential for survival

### Crafting System
- **Thread**: Made from fur
- **Fishing Rod**: Made from thread and stone
- **Fur Coat**: Provides warmth bonus
- **Spear**: Improves hunting success
- **Traps**: Automatic food collection

### Environmental Factors
- **Temperature**: Varies by time of day and season
- **Weather Events**: Random storms and weather changes
- **Resource Regeneration**: Resources respawn over time
- **Predator Threats**: Wolves and other dangers

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ridzidev/taiga-survival-nextjs.git
cd taiga-survival-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Play

1. **Start Simulation**: Click "Mulai / Atur Ulang" to begin
2. **Configure Parameters**: Adjust map size, resource counts, and AI intelligence
3. **Watch the AI**: The survivor will automatically make decisions to survive
4. **Monitor Stats**: Keep an eye on health, warmth, hunger, and thirst
5. **Build Shelter**: Gather resources to build and upgrade shelter
6. **Craft Tools**: Create fishing rods, spears, and traps for better survival
7. **Manage Resources**: Balance resource gathering with consumption needs

## Controls

- **Pause**: Pause/resume the simulation
- **Fast Forward**: Speed up time (2x speed)
- **Export Log**: Save activity log to file
- **Reset**: Start a new simulation

## Technical Details

- **Framework**: Next.js 16 with TypeScript
- **Rendering**: Canvas-based 2D graphics
- **Audio**: Web Audio API for sound effects
- **State Management**: React hooks and component state
- **Styling**: Inline CSS with retro terminal aesthetic

## Original Version

This is a Next.js port of the original HTML/JavaScript version. The original `index.html` file is included for reference.

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
