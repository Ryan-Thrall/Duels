<template>
  <div class="row bottomify">
    <h1>{{ faction }}</h1>
    <div
      class="col-1 me-4 d-flex justify-content-center align-items-center bg-hyellow text-center rounded-top tab first-tab"
      :class="tab == 'join' ? 'selected' : 'fw-bold selectable'" @click="swapTab('join')">
      Join
    </div>
    <div class="col-1 d-flex justify-content-center align-items-center bg-hyellow text-center rounded-top tab"
      :class="tab == 'host' ? 'selected' : 'fw-bold selectable'" @click="swapTab('host')">
      Host
    </div>



    <!-- Content Card -->
    <div class="col-11 card bg-hyellow content-card mb-5 ">
      <div class="card-body">
        <form class="form" @submit.prevent="createGame(faction)" v-if="tab == 'host'">

          <div class="mb-3 d-flex flex-column align-items-center">

            <label for="floatingPlayers" class="me-2 fw-bolder fs-3">{{ editable.playerLimit }} Players</label>
            <input v-model="editable.playerLimit" type="range" class="slider" id="floatingPlayers"
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
          </div>

          <div class="mt-2">
            <button v-if="faction" type="submit" class="btn btn-primary">Host a Game</button>
          </div>

        </form>

        <div v-if="tab == 'join'">
          <!-- <h1>{{ games }}</h1> -->
          <GameLobbyItem v-for="g in games" :key="g.id" :game="g" />
        </div>

      </div>
    </div>
  </div>
</template>


<script>
import { ref } from 'vue';
import { computed } from '@vue/reactivity';
import { AppState } from '../AppState.js';
import { onMounted } from 'vue';
import GameLobbyItem from '../components/GameLobbyItem.vue'
import { gamesService } from '../services/GamesService.js';
import Pop from '../utils/Pop.js';
export default {
  setup() {
    const editable = ref({
      playerLimit: 2,
      mapName: "hex",
      faction: "human"
    });

    AppState.tab = 'host'

    async function GetGames() {
      try {
        await gamesService.getGames();
      }
      catch (error) {
        Pop.error(error, "[Getting Games]");
      }
    }
    onMounted(() => {
      GetGames();
    });

    return {
      editable,
      games: computed(() => AppState.games),
      myGames: computed(() => AppState.myGames),
      faction: computed(() => AppState.faction),
      tab: computed(() => AppState.tab),

      async createGame(faction) {
        console.log(faction)
        try {
          editable.faction = faction;

          console.log(editable)
          await gamesService.createGame(editable.value);
          Pop.success("Your game has been created")
        }
        catch (error) {
          Pop.error(error, "[Creating a Game]");
        }
      },

      async swapTab(tab) {
        AppState.tab = tab;
      }
    }
  },
  components: { GameLobbyItem }
}
</script>


<style lang="scss" scoped>
.bottomify {
  position: absolute;
  // min-height: 60%;
  width: 90%;
  left: 50%;
  transform: translate(-50%, 0%);
  bottom: 1rem;
}

.selected {
  font-size: 1.2em;
  font-weight: bolder;
  border: 2px solid black;
  border-bottom: 0px;
  transform: scale(1.2)
}

.tab {
  max-height: 2rem;
}

.first-tab {
  margin-left: 8rem;
}

.content-card {
  height: 25rem;
  left: 50%;
  transform: translate(-50%, 0%);
}

.slider {
  // -webkit-appearance: none;
  width: 100%;
  height: 1rem;
}
</style>