# TODO: Convert HTML/JS Survival Simulation to Next.js

## Current Status
- Original game in index.html with full JS logic
- Complete port in SurvivalSimulation.tsx (all JS functions ported)
- Updated page.tsx to use SurvivalSimulation component

## Plan
1. Test the game functionality
2. Ensure all features work: AI, inventory, shelter, weather, seasons, mini-map, pause/FF, etc.

## Steps
- [x] Finish porting regenerateResources, updateEvents, updateSeason, checkAchievements, updateUI, draw, drawMiniMap, drawShelterInterior, update, gameLoop, setupAndStartGame, togglePause, toggleFF, exportLog, getRandomInt functions to SurvivalSimulation.tsx
- [x] Add event listeners for buttons in SurvivalSimulation.tsx
- [x] Update page.tsx to import and render SurvivalSimulation
- [ ] Test the game functionality
