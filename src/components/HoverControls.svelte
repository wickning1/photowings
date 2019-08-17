<script>
  import safemousein from '../actions/safemousein.js'
  import { onMount } from 'svelte'
  export let middle = false
  export let bottom = false
  export let left = false
  export let center = false
  export let top = !middle && !bottom
  export let right = !left && !center
  export let showcontrols = false
  export let idlehidden = true
  export let idletimer = 2500
  let controltimer
  let mouseisover = false

  const show = () => {
    if (!idlehidden) return
    clearTimeout(controltimer)
    showcontrols = true
    controltimer = setTimeout(() => { if (!mouseisover) hide() }, idletimer)
  }

  const windowmousemove = e => {
    show()
  }
  const mousemove = e => {
    show()
  }
  const hide = () => {
    showcontrols = false
  }
  const mouseover = e => {
    show() // mouseover can be triggered by focus, so we need to show() for keyboard users
    mouseisover = true
  }
  const mouseout = e => {
    mouseisover = false
  }

  onMount(show)
</script>

<style>
  .hover-controls {
    position: absolute;
    background-color: var(--contrast-bg);
    padding: 0 5px;
    opacity: 0;
    color: white;
  }
  .showcontrols {
    opacity: 1;
  }
  .top {
    top: 0;
  }
  .middle {
    top: 50%;
    transform: translateY(-50%);
  }
  .bottom {
    bottom: 0;
  }
  .left {
    left: 0;
  }
  .right {
    right: 0;
  }
  .center {
    left: 50%;
    transform: translateX(-50%);
  }
  .top.right { border-bottom-left-radius: 4px; }
  .top.left { border-bottom-right-radius: 4px; }
  .top.center { border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; }
  .middle.center { border-radius: 4px; }
  .bottom.right { border-top-left-radius: 4px; }
  .bottom.left { border-top-right-radius: 4px; }
  .bottom.center { border-top-right-radius: 4px; border-top-left-radius: 4px; }
</style>

<svelte:window on:mousemove={windowmousemove} on:click={windowmousemove}/>
<div class="hover-controls" class:showcontrols class:top class:middle class:bottom class:left class:right class:center
  use:safemousein on:in={mouseover} on:out={mouseout}>
  <slot></slot>
</div>
