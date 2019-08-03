<script>
	import Nav from '../components/Nav.svelte'
	import GalleryModal from '../components/gallery/Modal'
</script>

<style>
</style>

<Nav/>

<GalleryModal let:hidden={hidden}>
	<main aria-hidden={hidden}>
		<slot></slot>
	</main>
</GalleryModal>
