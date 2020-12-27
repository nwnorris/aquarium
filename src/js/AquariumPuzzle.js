class AquariumPuzzle {
  constructor(width, height, data = null) {
    if (!data) {
      //  Create new puzzle
      this.blocks = [];
      this.size = [width, height];
      this.numSquares = width * height;
      this.used = {};
      this.newBlock();
      this.connections = {};
      //  Initialize connection list
      [...Array(this.numSquares).keys()].forEach((index) => {
        this.connections[index] = [];
      });
    } else {
      //  Load puzzle from supplied JSON
    }
  }

  validateSquareID(squareID) {
    if (typeof (squareID) !== 'number') {
      throw new Error(`squareID must be a number (found ${typeof (squareID)})`);
    } else if (squareID < 0 || squareID >= this.numSquares) {
      throw new Error('squareID out of range -- must conform to 0 <= sid <= (w * h)');
    }
    return squareID;
  }

  //  Is square 1 adjacent to square 2?
  isAdjacent(square1, square2) {
    const diff = square1 - square2;
    return Math.abs(diff) === 1 || Math.abs(diff) === this.size[0];
  }

  canBeAddedToActiveBlock(sid) {
    const squareID = this.validateSquareID(sid);
    let valid = this.activeBlock.length === 0;
    const connected = [];
    this.activeBlock.forEach((square) => {
      const result = this.isAdjacent(squareID, square);
      if (result) {
        valid = true;
        connected.push(square);
      }
    });
    return [valid, connected];
  }

  handleSquare(sid) {
    const squareID = this.validateSquareID(sid);
    if (this.activeBlock.indexOf(squareID) >= 0) {
      this.removeSquare(squareID);
    } else {
      this.addSquare(squareID);
    }
  }

  //  Add square to active block, removing from other block if already assigned.
  addSquare(squareID) {
    const result = this.canBeAddedToActiveBlock(squareID);
    const conn = result[1];
    const valid = result[0];
    if (valid) {
      if (squareID in this.used) {
        const arr = this.used[squareID];
        arr.splice(arr.indexOf(squareID), 1);
      }
      this.activeBlock.push(squareID);
      conn.forEach((otherSquare) => {
        this.connections[squareID].push(otherSquare);
        this.connections[otherSquare].push(squareID);
      });
    }
  }

  //  Assume that sid was already checked to be a member of the active block.
  removeSquare(squareID) {
    this.activeBlock.splice(this.activeBlock.indexOf(squareID), 1);
    this.connections[squareID].forEach((otherSquare) => {
      this.removeConnection(otherSquare, squareID);
    });
    this.connections[squareID] = [];
  }

  removeConnection(s1, s2) {
    const index = this.connections[s1].indexOf(s2);
    if (index >= 0) this.connections[s1].splice(index, 1);
  }

  selectBlock(squareID) {
    this.saveActiveBlock();
    this.activeBlock = this.used[squareID];
  }

  nextBlock() {
    this.saveActiveBlock();
    this.newBlock();
  }

  newBlock() {
    this.activeBlock = [];
  }

  saveActiveBlock() {
    this.blocks.push(this.activeBlock);
    this.activeBlock.forEach((squareID) => {
      this.used[squareID] = this.activeBlock;
    });
  }

  toJSON() {
    const output = {
      size: {
        x: this.size[0],
        y: this.size[1],
      },
      blocks: this.blocks,
    };

    return JSON.stringify(output);
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
