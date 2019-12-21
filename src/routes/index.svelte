<script context="module">
	import { fetch } from '../lib/helpers'
	export async function preload({ params, query }, session) {
		const [ images, albums, tags ] = await Promise.all([
			fetch(this, 'api/image', query),
			fetch(this, 'api/album'),
			fetch(this, 'api/tag')
		])
		return { images, albums, tags, query }
	}
</script>
<script>
	export let images = {}
	export let albums = []
	export let tags = []
	export let query = {}
	import FilterPanel from '../components/FilterPanel'
	import Gallery from '../components/gallery/Gallery'
	import Card from '../components/editablegallery/Card'
	import SetHeader from '../components/SetHeader'
	import Pagination from '../components/Pagination'
	import PageHeader from '../components/PageHeader'
	import { images as storeimages } from '../stores/gallery'
	// later I want to bind form inputs to the query, but messing with the query
	// object directly will make sapper crash
	$: querycopy = JSON.parse(JSON.stringify(query))
	$: storeimages.set(images.data)
	$: taglist = tags.map(t => ({ val: t.id, label: t.name }))
</script>

<svelte:head>
	<title>Gallery • PhotoWings</title>
</svelte:head>

<PageHeader>
	All My Photos
	<div slot="extra">
		<FilterPanel query={querycopy} preserve={['pp', 'sort']} reset={{ p: 1 }} filters={{
			album: {
				values: albums.map(a => ({ val: a.id, label: a.name }))
			},
			tagsmay: {
				label: 'Any of these tags',
				values: [{ val: -1, label: 'No Tags' }, ...taglist]
			},
			tagsmust: {
				label: 'All of these tags',
				values: taglist
			},
			tagsnone: {
				label: 'None of these tags',
				values: taglist
			}
		}}/>
	</div>
</PageHeader>

<SetHeader below={1}>
	<Gallery images={images.data} CardComponent={Card} />
</SetHeader>
<Pagination query={querycopy} lastpage={images.info.finalpage} />
