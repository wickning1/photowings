<script>
  export let name
  export let id = ''
  export let value = ''
  export let validationuseful = true
  export let showvalidation = false
  export let errors = []
  export let placeholder = ''
  import typing from '../../../../actions/typing'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  function keydown (e) {
    dispatch('update')
  }
  $: valid = validationuseful && showvalidation && !errors.length
</script>

<style>
  input { width: 100%; }
  .valid {
    border: 1px solid var(--success);
  }
</style>

<input type="text" id={id} name={name} bind:value={value} use:typing on:blur on:change on:typing={keydown} class:valid>
