<script>
  import { image } from '../../stores/gallery'
  import Modal from '../Modal'
  import CloseButton from '../CloseButton'

  const endmodal = () => {
    image.update(img => ({}))
  }

  let w
  let h
  $: wide = w / h < $image.width / $image.height
</script>

<style>
  div {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  img {
    display: block;
    max-width: none;
  }
</style>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} />
<Modal shown={$image.id && true} on:dismiss={endmodal}>
  <slot hidden={$image.id && true} />
  <div slot="content" style="width: {wide ? '100%' : 'auto'}; height: {wide ? 'auto' : '100%'};">
    <CloseButton label="close photo modal" invert />
    <img src="api/image/inline/{$image.id}"
      alt={$image.notes}
      on:click={e => e.stopPropagation()}
      style="width: {wide ? '100%' : 'auto'}; height: {wide ? 'auto' : '100%'};"
    />
  </div>
</Modal>
