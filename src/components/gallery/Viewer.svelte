<script>
  export let image
  import IconButton from '../IconButton'
  import HoverControls from '../HoverControls'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  const dismiss = () => {
    dispatch('dismiss')
  }

  let w
  let h
  $: wide = w / h < image.width / image.height
</script>

<style>
  img {
    display: block;
    max-width: none;
  }
</style>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} />
<HoverControls>
  <IconButton name="create" relative white label="edit photo metadata" on:click={dismiss} />
  <IconButton name="cancel" relative white label="cancel modal photo viewer" on:click={dismiss} />
</HoverControls>
<img src="api/image/inline/{image.id}"
  alt={image.notes || ''}
  style="width: {wide ? '100vw' : 'auto'}; height: {wide ? 'auto' : '100vh'};"
/>
