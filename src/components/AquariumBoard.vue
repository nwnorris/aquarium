<template>
  <div class="board-container" ref="bc">
    <div class="board-holder" ref="holder" :style='computedWidth'>
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
    squareSelect(squareId) {
      console.log(squareId);
      this.squares[squareId].selected = !this.squares[squareId].selected;
      console.log(this.squares[squareId].selected);
    },
  },
  computed: {
    computedWidth() {
      const size = this.squareSize ? this.squareSize : 0;
      return `width: ${size * this.$props.boardWidth}px; height: ${size * this.$props.boardWidth}px;`;
    },
  },
  created() {
    this.selected = [];
  },
  mounted() {
    this.width = this.$refs.bc.clientWidth;
    this.height = this.$refs.bc.clientHeight;
    this.squareSize = this.width < this.height
      ? Math.floor(this.width / this.boardWidth)
      : Math.floor(this.height / this.boardHeight);
    this.squares = [];
    for (let i = 0; i < (this.boardWidth * this.boardHeight); i += 1) {
      this.squares.push({
        id: i,
        selected: false,
      });
    }
  },
};
</script>

<style lang="css" scoped>
  .board-container {
    width: 100%;
    height: 100%;
    background-color: gray;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .board-holder {
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(10, 1fr);
  }
</style>
