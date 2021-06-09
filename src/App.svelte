<script>
  import Help from './components/Help.svelte'
  import Play from './components/Play.svelte'
  import Router from 'svelte-spa-router'
  import Viewer from './components/Viewer.svelte'

  const routes = {
    '/': Viewer,
    '/help': Help,
    '/play': Play
  }
</script>

<main>
  <Router {routes} />
</main>

<style>
  /* pass */
</style>
