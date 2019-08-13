<script>
  import HasScript from './HasScript'
  import NoScript from './NoScript'
  export let generatenoscript = false
  let shown = !generatenoscript
  if (process.browser) { shown = true }
</script>

<style>
  div { display: none; }
  .shown { display: block; }
</style>

<div class:shown>
  <HasScript><slot></slot></HasScript>
</div>
{#if generatenoscript}
  <noscript>
    <NoScript><slot></slot></NoScript>
  </noscript>
{/if}
