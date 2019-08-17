<script>
  export let icons
  import IconButton from './IconButton'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  function onclick (which) {
    return e => dispatch('activate', which)
  }
</script>

<style>
  div {
    text-align: right;
  }
</style>

<div>
  {#each icons as icon}
    <IconButton relative name={icon.name} badgecount={icon.badgecount} on:click={onclick(icon.name)} />
  {/each}
</div>
