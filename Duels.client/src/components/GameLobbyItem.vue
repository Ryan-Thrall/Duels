<template>
  <div class="bordered d-flex justify-content-between">
    <h4>{{ game.creator.name }}'s Game</h4>
    <button class="btn btn-success" @click="joinGame(faction, game.id)">Join</button>
  </div>

</template>


<script>
import { computed } from '@vue/reactivity';
import { AppState } from '../AppState.js';
import { Game } from '../models/Game.js';
import { playersService } from '../services/PlayersService.js';
import Pop from '../utils/Pop.js';

export default {
  props: {
    game: {
      type: Game,
      required: true
    },
  },
  setup() {
    return {
      faction: computed(() => AppState.faction),

      async joinGame(faction, gameId) {
        try {
          let data = { faction: faction };
          await playersService.joinGame(data, gameId)
          Pop.success("You have joined this game!!!")
        } catch (error) {
          Pop.error(error, "[Joining Game By Id]")
        }
      }

    }
  }
}
</script>


<style lang="scss" scoped>
.bordered {
  border: 2px solid black;
}
</style>