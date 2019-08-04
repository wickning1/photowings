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
		padding: 20px 85px;
		overflow: hidden;
		text-align: center;
	}
	nav.secondary {
	}

	nav :global(ion-icon.left.nav-icon) {
		left: 12px;
	}
</style>

<nav class="secondary">
	<IconButton name="menu" on:click={openmenu} middle left large className="nav-icon" />
	PhotoWings
</nav>
