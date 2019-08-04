<script>
  export let shown = false
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  const endmodal = () => {
    dispatch('dismiss')
  }

  const handlekeydown = e => {
    if (e.keyCode === 27) { // escape
      endmodal()
    }
  }
</script>

<style>
  div {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.95);
    overflow: auto;
  }
</style>

<svelte:window on:keydown={handlekeydown} />
<slot hidden={shown} />
{#if shown}
  <div on:click={endmodal}>
    <slot name="content"></slot>
  </div>
{/if}
