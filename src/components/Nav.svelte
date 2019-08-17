<script>
	import IconButton from './IconButton'
	export let shown = false
	const openmenu = e => {
		shown = true
	}
</script>

<style>
	nav {
		position: relative;
	}
</style>

<nav>
	<IconButton name="menu" on:click={openmenu} relative large className="nav-icon" />
</nav>
