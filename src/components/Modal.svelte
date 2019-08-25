<script>
  export let lockbackdrop = false
  import FocusLock from './FocusLock'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  function backdropclick (e) {
    if (e.target === this && !lockbackdrop) endmodal()
  }
  const endmodal = () => {
    dispatch('dismiss')
  }
</script>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--modal-bg);
    overflow: auto;
    z-index: 100;
  }
  .modal-container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>

<div class="modal-backdrop" on:click={backdropclick}>
  <div class="modal-container" role="dialog">
    <FocusLock on:escape={endmodal}>
      <slot></slot>
    </FocusLock>
  </div>
</div>
