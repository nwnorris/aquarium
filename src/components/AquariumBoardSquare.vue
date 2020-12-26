<template>
  <div class="square-container" :style='squareStyle'>

  </div>
</template>

<script>
export default {
  name: 'AquariumBoardSquare',
  props: ['width', 'height'],
  computed: {
    squareStyle() {
      return `min-width: ${this.$props.width}px; min-height: ${this.$props.height}px;`;
    },
  },
};
</script>

<style lang="css" scoped>
  .square-container {
    display: inline-block;
    border: 1px solid black;
    flex-grow: 1;
  }
</style>
