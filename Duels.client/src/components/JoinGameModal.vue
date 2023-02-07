<template>
  <div class="modal modal-xl fade" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Join {{ game.title }}</h5>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">

          <form class="form" @submit.prevent="joinGame(game.id)">

            <div>
              <input type="radio" id="human" name="faction" value="Human" checked>
                <label for="human">Humans</label><br>
                <input type="radio" id="undead" name="faction" value="Undead">
                <label for="undead">Undead</label><br>
                <input type="radio" id="robot" name="faction" value="Robot">
                <label for="robot">Robot</label>
            </div>

            <div class="mt-2">
              <button type="submit" class="btn btn-primary">Join</button>
            </div>

          </form>





        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { computed } from '@vue/reactivity';
import Pop from '../utils/Pop.js';
import { playersService } from '../services/PlayersService.js';
import { AppState } from '../AppState.js';
export default {
  setup() {
    return {
      game: computed(() => AppState.activeGame),

      async joinGame(gameId) {
        try {
          let faction;
          let factionSelect = document.getElementsByName('faction');

          factionSelect.forEach(f => {
            if (f.checked) {
              faction = f.value;
            }
          })

          let data = { faction: faction }

          await playersService.joinGame(data, gameId);
        } catch (error) {
          Pop.error(error, "[Joining Game]")
        }
      }
    }
  }
}
</script>


<style lang="scss" scoped>

</style>