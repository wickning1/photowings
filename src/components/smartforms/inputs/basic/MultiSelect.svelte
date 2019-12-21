<script>
  import { onMount, createEventDispatcher } from 'svelte'
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
  export let allowadd = false
  export let datatovalues = data => data
  export let valuestodata = value => value.map(v => v.value)
  const dispatch = createEventDispatcher()
  $: valid = validationuseful && showvalidation && !errors.length
  $: invalid = showvalidation && errors.length
  $: if (slimselect) slimselect.set(datatovalues(value))
  let selectelement
  let slimselect
  onMount(async () => {
    const module = await import('slim-select')
    const SlimSelect = module.default
    slimselect = new SlimSelect({
      select: selectelement,
      placeholder,
      hideSelectedOption,
      onChange: onchange,
      addable: allowadd ? addable : undefined
    })
  })

  // increase accessibility / keyboard access by making the "x" on each pill tabbable
  let first = true
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
    console.log('dispatch', values)
    if (!first) dispatch('change', valuestodata(values))
    first = false
  }

  function addable (value) {
    console.log(value)
    return {
      text: value,
      value: value
    }
  }

</script>

<style>
  .valid :global(.ss-multi-selected) {
    border: 1px solid var(--success);
  }
  .invalid :global(.ss-multi-selected) {
    border: 1px solid var(--fail);
  }
  :global(.ss-value) {
    font-size: 16px !important;
    line-height: 1.4 !important;
  }
  :global(.ss-add) {
    margin-top: 0 !important;
    align-items: center;
  }
  :global(.ss-disabled) {
    line-height: normal !important;
  }
  :global(.ss-value-delete) {
    padding: 0 3px;
  }
  :global(.ss-value-delete:focus) {
    outline: 1px solid blue;
  }
</style>

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slim-select/1.18.6/slimselect.min.css" />
</svelte:head>
<div class:valid class:invalid>
<select id={id} name={name} bind:this={selectelement} multiple on:blur disabled={disabled}>
  <slot></slot>
</select>
</div>
