<script>
  import _ from 'txstate-node-utils/lib/util'
  import { onMount } from 'svelte'
  import MultiSelect from './smartforms/inputs/basic/MultiSelect'
  export let name
  export let id = _.randomid()
  export let value = []
  export let label = undefined
  export let hidelabel = false
</script>

<style>
  .wrapper {
    margin-bottom: 10px;
  }
</style>

<div class="wrapper">
  <label for={id} class={hidelabel ? 'sr-only' : ''}>{label || _.ucfirst(name)}</label>
  <MultiSelect id={id} name={name} bind:value={value}>
    <slot></slot>
  </MultiSelect>
</div>
