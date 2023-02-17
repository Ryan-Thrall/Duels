<template>
  <div class="container-fluid">
    <div class="row d-flex big-row">
      <div class="col-4 bg-hblue d-flex justify-content-center align-items-center darken-90">
        <div class="d-flex flex-column align-items-center">
          <h1 class="text-hsilver text-shadow">Campaign</h1>
          <p>Coming Soon</p>
        </div>
      </div>

      <router-link class="col-4 bg-hyellow d-flex justify-content-center align-items-center selectable"
        :to="{ name: 'Play', params: { modeId: 'unranked' } }">
        <div>
          <h1 class="text-hdark text-shadow-white">Unranked</h1>
        </div>
      </router-link>

      <div class="col-4 bg-hred d-flex justify-content-center align-items-center darken-90">
        <div class="d-flex flex-column align-items-center">
          <h1 class="text-hsilver text-shadow">Ranked</h1>
          <p>Coming Soon</p>
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
import UnrankedForm from '../components/UnrankedForm.vue';

export default {
  setup() {
    const editable = ref({
      playerLimit: 2,
      mapName: "hex",
      faction: "human"
    });

    return {
      editable,
      games: computed(() => AppState.games),
      myGames: computed(() => AppState.myGames),

    };
  },
  components: { UnrankedForm }
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

.big-row {
  position: absolute;
  height: 100%;
  width: 100%;
  // z-index: -1;
}

.text-shadow {
  text-shadow: 2px 2px 2px #090C08;
}

.text-shadow-white {
  text-shadow: 2px 2px 2px #CBCBCB;
}
</style>
