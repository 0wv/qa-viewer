<script>
	import Help from './Help.svelte'
	import Play from './Play.svelte'
	import Router from 'svelte-spa-router'
	import Viewer from './Viewer.svelte'

	const routes = {
		'/': Viewer,
		'/help': Help,
		'/play': Play,
	}
</script>

<main>
	<Router {routes} />
</main>

<style>
	/* pass */
</style>