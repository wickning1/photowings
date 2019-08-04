<script>
  export let lastpage = 1
  export let query = {}
  import helpers from '../lib/helpers'
	let pagearray = [...Array(lastpage).keys()]
</script>

<style>
	.pages {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
	a, span {
		display: block;
		padding: 5px;
		border-radius: 5px;
		text-decoration: none;
		margin-right: 8px;
		width: 46px;
		line-height: 34px;
		text-align: center;
	}
	span {
		background-color: #495a76;
		color: white;
		font-weight: bold;
	}
	.pages :last-child {
		margin-right: 0px;
	}
</style>

<div class="pages">
	{#if query.p > 1}
		<a href={helpers.qs('', { ...query, p: query.p - 1})}>&lt;</a>
	{/if}
	{#each pagearray as page}
		{#if page === query.p - 1}
			<span>{page + 1}</span>
		{:else}
			<a href={helpers.qs('', { ...query, p: page + 1 })}>{page + 1}</a>
		{/if}
	{/each}
	{#if pagearray.length > query.p}
		<a href={helpers.qs('', { ...query, p: query.p + 1})}>&gt;</a>
	{/if}
</div>
