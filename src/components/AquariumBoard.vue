<template>
  <div class="board-container" ref="bc" @keyup='nextBlock'>
    <div class="constraint-y-holder">
      <AquariumConstraintSquare
        :width='squareSize'
        :height='squareSize'
        v-for='(col, i) in constraints.y'
        :key='i' />
    </div>
    <div class="board-row-2">
      <div class="constraint-x-holder">
          <AquariumConstraintSquare
            :width='squareSize'
            :height='squareSize'
            v-for='(col, i) in constraints.x'
            :key = 'i'/>
      </div>
      <div class="board-holder" ref="holder" :style='boardSquareStyle'>
        <AquariumBoardSquare
        :width='squareSize'
        :height='squareSize'
        v-for="sq in squares"
        :key="sq.id"
        :id="sq.id"
        :square='sq'
        @square-select='squareSelect'/>
      </div>
    </div>
  </div>
</template>

<script>
import AquariumBoardSquare from './AquariumBoardSquare.vue';
import AquariumPuzzle from '../js/AquariumPuzzle';
import AquariumConstraintSquare from './AquariumConstraintSquare.vue';
import '../css/AquariumBoard.css';

export default {
  name: 'AquariumBoard',
  components: {
    AquariumBoardSquare,
    AquariumConstraintSquare,
  },
  props: {
    boardWidth: Number,
    boardHeight: Number,
  },
  data() {
    return {
      squareSize: this.squareSize,
      squares: this.squares,
      constraints: this.constraints,
    };
  },
  methods: {
    squareSelect(squareID) {
      const sid = parseInt(squareID, 10);
      this.puzzle.handleSquare(sid);
    },
    updateActiveBlock() {
      this.puzzle.activeBlock.forEach((square) => {
        this.squares[square].selected = true;
      });
    },
    handleKeyDown(e) {
      switch (e.key) {
        case 'Shift':
          this.puzzle.shiftPressed = true;
          break;
        default:
          break;
      }
    },
    handleKeyUp(e) {
      switch (e.key) {
        case 'Enter':
          this.nextBlock();
          break;
        case 'Shift':
          this.puzzle.shiftPressed = false;
          break;
        default:
          break;
      }
    },
    nextBlock() {
      this.puzzle.nextBlock();
    },
  },
  computed: {
    boardSquareStyle() {
      const size = this.squareSize ? this.squareSize : 0;
      const width = `min-width: ${size * this.$props.boardWidth}px;`;
      const maxwidth = `max-width: ${size * this.$props.boardWidth}px;`;
      const height = `min-height: ${size * this.$props.boardWidth}px;`;
      const maxheight = `max-height: ${size * this.$props.boardWidth}px;`;
      const col = `grid-template-columns: repeat(${this.boardWidth}, 1fr);`;
      const row = `grid-template-rows: repeat(${this.boardHeight}, 1fr);`;
      return [width, height, maxwidth, maxheight, col, row].join(' ');
    },
  },
  created() {
    this.puzzle = new AquariumPuzzle(this.boardWidth, this.boardHeight);
    this.constraints = this.puzzle.constraints;
    console.log(this.constraints);
    this.shiftPressed = false;
    //  Add event listeners that Vue can't normally handle (key events on non-form/input elemenmts)
    document.addEventListener('keyup', this.handleKeyUp);
    document.addEventListener('keydown', this.handleKeyDown);
  },
  destroyed() {
    document.removeEventListener('keyup', this.handleKeyUp);
    document.removeEventListener('keydown', this.handleKeyDown);
  },
  mounted() {
    this.width = this.$refs.bc.clientWidth;
    this.height = this.$refs.bc.clientHeight;
    this.squareSize = this.width < this.height
      ? Math.floor(this.width / (this.boardWidth + 1))
      : Math.floor(this.height / (this.boardHeight + 1));
    this.squares = [];
    const puzz = this.puzzle;
    for (let i = 0; i < (this.boardWidth * this.boardHeight); i += 1) {
      this.squares.push({
        id: i,
        puzzle: puzz,
        selected() {
          return this.puzzle.activeBlock.indexOf(this.id) >= 0;
        },
        connections() {
          return this.puzzle.connections[this.id];
        },
        isAnyBlockMember() {
          return this.puzzle.isAnyBlockMember(this.id);
        },
      });
    }
  },
};
</script>

<style lang="css" scoped>
</style>
