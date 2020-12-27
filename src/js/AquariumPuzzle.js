const fs = require('fs')
const path = require('path')

class AquariumPuzzle {
  constructor(puzzleID) {
    const puzzPath = path.join(__dirname, '..', 'puzzles', `${puzzleID}.json`);
    let data = fs.readFileSync(puzzPath);
    this.puzzJson = JSON.parse(data);
    //Validate size
    this.size = [this.puzzJson.size.x, this.puzzJson.size.y]
    if (!(this.size[0] && this.size[1])) {
      throw `Invalid size in puzzle ${puzzleID}`;
    }
    const usedSquares = {}
    const totalSize = this.size[0] * this.size[1];
    //Check square duplication
    this.puzzJson.blocks.forEach((block) => {
      block.forEach((squareID) => {
        if(!(squareID in usedSquares)) {
          usedSquares[squareID] = true;
        } else {
          throw `Square ${squareID} is in more than one block.`;
        }
      });
    });
    //Check square utilization
    [...Array(totalSize).keys()].forEach((id) => {
      if (!(id in usedSquares)) {
        throw `Square ${id} not part of a block.`;
      }
    });
    console.log(`${puzzleID} passed validation.`);
  }
}

module.exports = AquariumPuzzle
