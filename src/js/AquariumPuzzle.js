class AquariumPuzzle {
  constructor(width, height, data = null) {
    if (!data) {
      //  Create new puzzle
      this.blocks = [];
      this.width = width;
      this.height = height;
      this.numSquares = width * height;
      this.used = {};
      this.newBlock();
      this.connections = {};
      //  Initialize connection list
      [...Array(this.numSquares).keys()].forEach((index) => {
        this.connections[index] = {};
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
    return [Math.abs(diff) === 1 || Math.abs(diff) === this.width, diff];
  }

  //  Simple way to access the opposite direction given a string (usually from a object key)
  static oppositeDirection(dirStr) {
    switch (dirStr) {
      case 'b':
        return 't';
      case 't':
        return 'b';
      case 'r':
        return 'l';
      case 'l':
        return 'r';
      default:
        return 'z';
    }
  }

  canBeAddedToActiveBlock(sid) {
    const squareID = this.validateSquareID(sid);
    let valid = this.activeBlock.length === 0;
    const connected = {};
    this.activeBlock.forEach((square) => {
      //  result = (adjacent, direction)
      const result = this.isAdjacent(squareID, square);
      if (result[0]) {
        valid = true;
        const direction = result[1];
        switch (direction) {
          case 1:
            connected.l = square;
            break;
          case -1:
            connected.r = square;
            break;
          case this.height:
            connected.t = square;
            break;
          case (this.height * -1):
            connected.b = square;
            break;
          default:
            break;
        }
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
    const valid = result[0];
    const conn = result[1];
    if (valid) {
      if (squareID in this.used) {
        const arr = this.used[squareID];
        arr.splice(arr.indexOf(squareID), 1);
      }
      this.activeBlock.push(squareID);
      //  Bidirectional connection reference
      Object.entries(conn).forEach((item) => {
        const k = item[0];
        const v = item[1];
        this.connections[squareID][k] = v;
        this.connections[v][AquariumPuzzle.oppositeDirection(k)] = squareID;
      });
    }
  }

  //  Assume that sid was already checked to be a member of the active block.
  removeSquare(squareID) {
    this.activeBlock.splice(this.activeBlock.indexOf(squareID), 1);
    Object.values(this.connections[squareID]).forEach((otherSquare) => {
      delete this.connections[otherSquare][squareID];
    });
    this.connections[squareID] = {};
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
        x: this.width,
        y: this.height,
      },
      blocks: this.blocks,
    };

    return JSON.stringify(output);
  }

  validate(puzzleJSON) {
    //  Validate size
    this.width = puzzleJSON.size.x;
    this.height = puzzleJSON.size.y;
    if (!(this.width && this.height)) {
      throw new Error(`Invalid size in puzzle ${this.ID}`);
    }
    const usedSquares = {};
    const totalSize = this.width * this.height;
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
