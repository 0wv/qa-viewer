<script>
	import Router from 'svelte-spa-router'
	import Viewer from './Viewer.svelte'

	const routes = {
		'/': Viewer,
	}
</script>

<main>
	<Router {routes} />
</main>

<style>
	/* pass */
</style>