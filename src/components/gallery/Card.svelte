<script>
  import CardDetails from './CardDetails'
  import HoverControls from '../HoverControls'
  import Loading from '../Loading'
  import { onMount } from 'svelte'
  import { which, data } from '../../stores/modal'
  import safemousein from '../../actions/safemousein'
  import { a11yclick } from '../../actions/a11yevents'
  export let image
  export let showactions = false
  export let topelement = null
  export let DetailsComponent = CardDetails
  export let ActionsComponent = undefined

  let hover = false
  let locked = false
  const mouseover = (e) => {
    hover = true
    locked = true
    setTimeout(() => { locked = false }, 350)
  }
  const mouseout = (e) => {
    hover = false
  }
  const activate = e => {
    if (!locked && hover) {
      which.update(w => 'imageviewer')
      data.update(d => image)
    }
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
    z-index: 0;
    touch-action: manipulation;
  }
  figcaption {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 1rem;
    opacity: 0.85;
  }
  img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  img:focus {
    outline: 3px solid blue;
  }
</style>

<figure use:safemousein on:in={mouseover} on:out={mouseout}
  use:a11yclick on:click={activate} style="padding-top: {100 * image.height / image.width}%;" bind:this={topelement}>
  <img src="{src}"
    alt="{image.notes || ''}" width="{image.width}" height="{image.height}" tabindex="0"
    on:load={() => loading = false} />
  {#if loading}
    <Loading />
  {/if}
  {#if ActionsComponent}
    <HoverControls control="manual" showcontrols={hover || showactions}>
      <ActionsComponent image={image} hover={hover} />
    </HoverControls>
  {/if}
  <figcaption class="primary" on:click|stopPropagation>
    <DetailsComponent image={image} hover={hover} />
  </figcaption>
</figure>
