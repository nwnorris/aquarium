<template>
  <div id="app">
    <div class="center-container">
      <AquariumBoard :boardWidth='w' :boardHeight='h'></AquariumBoard>
    </div>
  </div>
</template>

<script>
import AquariumBoard from './components/AquariumBoard.vue';
import './css/reset.css';

//  const puzzle = new AquariumPuzzle('aq-0001.json');
//  console.log(puzzle.blocks);
export default {
  name: 'App',
  components: {
    AquariumBoard,
  },
  data() {
    return {
      w: 5,
      h: 5,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.center-container {
  width: 50vw;
  height: 100vh;
  border: 1px solid blue;
  margin: auto;
  padding: 25px;
}
</style>
