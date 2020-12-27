<template>
  <div class="square-container" v-on:click='handleClick($event)' :style='style'>

  </div>
</template>

<script>
export default {
  name: 'AquariumBoardSquare',
  props: ['width', 'height', 'square'],
  methods: {
    handleClick(event) {
      this.$emit('square-select', event.target.id);
    },
  },
  mounted() {
    this.id = this.square.id;
  },
  computed: {
    style() {
      let color = 'white';
      if (this.square.selected()) {
        color = '#ccc';
      }
      return `background-color: ${color};`;
    },
  },
};
</script>

<style lang="css" scoped>
  .square-container {
    display: grid;
    border: 1px solid #aaa;
    flex-grow: 1;
  }
  .square-container:hover {
    border: 1px solid red;
  }
</style>
