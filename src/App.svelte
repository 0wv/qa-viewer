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

<svelte:head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap');

    body { font-family: 'Noto Sans JP', sans-serif; }
  </style>
</svelte:head>

<main class="m-4">
  <Router {routes} />
</main>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

  :global(body) {
    @apply h-auto p-0 w-auto;
  }
</style>
