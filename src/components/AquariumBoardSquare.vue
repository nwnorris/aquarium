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
      const borders = [];
      const borderColor = 'black';
      //  A direction is connected if it exists in the connection map,
      //  unconnected edges get a border (edge of the block)
      const unconnectedDirs = ['top', 'bottom', 'left', 'right'];
      const connectedDirs = Object.keys(this.square.connections());
      if (this.square.isAnyBlockMember()) {
        unconnectedDirs.forEach((dir) => {
          if (connectedDirs.indexOf(dir) === -1) {
            borders.push(`border-${dir}: 2px solid ${borderColor}`);
          }
        });
      }
      const bg = `background-color: ${color};`;
      const output = [bg].concat(borders).join(';');
      return output;
    },
  },
};
</script>

<style lang="css" scoped>
  .square-container {
    display: grid;
    border: 1px solid #ddd;
    flex-grow: 1;
    transition: border 0.2s;
  }
  .square-container:hover {
    border: 1px solid #349878;
  }
</style>
