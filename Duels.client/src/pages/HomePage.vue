<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <h1>Lobby</h1>
      </div>
      <GameCard v-for="g in games" :key="g.id" :game="g" class="p-2" />
    </div>

    <div class="row">
      <div class="col-12">
        <h1>My Games</h1>
      </div>
      <GameCard v-for="g in myGames" :key="g.id" :game="g" class="p-2" />
    </div>

    <div class="row d-flex justify-content-center">
      <div class="col-11 card mb-4">
        <div class="card-body">
          <div class="d-flex justify-content-center">
            <h1>Host a Game</h1>
          </div>


          <form class="form" @submit.prevent="createGame">
            <div class="form-floating mb-3">
              <input v-model="editable.title" type="text" class="form-control" id="floatingInput" placeholder="Title">
              <label for="floatingInput">Lobby Name</label>
            </div>

            <div class="mb-3 d-flex align-items-center">
              <label for="floatingPlayers" class="me-2">{{ editable.playerLimit }} Players</label>
              <input v-model="editable.playerLimit" type="range" class="" id="floatingPlayers"
                placeholder="# of Players" max="6" min="2">

            </div>

            <div class="mb-3">
              <input v-model="editable.isPrivate" type="checkbox" class="m-2" id="Private">
              <label for="Private">Private Game?</label>
            </div>

            <div class="form-floating mb-3" v-if="editable.isPrivate">
              <input v-model="editable.password" type="password" class="form-control" id="floatingPassword"
                placeholder="Password" maxlength="10">
              <label for="floatingPassword">Password</label>
            </div>

            <div>
              <select v-model="editable.mapName" name="map" id="Map" required>
                <option value="hex" selected>Hex</option>
              </select>

              <select v-model="editable.faction" name="map" id="Map" required>
                <option value="human" selected>Humans</option>
                <option value="undead">Undead</option>
                <option value="robot">Robots</option>
              </select>
            </div>

            <div class="mt-2">
              <button type="submit" class="btn btn-primary">Host a Game</button>
            </div>

          </form>

        </div>
      </div>
    </div>


  </div>

</template>

<script>
import { ref } from 'vue';
import { computed } from '@vue/reactivity';
import { onMounted } from 'vue';
import { AppState } from '../AppState.js';
import { gamesService } from '../services/GamesService.js';
import Pop from '../utils/Pop.js';

export default {
  setup() {
    const editable = ref({
      playerLimit: 2,
      mapName: "hex",
      faction: "human"
    })

    async function GetGames() {
      try {
        await gamesService.getGames();
      } catch (error) {
        Pop.error(error, "[Getting Games]")
      }
    }

    onMounted(() => {
      GetGames();
    })

    return {
      editable,

      games: computed(() => AppState.games),
      myGames: computed(() => AppState.myGames),

      async createGame() {
        try {
          await gamesService.createGame(editable.value)
        } catch (error) {
          Pop.error(error, "[Creating a Game]")
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  display: grid;
  height: 80vh;
  place-content: center;
  text-align: center;
  user-select: none;

  .home-card {
    width: 50vw;

    >img {
      height: 200px;
      max-width: 200px;
      width: 100%;
      object-fit: contain;
      object-position: center;
    }
  }
}
</style>
