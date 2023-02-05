<template>
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

export default {
  setup() {

    const route = useRoute();
    const router = useRouter();

    async function getGameById() {
      try {
        AppState.activeGame = {}
        let game = await gamesService.getGameById(route.params.gameId);
        // Initialize the Engine
        var myGame = new MyGame(AppState.activeGame?.map);
        gEngine.Core.initializeEngineCore('gameCanvas', myGame);
      } catch (error) {
        router.push({ name: 'Home' })
        Pop.toast('This game is Private!!!', 'info')
        AppState.activeGame = null;

      }
    }

    onMounted(() => {
      getGameById();
    })

    return {
      game: computed(() => AppState.activeGame),
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