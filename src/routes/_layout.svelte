<script>
	import Nav from '../components/Nav.svelte'
	import LayoutModals from '../components/LayoutModals'
	import NoScriptSwitcher from '../components/noscript/Switcher'
	import ContextMenu from '../components/contextmenu/ContextMenu'
	let headerheight = 53
</script>

<style>
	.app-header {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 50;
		width: 100%;
		display: flex;
		align-items: center;
		padding: 0px 10px;
	}
	:global(.app-header > *) {
		width: 33%;
	}
	@media (max-width: 400px) {
		:global(.app-header > .app-name) {
			width: 60%;
		}
		:global(.app-header > nav, .app-header > .icon-menu) {
			width: 20%;
		}
	}
	.app-name {
		text-align: center;
	}
</style>

<NoScriptSwitcher>
	<LayoutModals let:modalactive={modalactive}>
		<header class="secondary app-header" aria-hidden={modalactive} bind:clientHeight={headerheight}>
			<Nav />
			<div class="app-name">PhotoWings</div>
			<ContextMenu />
		</header>
		<main aria-hidden={modalactive} style="margin-top: {headerheight}px;">
			<slot></slot>
		</main>
	</LayoutModals>
</NoScriptSwitcher>
