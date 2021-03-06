# Aquarium Creator
Aquarium Creator is a tool to easily create aquarium puzzles, and play existing puzzles. Currently, there aren't any easily accessible and simple tools to create aquarium puzzles; this project aims to fill that void. I also want to make a nice, clean interface to play aquarium puzzles on.

Author: Nate Norris (github.com/nwnorris)

## Creating a Puzzle
After deciding on the puzzle's dimensions, the user can begin defining aquarium 'blocks' by clicking on squares. A block is just a set of squares that are fully connected (there aren't any squares that have no connection to other block members.) Selecting an unassigned square will create a new block and select it for editing.

While editing a block, all the squares in the block become highlighted. Selecting a square will remove it from the block if it is a block member, and will add it to the block if it is adjacent and not part of an existing block.

If you want to add an adjacent square to your block, but it is already part of another block, you can hold shift while selecting the square to steal it into the block you're editing.

If you select a square that isn't a member of your block or adjacent to your block, the editor assumes you want to begin a new block and deselects your active block. You can also deselect your active block by pressing enter.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
