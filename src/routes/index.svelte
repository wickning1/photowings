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
	export let images = {}
	export let albums = []
	export let query = {}
	import FilterPanel from '../components/FilterPanel'
	import Gallery from '../components/gallery/Gallery'
	import SetHeader from '../components/SetHeader'
	import Pagination from '../components/Pagination'
	import PageHeader from '../components/PageHeader'
</script>

<svelte:head>
	<title>Gallery • PhotoWings</title>
</svelte:head>

<PageHeader>
	All My Photos
	<div slot="extra">
		<FilterPanel query={query} preserve={['pp', 'sort']} reset={{ p: 1 }} filters={{
			album: {
				values: albums.map(a => ({ val: a.id, label: a.filepath }))
			}
		}}/>
	</div>
</PageHeader>

<SetHeader level=2>
	<Gallery images={images.data} />
</SetHeader>
<Pagination query={query} lastpage={images.info.finalpage} />
