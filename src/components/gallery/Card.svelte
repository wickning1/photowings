<script>
  import CardDetails from './CardDetails'
  import HoverControls from '../HoverControls'
  import HasJS from '../noscript/HasJS'
  import Loading from '../Loading'
  import { detailView } from '../../stores/gallery'
  import hoverclick from '../../actions/hoverclick'
  import intersect from '../../actions/intersect'
  export let image
  export let showactions = false
  export let unloadimages = false
  export let topelement = null
  export let DetailsComponent = CardDetails
  export let ActionsComponent = undefined

  let hover = false
  const mouseover = (e) => {
    hover = true
  }
  const mouseout = (e) => {
    hover = false
  }
  const activate = e => {
    if (showactions) topelement.querySelector('.select-button').click()
    else detailView(image)
  }
  const touchin = e => {
    if (showactions) topelement.querySelector('.select-button').click()
  }

  // lazy loading
  let fakesrc = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
  let src = `api/image/inline/${image.id}`
  let onscreen = false
  let loading = false
  let timer
  function intersectin (e) {
    cancelAnimationFrame(timer)
    timer = requestAnimationFrame(() => {
      loading = !onscreen
      onscreen = true
    })
  }
  function intersectout (e) {
    cancelAnimationFrame(timer)
    timer = requestAnimationFrame(() => {
      if (unloadimages) onscreen = false
    })
  }

  $: alt = image.alt || 'photo, no description available'
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
  figure:focus {
    outline: 3px solid blue;
  }
</style>

<figure use:hoverclick on:in={mouseover} on:out={mouseout} on:activate={activate} on:touchin={touchin}
  use:intersect on:intersectin={intersectin} on:intersectout={intersectout}
  aria-label={alt} style="padding-top: {100 * image.height / image.width}%;" bind:this={topelement}>
  <HasJS>
    <img src={onscreen ? src : fakesrc}
      alt={alt} width={image.width} height={image.height}
      on:load={() => loading = false} />
    <img slot="noscript" src={src} alt={alt} width={image.width} height={image.height} tabindex=0 />
  </HasJS>
  {#if loading}
    <Loading />
  {/if}
  {#if ActionsComponent}
    <HoverControls idlehidden={false} showcontrols={hover || showactions}>
      <ActionsComponent image={image} hover={hover} />
    </HoverControls>
  {/if}
  <figcaption class="primary">
    <DetailsComponent image={image} hover={hover} />
  </figcaption>
</figure>
