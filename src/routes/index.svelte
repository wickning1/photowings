<script context="module">
  import helpers from '../lib/helpers'
	export async function preload({ params, query }) {
		const images = await helpers.fetch(this, 'api/image')
		return { images }
	}
</script>
<script>
	export let images = []
</script>

<style>

</style>

<svelte:head>
	<title>Gallery • PhotoWings</title>
</svelte:head>

<h1>All My Photos</h1>

<div class="gallery">
	{#each images as image}
    <figure>
      <img src="api/image/inline/{image.id}" alt="{image.notes}">
      <figcaption>{image.name}</figcaption>
    </figure>
	{/each}
</div>
