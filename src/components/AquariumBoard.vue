<template>
  <div class="board-container" ref="bc">
    <div class="board-holder" ref="holder" :style='computedStyle'>
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
</template>

<script>
import AquariumBoardSquare from './AquariumBoardSquare.vue';
import AquariumPuzzle from '../js/AquariumPuzzle';

export default {
  name: 'AquariumBoard',
  components: {
    AquariumBoardSquare,
  },
  props: {
    boardWidth: Number,
    boardHeight: Number,
  },
  data() {
    return {
      squareSize: this.squareSize,
      squares: this.squares,
    };
  },
  methods: {
    squareSelect(squareID) {
      //  this.squares[squareId].selected = !this.squares[squareId].selected;
      const sid = parseInt(squareID, 10);
      this.puzzle.handleSquare(sid);
      //  this.updateActiveBlock();
    },
    updateActiveBlock() {
      this.puzzle.activeBlock.forEach((square) => {
        this.squares[square].selected = true;
      });
    },
  },
  computed: {
    computedStyle() {
      const size = this.squareSize ? this.squareSize : 0;
      const width = `width: ${size * this.$props.boardWidth}px;`;
      const height = `height: ${size * this.$props.boardWidth}px;`;
      const col = `grid-template-columns: repeat(${this.boardWidth}, 1fr);`;
      const row = `grid-template-rows: repeat(${this.boardHeight}, 1fr);`;
      return [width, height, col, row].join(' ');
    },
  },
  created() {
    this.puzzle = new AquariumPuzzle(this.boardWidth, this.boardHeight);
    console.log(this.boardWidth, this.boardHeight);
  },
  mounted() {
    this.width = this.$refs.bc.clientWidth;
    this.height = this.$refs.bc.clientHeight;
    this.squareSize = this.width < this.height
      ? Math.floor(this.width / this.boardWidth)
      : Math.floor(this.height / this.boardHeight);
    this.squares = [];
    const puzz = this.puzzle;
    for (let i = 0; i < (this.boardWidth * this.boardHeight); i += 1) {
      this.squares.push({
        id: i,
        puzzle: puzz,
        selected() {
          return this.puzzle.activeBlock.indexOf(this.id) >= 0;
        },
      });
    }
  },
};
</script>

<style lang="css" scoped>
  .board-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .board-holder {
    margin: 0;
    padding: 0;
    display: grid;
  }
</style>
