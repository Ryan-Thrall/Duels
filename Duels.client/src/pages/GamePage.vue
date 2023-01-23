<template>
  <h1>{{ game.id }}</h1>
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

</style>