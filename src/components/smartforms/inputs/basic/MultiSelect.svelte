<script>
  import { onMount } from 'svelte'
  import { a11yclick } from '../../../../actions/a11yevents'
  export let name
  export let id = ''
  export let value = []
  export let disabled = false
  export let validationuseful = false
  export let showvalidation = false
  export let errors = []
  export let placeholder = 'Select Multiple'
  export let hideSelectedOption = true

  $: valid = validationuseful && showvalidation && !errors.length

  let selectelement
  let slimselect
  onMount(async () => {
    const module = await import('slim-select')
    const SlimSelect = module.default
    slimselect = new SlimSelect({
      select: selectelement,
      placeholder,
      hideSelectedOption,
      onChange: onchange
    })
  })

  // increase accessibility / keyboard access by making the "x" on each pill tabbable
  function onchange (values) {
    for (const val of values) {
      const pill = selectelement.parentElement.querySelector('.ss-value[data-id="' + val.id + '"] .ss-value-delete')
      if (pill.tabIndex === -1) {
        a11yclick(pill)
        pill.setAttribute('aria-label', val.text + ', remove')
        pill.addEventListener('click', () => {
          slimselect.set(slimselect.selected().filter(v => v !== val.value))
        })
        pill.addEventListener('keydown', e => {
          if (e.key === 'Delete' || e.key === 'Backspace') slimselect.set(slimselect.selected().filter(v => v !== val.value))
        })
      }
    }
  }
</script>

<style>
  .valid {
    border: 1px solid var(--success);
  }
  :global(.ss-value-delete:focus) {
    outline: 1px solid blue;
  }
</style>

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slim-select/1.18.6/slimselect.min.css" />
</svelte:head>
<select id={id} name={name} bind:value={value} bind:this={selectelement} multiple on:blur on:change class:valid disabled={disabled}>
  <slot></slot>
</select>
