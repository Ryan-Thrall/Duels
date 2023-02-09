<template>
  <div class="d-flex justify-content-end me-4 my-2">
    <button class="btn btn-success" @click="startGame(game.id)">Start Game</button>
  </div>
  <div>
    <canvas id="gameCanvas" width="640" height="480"></canvas>
  </div>
</template>


<script>
import { onMounted } from 'vue';
import { AppState } from '../AppState.js';
import { computed } from '@vue/reactivity';
import { useRoute, useRouter } from 'vue-router';
import { gamesService } from '../services/GamesService.js';
import Pop from '../utils/Pop.js';
import { playersService } from '../services/PlayersService.js';

export default {
  setup() {

    const route = useRoute();
    const router = useRouter();

    async function getGameById() {
      try {
        AppState.activeGame = {}
        await gamesService.getGameById(route.params.gameId);
        await playersService.getPlayers(route.params.gameId);
        // Initialize the Engine
        var myGame = new MyGame(AppState.activeGame?.map);
        gEngine.Core.initializeEngineCore('gameCanvas', myGame);
      } catch (error) {
        Pop.error(error, '[Getting Game By Id]')
        AppState.activeGame = null;

      }
    }

    onMounted(() => {
      getGameById();
    })

    return {
      game: computed(() => AppState.activeGame),

      async startGame(gameId) {
        try {
          gamesService.startGame(gameId);
        } catch (error) {
          Pop.error(error, "[Starting Game]")
        }
      }
    }
  }
}
</script>


<style lang="scss" scoped>
#gameCanvas {
  background-color: black;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
}
</style>