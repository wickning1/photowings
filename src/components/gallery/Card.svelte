<script>
  import CardDetails from './CardDetails'
  import Loading from '../Loading'
  import { onMount } from 'svelte'
  import { image as modalimage } from '../../stores/gallery'
  import helpers from '../../lib/helpers'
  export let image
  export let topelement = null
  export let DetailsComponent = CardDetails
  export let ActionsComponent = undefined

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
  const activate = e => {
    if (helpers.detectClickOrEnter(e)) modalimage.update(img => image)
  }

  let src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
  let loading = false
  onMount(() => {
    src = `api/image/inline/${image.id}`
    loading = true
  })
</script>

<style>
  figure {
    position: relative;
    width: 100%;
    margin: 0 0 10px 0;
  }
  figcaption {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 1rem;
  }
  img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  :focus-within {
    outline: 3px solid blue;
  }
</style>

<figure on:mouseover={mouseover} on:mouseout={mouseout} style="padding-top: {100 * image.height / image.width}%;" bind:this={topelement}>
  <img src="{src}"
    alt="{image.notes}" width="{image.width}" height="{image.height}" tabindex="0"
    on:load={() => loading = false} on:click={activate} on:keydown={activate}
  />
  {#if loading}
    <Loading />
  {/if}
  {#if ActionsComponent}
    <ActionsComponent image={image} />
  {/if}
  <figcaption class="primary" on:click={togglehover}>
    <DetailsComponent image={image} hover={hover} />
  </figcaption>
</figure>
