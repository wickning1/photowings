<script>
  import { getContext } from 'svelte'
  const noscript = getContext('noscript')
</script>

{#if noscript}
  <slot name="noscript"></slot>
{:else}
  <slot></slot>
{/if}
