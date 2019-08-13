<script>
	import Nav from '../components/Nav.svelte'
	import LayoutModals from '../components/LayoutModals'
</script>

<style>
</style>


<LayoutModals let:modalactive={modalactive}>
	<Nav ariahidden={modalactive} />
	<main aria-hidden={modalactive}>
		<slot></slot>
	</main>
</LayoutModals>
