class AquariumPuzzle {
  constructor(width, height, data = null) {
    if (!data) {
      //  Create new puzzle
      this.blocks = [];
      this.activeBlockId = 0;
      this.width = width;
      this.height = height;
      this.shiftPressed = false;
      this.numSquares = width * height;
      this.blockMembership = {};
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
    const verticalAdj = Math.abs(diff) === this.width;
    const edgeMap = [square1, square2].map((item) => item % this.width);
    const isEdgeConnection = edgeMap.indexOf(0) > -1 && edgeMap.indexOf(this.width - 1) > -1;
    const horizontalAdj = Math.abs(diff) === 1 && !isEdgeConnection;
    return [horizontalAdj || verticalAdj, diff];
  }

  //  Simple way to access the opposite direction given a string (usually from a object key)
  static oppositeDirection(dirStr) {
    switch (dirStr) {
      case 'bottom':
        return 'top';
      case 'top':
        return 'bottom';
      case 'right':
        return 'left';
      case 'left':
        return 'right';
      default:
        return 'error';
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
            connected.left = square;
            break;
          case -1:
            connected.right = square;
            break;
          case this.height:
            connected.top = square;
            break;
          case (this.height * -1):
            connected.bottom = square;
            break;
          default:
            break;
        }
      }
    });
    return [valid, connected];
  }

  isAnyBlockMember(sid) {
    return sid in this.blockMembership;
  }

  getBlockFromSquare(squareID) {
    return this.blocks[this.blockMembership[squareID]];
  }

  handleSquare(sid) {
    const squareID = this.validateSquareID(sid);
    if (this.isAnyBlockMember(squareID) && this.blockMembership[squareID] !== this.activeBlockId) {
      if (this.shiftPressed) {
        this.stealSquare(squareID);
      } else {
        this.saveActiveBlock();
        this.selectBlock(squareID);
      }
    } else if (this.activeBlock.indexOf(squareID) >= 0) {
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
      if (this.isAnyBlockMember(squareID)) {
        const block = this.blocks[this.blockMembership[squareID]];
        block.splice(block.indexOf(squareID), 1);
      }
      this.blockMembership[squareID] = this.activeBlockId;
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

  //  Take square that is part of another block and join it to the active block
  stealSquare(squareID) {
    const squareOldBlock = this.blockMembership[squareID];
    this.removeSquareFromBlock(squareID);
    this.addSquare(squareID);
    //  Make sure other modified block isn't invalid after removal of square
    this.splitIntoMultipleValidBlocks(this.blocks[squareOldBlock]);
  }

  //  Assume that sid was already checked to be a member of the active block.
  removeSquare(squareID) {
    this.removeSquareFromBlock(squareID, this.activeBlock);
  }

  //  Disassocaite square from member block
  removeSquareFromBlock(squareID, block = null) {
    let b = block;
    if (!block) {
      b = this.getBlockFromSquare(squareID);
    }
    b.splice(b.indexOf(squareID), 1);
    Object.entries(this.connections[squareID]).forEach((item) => {
      const dir = item[0];
      const otherSquare = item[1];
      delete this.connections[otherSquare][AquariumPuzzle.oppositeDirection(dir)];
    });
    this.connections[squareID] = {};
    delete this.blockMembership[squareID];
  }

  removeConnection(s1, s2) {
    const index = this.connections[s1].indexOf(s2);
    if (index >= 0) this.connections[s1].splice(index, 1);
  }

  selectBlock(squareId) {
    this.saveActiveBlock();
    this.activeBlockId = this.blockMembership[squareId];
    this.activeBlock = this.blocks[this.activeBlockId];
  }

  //  Save active block, recursively saving disconnected blocks as new blocks.
  //  This can easily happen if editing a block or stealing from another blocks
  //  removes connectivity between all members of the block.
  splitIntoMultipleValidBlocks(block) {
    if (block.length > 0) {
      // Deep copy, block is always just int array (no JSON issues)
      const b = JSON.parse(JSON.stringify(block));
      const connected = [b[0]];
      const newBlock = [b[0]];
      while (connected.length > 0) {
        const square = connected.pop();
        b.splice(b.indexOf(square), 1);
        Object.values(this.connections[square]).forEach((item) => {
          if (newBlock.indexOf(item) === -1) {
            newBlock.push(item);
            connected.push(item);
          }
        });
      }
      //  Reassign squares to new block
      this.blocks.push(JSON.parse(JSON.stringify(newBlock)));
      newBlock.forEach((square) => {
        this.blockMembership[square] = this.blocks.length - 1;
      });
      this.splitIntoMultipleValidBlocks(b);
    }
  }

  nextBlock() {
    //  Possible for active block to have been edited into an invalid block state,
    //  might need to split into multiple blocks.
    this.splitIntoMultipleValidBlocks(this.activeBlock);
    this.newBlock();
  }

  saveActiveBlock() {
    this.splitIntoMultipleValidBlocks(this.activeBlock);
  }

  newBlock() {
    this.activeBlock = [];
    this.activeBlockId = this.blocks.length;
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
