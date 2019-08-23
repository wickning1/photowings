<script>
  export let id
  export let name
  export let label = name.split(/\./).slice(-1)[0]
  export let InputComponent
  export let inputprops = {}
  export let LayoutComponent
  export let layoutprops = {}
  import { SMARTFORM } from './Form'
  import { getContext, onDestroy } from 'svelte'
  const { subscribe } = getContext(SMARTFORM)
  const { value, errors, showvalidation, setvalue, blur, unsubscribe } = subscribe(name)
  $: bindvalue = $value

  function onchange () {
    setvalue(bindvalue)
  }
  onDestroy(unsubscribe)
</script>

<LayoutComponent id={id} label={label} showvalidation={$showvalidation} errors={$errors} {...layoutprops}>
  <InputComponent bind:value={bindvalue} showvalidation={$showvalidation}
    errors={$errors} onchange={onchange} blur={blur} {...inputprops}>
    <slot></slot>
  </InputComponent>
</LayoutComponent>
