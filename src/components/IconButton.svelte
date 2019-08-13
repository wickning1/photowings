<script>
  export let name
  export let id = ''
  export let label = undefined
  export let border = false
  export let large = false
  export let top = true
  export let middle = false
  export let bottom = false
  export let right = true
  export let center = false
  export let left = false
  export let white = false
  export let relative = false
  export let className = ''
  export let topelement = undefined
</script>

<style>
  button {
    position: absolute;
    display: inline-block;
    padding: 6px;
    border: none;
    font: inherit;
    color: inherit;
    background-color: transparent;
    font-size: 26px;
    cursor: pointer;
  }
  ion-icon {
    display: block;
    padding-bottom: 1px;
    visibility: visible;
  }
  .relative {
    position: relative;
  }
  .top { top: 0; }
  .bottom { bottom: 0; }
  .left { left: 0; }
  .right { right: 0; }
  .center {
    left: 50%;
    transform: translateX(-50%);
  }
  .middle{
    top: 50%;
    transform: translateY(-50%);
  }
  .border {
    border: 1px solid;
    border-radius: 2px;
  }
  .large {
    font-size: 36px;
    padding: 8px;
  }
  .white {
    border-color: white;
    color: white;
  }
</style>

<button id={id} class="icon-button {className}" bind:this={topelement} on:click|preventDefault|stopPropagation
  class:large class:border class:top class:middle class:bottom
  class:left class:center class:right class:white class:relative
  aria-label={label || name}>
  <ion-icon name={name}></ion-icon>
</button>
