<script>
  import { onMount } from 'svelte'
  export let name
  export let id = ''
  export let value = []

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

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slim-select/1.18.6/slimselect.min.css" />
</svelte:head>
<select id={id} name={name} bind:value={value} bind:this={selectelement} multiple on:blur on:change>
  <slot></slot>
</select>
