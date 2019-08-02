<script context="module">
  import helpers from '../lib/helpers'
	export async function preload({ params, query }) {
		const images = await helpers.fetch(this, 'api/image', query)
		return { images }
	}
</script>
<script>
	export let images = []
	import Gallery from '../components/Gallery'
	import SetHeader from '../components/SetHeader'
</script>

<style>

</style>

<svelte:head>
	<title>Gallery • PhotoWings</title>
</svelte:head>

<h1>All My Photos</h1>

<SetHeader level=2>
	<Gallery images={images} />
</SetHeader>
