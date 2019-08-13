<script>
	import Nav from '../components/Nav.svelte'
	import LayoutModals from '../components/LayoutModals'
	import NoScriptSwitcher from '../components/noscript/Switcher'
</script>

<style>
</style>

<NoScriptSwitcher>
	<LayoutModals let:modalactive={modalactive}>
		<Nav ariahidden={modalactive} />
		<main aria-hidden={modalactive}>
			<slot></slot>
		</main>
	</LayoutModals>
</NoScriptSwitcher>
