<script context="module">
	import { fetch } from '../../../lib/helpers'
	export async function preload({ params, query }, session) {
		const [ image, albums, tags ] = await Promise.all([
			fetch(this, `api/image/${params.id}`),
			fetch(this, 'api/album'),
			fetch(this, 'api/tag')
		])
		return { image, albums, tags, query }
	}
</script>
<script>
	export let image = {}
	export let albums = []
	export let tags = []
	export let query = {}
	import Header from '../../../components/Header'
	import ImageContainer from '../../../components/ImageContainer'
	import Form from '../../../components/smartforms/core/Form'
	import SingleLine from '../../../components/smartforms/inputs/public/SingleLine'
	import TagSelect from '../../../components/localinputs/TagSelect'
	import * as api from '../../../lib/api'
	import { onMount } from 'svelte'

	async function validate (formdata) {
		console.log('validate')
		return api.post(`image/${image.id}/validate`, null, formdata)
  }
  async function submit (formdata) {
    return api.put(`image/${image.id}`, null, formdata)
	}
</script>

<style>
	.panel-container {
		display: flex;
		flex-wrap: wrap;
		align-items: stretch;
		height: 100%;
	}
	.panel-container :global(.panel-image), .panel-editor {
		width: 50%;
		height: 100%;
	}
	.panel-container :global(.panel-image) {
		background-color: var(--modal-bg);
	}
	.panel-editor {
		overflow: auto;
		padding: 20px;
		background-color: var(--accent-bg);
		color: var(--accent-text);
	}
	@media (max-width: 600px) {
		.panel-container {
			height: auto;
		}
		.panel-container :global(.panel-image), .panel-editor {
			width: 100%;
			max-height: none;
		}
		.panel-container :global(.panel-image) {
			height: 300px;
		}
		.panel-editor {
			overflow: hidden;
		}
	}
</style>

<svelte:head>
	<title>Edit Photo • PhotoWings</title>
</svelte:head>

<div class="panel-container">
	<ImageContainer width={image.width} height={image.height} className='panel-image'>
		<img src="api/image/inline/{image.id}" width={image.width} height={image.height}
			alt={image.notes || ''}/>
	</ImageContainer>
	<div class="panel-editor">
		<Header level=1>Edit Photo</Header>
		<Form preload={image} validate={validate} submit={submit} className='image-editor pure-form pure-form-stacked'>
			<SingleLine name="title"/>
			<TagSelect name="tags" allowadd>
				{#each tags as tag}
					<option value={tag.id}>{tag.name}</option>
				{/each}
			</TagSelect>
			<div class="buttons">
				<input type="submit" value="Save">
			</div>
		</Form>
	</div>
</div>
