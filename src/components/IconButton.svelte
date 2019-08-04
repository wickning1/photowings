<script>
  export let name
  export let label = undefined
  export let hoverable = false
  export let border = false
  export let large = false
  export let top = true
  export let middle = false
  export let bottom = false
  export let right = true
  export let center = false
  export let left = false
  export let className = ''
  import { createEventDispatcher } from 'svelte'
  import helpers from '../lib/helpers'
  const dispatch = createEventDispatcher()
  const activate = e => {
    if (helpers.detectClickOrEnter(e)) {
      e.stopPropagation()
      dispatch('click', e)
    }
  }
</script>

<style>
  ion-icon {
    position: absolute;
    padding: 6px;
    font-size: 26px;
    cursor: pointer;
  }
  ion-icon.hoverable {
    opacity: 0.5;
  }
  ion-icon.hoverable:hover {
    opacity: 1;
  }
  ion-icon.top { top: 0; }
  ion-icon.bottom { bottom: 0; }
  ion-icon.left { left: 0; }
  ion-icon.right { right: 0; }
  ion-icon.center {
    left: 50%;
    transform: translateX(-50%);
  }
  ion-icon.middle{
    top: 50%;
    transform: translateY(-50%);
  }
  ion-icon.border {
    border: 1px solid;
    border-radius: 2px;
  }
  ion-icon.large {
    font-size: 36px;
    padding: 8px;
  }
</style>

<ion-icon name={name} class={className}
  class:large class:border class:hoverable class:top class:middle class:bottom class:left class:center class:right
  aria-label={label} on:click={activate} on:keydown={activate} tabindex=0></ion-icon>
