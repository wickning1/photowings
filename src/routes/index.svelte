<script context="module">
	import helpers from '../lib/helpers'
	export async function preload({ params, query }, session) {
		const [ images, albums ] = await Promise.all([
			helpers.fetch(this, 'api/image', query),
			helpers.fetch(this, 'api/album')
		])
		return { images, albums, query }
	}
</script>
<script>
	export let images = []
	export let albums = []
	export let query = {}
	import Gallery from '../components/gallery/Gallery'
	import SetHeader from '../components/SetHeader'
	let form
</script>

<style>

</style>

<svelte:head>
	<title>Gallery • PhotoWings</title>
</svelte:head>

<h1>All My Photos</h1>

<form action="" method="GET" bind:this={form}>
	{#if query.sort}<input type="hidden" name="sort" value={query.sort} />{/if}
	{#if query.p}<input type="hidden" name="p" value={query.p} />{/if}
	{#if query.pp}<input type="hidden" name="pp" value={query.pp} />{/if}
	<label for="folderdropdown" class="sr-only">Select Album:</label>
	<select id="folderdropdown" name="album" on:change={() => form.submit()}>
		<option value="">Select Album</option>
		{#each albums as album}
				<option value={album.id} selected={album.id === query.album}>{album.filepath}</option>
		{/each}
	</select>
</form>
<SetHeader level=2>
	<Gallery images={images} />
</SetHeader>
