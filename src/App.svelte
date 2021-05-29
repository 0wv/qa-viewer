<script>
	import Play from './Play.svelte'
	import Router from 'svelte-spa-router'
	import Viewer from './Viewer.svelte'

	const routes = {
		'/': Viewer,
		'/play': Play,
	}
</script>

<main>
	<Router {routes} />
</main>

<style>
	/* pass */
</style>