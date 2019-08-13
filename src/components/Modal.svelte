<script>
  import FocusLock from './FocusLock'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  const endmodal = () => {
    dispatch('dismiss')
  }
</script>

<style>
  div {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--modal-bg);
    overflow: auto;
  }
</style>

<div on:click={function (e) { if (e.target === this) endmodal() }}>
  <FocusLock on:escape={endmodal}>
    <slot></slot>
  </FocusLock>
</div>
