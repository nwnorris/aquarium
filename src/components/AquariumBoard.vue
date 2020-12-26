<template>
  <div class="board-container" ref="bc">
    <div class="board-holder">
      <AquariumBoardSquare :width='squareSize' :height='squareSize'
      v-for="sq in squares" :key="sq.id"/>
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
  mounted() {
    this.width = this.$refs.bc.clientWidth;
    this.height = this.$refs.bc.clientHeight;
    this.squareSize = this.width < this.height
      ? Math.floor(this.width / this.boardWidth)
      : Math.floor(this.height / this.boardHeight);
    console.log(this.width, this.height, this.boardWidth, this.boardHeight, this.squareSize);
    this.squares = [];
    for (let i = 0; i < (this.boardWidth * this.boardHeight); i += 1) {
      this.squares.push({
        id: i,
      });
    }
    console.log(this.squares);
  },
};
</script>

<style lang="css" scoped>
  .board-container {
    width: 100%;
    height: 100%;
    background-color: gray;
  }
  .board-holder {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
</style>
