<template>
  <div id="app">
    <div class="center-container">
      <AquariumBoard v-bind:boardWidth='10' v-bind:boardHeight='10'></AquariumBoard>
    </div>
  </div>
</template>

<script>
import AquariumBoard from './components/AquariumBoard.vue';
import './css/reset.css';

export default {
  name: 'App',
  components: {
    AquariumBoard,
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
  border: 1px solid red;
  margin: auto;
}
</style>
