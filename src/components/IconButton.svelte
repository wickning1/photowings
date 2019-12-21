<script>
  export let name
  export let id = ''
  export let border = false
  export let large = false
  export let relative = false
  export let middle = false
  export let bottom = false
  export let top = !relative && !middle && !bottom
  export let center = false
  export let left = false
  export let right = !relative && !center && !left
  export let white = false
  export let outline = false
  export let className = ''
  export let topelement = undefined
  export let badgecount = 0
  export let label = name + (badgecount > 0 ? `, ${badgecount}` : '')
  export let text = ''
  export let disabled = false
  export let href = undefined
  import { goto } from '@sapper/app'
  function linkclick() { goto(href) }
</script>

<style>
  .icon-button {
    position: absolute;
    display: inline-block;
    padding: 8px;
    border: none;
    font: inherit;
    color: inherit;
    background-color: transparent;
    cursor: pointer;
    text-decoration: none;
  }
  .icon-button i {
    display: block;
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
    padding: 10px;
  }
  .large i {
    font-size: 36px;
  }
  .white {
    border-color: white;
    color: white;
  }
  .disabled {
    color: gray;
  }
  .badge {
    position: absolute;
    top: 0.1em;
    right: -0.1em;
    min-width: 1.2em;
    height: 1.2em;
    line-height: 1.2em;
    border-radius: 0.6em;
    font-size: 11px;
    background-color: var(--badge-color);
    color: var(--badge-color-text);
    padding: 0.025em 0.3em 0 0.2em;
  }
  .large .badge {
    font-size: 15px;
  }
  .text {
    display: block;
    font-size: 11px;
    margin-top: -4px;
  }
  .large .text {
    font-size: 15px;
  }
</style>

{#if href}
  <a id={id} class="icon-button {className}" bind:this={topelement} href={href} on:click|stopPropagation|preventDefault={linkclick}
    class:large class:border class:top class:middle class:bottom
    class:left class:center class:right class:white class:relative
    class:disabled disabled={disabled}>
    <i class="material-icons{outline ? '-outlined' : ''}">{name}<span class="sr-only">{label}</span></i>
    {#if badgecount}
      <div class="badge" aria-hidden="true">{badgecount}</div>
    {/if}
    {#if text}
      <span class="text">{text}</span>
    {/if}
  </a>
{:else}
  <button id={id} class="icon-button {className}" bind:this={topelement} on:click|preventDefault|stopPropagation
    class:large class:border class:top class:middle class:bottom
    class:left class:center class:right class:white class:relative
    class:disabled disabled={disabled}>
    <i class="material-icons{outline ? '-outlined' : ''}">{name}<span class="sr-only">{label}</span></i>
    {#if badgecount}
      <div class="badge" aria-hidden="true">{badgecount}</div>
    {/if}
    {#if text}
      <span class="text">{text}</span>
    {/if}
  </button>
{/if}
