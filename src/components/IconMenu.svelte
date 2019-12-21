<script>
  export let icons
  export let hidehighestbadgecount = false
  import IconButton from './IconButton'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  function onclick (which) {
    return e => dispatch('activate', which)
  }
  let w
  $: iconsthatwillfit = Math.floor(w / 40.0)
  $: iconlimit = icons.length > iconsthatwillfit ? iconsthatwillfit - 1 : icons.length
  $: morebadgecount = hidehighestbadgecount ? 0 : icons.slice(iconlimit).reduce((acc, curr) => (curr.badgecount > acc ? curr.badgecount : acc), 0)
  let moreshown = false

  let timer
  let hasfocus = false
  function focusin (e) {
    hasfocus = true
  }
  function focusout (e) {
    cancelAnimationFrame(timer)
    hasfocus = false
    timer = requestAnimationFrame(() => { moreshown = hasfocus })
  }
</script>

<style>
  div {
    position: relative;
    display: flex;
    justify-content: flex-end;
  }
  .icon-menu-more {
    position: absolute;
    top: 100%;
    right: 0;
    display: flex;
    flex-direction: column;
  }
</style>

<div class="icon-menu" bind:clientWidth={w} on:focusin={focusin} on:focusout={focusout}>
  {#each icons as icon, idx (icon.name)}
    {#if idx < iconlimit}
      <IconButton relative name={icon.name} label={icon.label} outline={icon.outline} badgecount={icon.badgecount} on:click={onclick(icon.name)} disabled={icon.disabled} />
    {/if}
  {/each}
  {#if icons.length > iconsthatwillfit}
    <IconButton relative name='more_vert' label='more actions' badgecount={morebadgecount} on:click={() => { moreshown = !moreshown }}/>
    {#if moreshown}
      <div class="icon-menu-more">
        {#each icons as icon, idx (icon.name)}
          {#if idx >= iconlimit}
            <IconButton relative name={icon.name} label={icon.label} outline={icon.outline} badgecount={icon.badgecount} on:click={onclick(icon.name)} disabled={icon.disabled} />
          {/if}
        {/each}
      </div>
    {/if}
  {/if}
</div>
