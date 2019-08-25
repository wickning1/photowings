<script>
  import _ from 'txstate-node-utils/lib/util'
  export let showvalidation = false
  export let errors = []
  export let label
  export let id = _.randomid()
</script>

<style>
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 4px;
  }
  .wrapper {
    margin-bottom: 10px;
  }
</style>

<div class="wrapper">
  <label for={id}>{label}</label>
  <slot id={id}></slot>
  {#if showvalidation && errors.length}
    <div class="errors">
      {#each errors as error}
        <div class="error">{error}</div>
      {/each}
    </div>
  {/if}
</div>
