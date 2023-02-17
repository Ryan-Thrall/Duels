<template>
  <div class="row p-2">
    <GameCard v-for="g in myGames" :key="g.id" :game="g" class="my-2" />
  </div>

</template>


<script>
import { AppState } from '../AppState.js';
import GameCard from '../components/GameCard.vue';
import { computed } from '@vue/reactivity';

export default {
  setup() {
    return {
      myGames: computed(() => AppState.myGames)
    };
  },
  components: { GameCard }
}
</script>


<style lang="scss" scoped>

</style>