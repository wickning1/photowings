<script>
  export let showvalidation = false
  export let errors = []
  export let id = _.randomid()
  export let name
  export let label = undefined
  import _ from 'txstate-node-utils/lib/util'
</script>

<style>
  .wrapper {
    margin-bottom: 10px;
  }
</style>

<div class="wrapper">
  <label for={id}>{label || _.ucfirst(name)}</label>
  <slot id={id}></slot>
  {#if showvalidation && errors.length}
    <div class="errors">
      {#each errors as error}
        <div class="error">{error}</div>
      {/each}
    </div>
  {/if}
</div>
