<template>
  <div class="container-fluid">
    <div class="row d-flex big-row">
      <div class="col-4 bg-hred d-flex justify-content-center align-items-center selectable"
        :class="faction == 'human' ? 'selected' : ''" @click="selectFaction('human')">
        <h1 class="text-shadow" :class="faction == 'human' ? 'text-hsilver text-selected' : 'text-hyellow'">Human</h1>
      </div>
      <div class="col-4 bg-ugray d-flex justify-content-center align-items-center selectable"
        :class="faction == 'undead' ? 'selected' : ''" @click="selectFaction('undead')">
        <h1 class="text-shadow" :class="faction == 'undead' ? 'text-hsilver text-selected' : 'text-hyellow'">Undead</h1>
      </div>
      <div class="col-4 bg-rblue d-flex justify-content-center align-items-center selectable"
        :class="faction == 'robot' ? 'selected' : ''" @click="selectFaction('robot')">
        <h1 class="text-shadow" :class="faction == 'robot' ? 'text-hsilver text-selected' : 'text-hyellow'">Robot</h1>
      </div>
    </div>

    <UnrankedForm></UnrankedForm>


  </div>
</template>


<script>
import { computed } from '@vue/reactivity';
import { AppState } from '../AppState.js';
import UnrankedForm from '../components/UnrankedForm.vue';
export default {
  setup() {
    return {
      faction: computed(() => AppState.faction),
      async selectFaction(faction) {
        AppState.faction = faction;
      }
    };
  },
  components: { UnrankedForm }
}
</script>


<style lang="scss" scoped>
.text-shadow {
  text-shadow: 2px 2px 2px #090C08;
}

.text-shadow-white {
  text-shadow: 2px 2px 2px #CBCBCB;
}

.big-row {
  position: absolute;
  height: 30%;
  width: 100%;
  // z-index: -1;
}

.selected {
  border: 2px solid black;
}

.text-selected {
  font-size: 3rem;
  // text-decoration: underline black;
}
</style>