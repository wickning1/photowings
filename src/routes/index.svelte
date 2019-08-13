<script context="module">
	import { fetch } from '../lib/helpers'
	export async function preload({ params, query }, session) {
		const [ images, albums ] = await Promise.all([
			fetch(this, 'api/image', query),
			fetch(this, 'api/album')
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
	import Card from '../components/editablegallery/Card'
	import BulkActions from '../components/editablegallery/BulkActions'
	import SetHeader from '../components/SetHeader'
	import Pagination from '../components/Pagination'
	import PageHeader from '../components/PageHeader'
	// later I want to bind form inputs to the query, but messing with the query
	// object directly will make sapper crash
	let querycopy = JSON.parse(JSON.stringify(query))
</script>

<svelte:head>
	<title>Gallery • PhotoWings</title>
</svelte:head>

<PageHeader>
	All My Photos
	<div slot="extra">
		<FilterPanel query={querycopy} preserve={['pp', 'sort']} reset={{ p: 1 }} filters={{
			album: {
				values: albums.map(a => ({ val: a.id, label: a.filepath }))
			}
		}}/>
	</div>
</PageHeader>
<BulkActions />

<SetHeader level=2>
	<Gallery images={images.data} CardComponent={Card} />
</SetHeader>
<Pagination query={query} lastpage={images.info.finalpage} />
