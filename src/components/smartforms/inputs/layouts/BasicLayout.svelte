<script>
  export let showvalidation = false
  export let errors = []
  export let label
  export let id = _.randomid()
</script>

<style>
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
