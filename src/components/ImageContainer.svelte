<script>
  export let width = 16
  export let height = 9
  export let relative = false
  export let className = ''
  let w
  let h
  $: tall = width / height < w / h && !relative
</script>

<style>
  .image-container {
		display: flex;
		align-items: center;
		justify-content: center;
    overflow: hidden;
    max-width: 100%;
		max-height: 100%;
  }
  .image-container :global(img) {
    width: 100%;
    height: auto;
  }
  .image-container.tall :global(img) {
    width: auto;
    height: 100%;
  }
</style>

<div class="image-container {className}" bind:clientWidth={w} bind:clientHeight={h} class:tall>
  <slot></slot>
</div>
