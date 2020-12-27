const fs = require('fs');
const path = require('path');

class AquariumPuzzle {
  constructor(puzzleID) {
    this.ID = puzzleID;
    const puzzPath = path.join(__dirname, '..', 'puzzles', `${puzzleID}.json`);
    const data = fs.readFileSync(puzzPath);
    const puzzJson = JSON.parse(data);
    if (this.validate(puzzJson)) {
      console.log(`${puzzleID} passed validation.`);
    }
    this.blocks = puzzJson.blocks;
  }

  validate(puzzleJSON) {
    //  Validate size
    this.size = [puzzleJSON.size.x, puzzleJSON.size.y];
    if (!(this.size[0] && this.size[1])) {
      throw new Error(`Invalid size in puzzle ${this.ID}`);
    }
    const usedSquares = {};
    const totalSize = this.size[0] * this.size[1];
    //  Check square duplication
    puzzleJSON.blocks.forEach((block) => {
      block.forEach((squareID) => {
        if (!(squareID in usedSquares)) {
          usedSquares[squareID] = true;
        } else {
          throw new Error(`Square ${this.ID} is in more than one block.`);
        }
      });
    });
    //  Check square utilization
    [...Array(totalSize).keys()].forEach((id) => {
      if (!(id in usedSquares)) {
        throw new Error(`Square ${id} not part of a block.`);
      }
    });
    return true;
  }
}

module.exports = AquariumPuzzle;
