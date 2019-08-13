<script>
  import { getContext } from 'svelte'
  const noscript = getContext('noscript')
</script>

{#if noscript}
  <slot></slot>
{:else}
  <slot name="script"></slot>
{/if}
