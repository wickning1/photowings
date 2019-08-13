<script>
  import _ from 'txstate-node-utils/lib/util'
  import { onMount } from 'svelte'
  export let name
  export let id = 'f' + _.generatestring(10)
  export let value = []
  export let label = undefined
  export let hidelabel = false

  let selectelement
  onMount(async () => {
    const module = await import('slim-select')
    const SlimSelect = module.default
    new SlimSelect({
      select: selectelement,
      placeholder: "Select Multiple",
      hideSelectedOption: true
    })
  })
</script>

<style>
  .wrapper {
    margin-bottom: 10px;
  }
</style>

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slim-select/1.18.6/slimselect.min.css" />
</svelte:head>

<div class="wrapper">
  <label for={id} class={hidelabel ? 'sr-only' : ''}>{label || _.ucfirst(name)}</label>
  <select id={id} name={name} bind:value={value} bind:this={selectelement} multiple>
    <slot></slot>
  </select>
</div>
