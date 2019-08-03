<script>
  import CardDetails from './CardDetails'
  import Loading from '../Loading'
  import { onMount } from 'svelte'
  export let image
  export let topelement
  export let DetailsComponent = CardDetails
  let hover = false
  let mouseovertimer
  const mouseover = (e) => {
    clearTimeout(mouseovertimer)
    mouseovertimer = setTimeout(() => { hover = true }, 100)
  }
  const mouseout = (e) => {
    clearTimeout(mouseovertimer)
    mouseovertimer = setTimeout(() => { hover = false }, 100)
  }
  const togglehover = (e) => {
    clearTimeout(mouseovertimer)
    e.preventDefault()
    hover = !hover
  }

  let src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
  let loading = false
  onMount(() => {
    console.log('setting src')
    src = `api/image/inline/${image.id}`
    loading = true
  })
</script>

<style>
  figure {
    position: relative;
    width: 100%;
    margin-bottom: 10px;
  }
  figcaption {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0,0,0,0.8);
    color: white;
    padding: 1rem;
  }
  img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
</style>

<figure on:mouseover={mouseover} on:mouseout={mouseout} style="padding-top: {100 * image.height / image.width}%;" bind:this={topelement}>
  <img src="{src}" alt="{image.notes}" width="{image.width}" height="{image.height}" on:load={() => loading = false} />
  {#if loading}
    <Loading />
  {/if}
  <figcaption on:click={togglehover}>
    <DetailsComponent image={image} hover={hover} />
  </figcaption>
</figure>
