<template>
  <div class="col-3">

    <div class="card bg-dark">
      <h1 class="text-danger selectable" @click="deleteGame(game.id)" v-if="game.creatorId == account.id">X</h1>
      <router-link :to="{ name: 'Game', params: { gameId: game.id } }">
        <div class="card-body d-flex justify-content-around align-items-center">
          <h1 class="m-0">{{ game.title }}</h1>
          <h4 class="m-0">{{ game.playerCount }}/{{ game.playerLimit }}</h4>
          <h5>{{ game.status }}</h5>
        </div>
      </router-link>
    </div>

  </div>
</template>


<script>
import { AppState } from '../AppState.js';
import { computed } from '@vue/reactivity';
import { Game } from '../models/Game.js';
import { gamesService } from '../services/GamesService.js';
import Pop from '../utils/Pop.js';

export default {
  props: {
    game: {
      type: Game,
      required: true
    }
  },
  setup(props) {
    return {
      account: computed(() => AppState.account),

      async deleteGame(id) {
        try {
          let choice = await Pop.confirm("Are you sure you want to delete this game? YOU WILL NEVER GET IT BACK!!!")
          if (!choice) {
            return;
          }
          await gamesService.deleteGame(id)
          Pop.success("Your Game has been deleted FOREVER!!!")
        } catch (error) {
          Pop.error(error, "[Deleting Game]")
        }
      },

      async setActiveGame(gameId) {
        try {
          await gamesService.getGameById(gameId)
          console.log("Hello")
        } catch (error) {
          Pop.error(error, "[Get Game By Id]")
        }
      }

    }
  }
}
</script>


<style lang="scss" scoped>

</style>