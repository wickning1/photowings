<script>
  import { image } from '../../stores/gallery.js'

  const endmodal = () => {
    image.update(img => ({}))
  }

  const handlekeydown = e => {
    if (e.keyCode === 27) { // escape
      endmodal()
    }
  }

  let w
  let h
  $: wide = w / h < $image.width / $image.height
</script>

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.95);
  }
  img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>

<svelte:window on:keydown={handlekeydown} bind:innerWidth={w} bind:innerHeight={h} />
<slot hidden={$image.id && true} />
{#if $image.id}
  <div on:click={endmodal}>
    <img src="api/image/inline/{$image.id}"
      alt={image.notes}
      on:click={e => e.stopPropagation()}
      style="width: {wide ? '100%' : 'auto'}; height: {wide ? 'auto' : '100%'};"
    />
  </div>
{/if}
