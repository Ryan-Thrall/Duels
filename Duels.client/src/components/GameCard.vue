<template>
  <div class="col-3">
    <router-link :to="{ name: 'Game', params: { gameId: game.id } }">
      <div class="card bg-dark">
        <div class="card-body d-flex justify-content-around align-items-center">
          <h1 class="m-0">{{ game.title }}</h1>
          <h4 class="m-0">{{ game.playerCount }}/{{ game.playerLimit }}</h4>
        </div>

      </div>
    </router-link>
  </div>

</template>


<script>
import { Game } from '../models/Game.js';

export default {
  props: {
    game: {
      type: Game,
      required: true
    }
  },
  setup(props) {
    return {


    }
  }
}
</script>


<style lang="scss" scoped>

</style>