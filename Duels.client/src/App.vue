<template>
  <header>
    <Navbar />
  </header>
  <main class="position-relative">
    <router-view />
  </main>
  <footer class="bg-hdark text-light">
    Made with 💖 by CodeWorks
  </footer>

  <JoinGameModal id="joinGameModal"></JoinGameModal>
</template>

<script>
import { computed } from 'vue'
import { AppState } from './AppState'
import Navbar from './components/Navbar.vue'

export default {
  setup() {
    return {
      appState: computed(() => AppState)
    }
  },
  components: { Navbar }
}
</script>
<style lang="scss">
@import "./assets/scss/main.scss";

:root {
  --main-height: calc(100vh - 32px - 64px);
}


footer {
  display: grid;
  place-content: center;
  height: 32px;
}

body {
  // background-color: #F7F5FB;
}
</style>
