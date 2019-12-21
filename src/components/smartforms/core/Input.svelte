<script>
  import _ from 'txstate-node-utils/lib/util'
  export let name
  export let id = undefined
  export let label = _.ucfirst(name.split(/\./).slice(-1)[0])
  export let InputComponent
  export let inputprops = {}
  export let LayoutComponent
  export let layoutprops = {}
  import { SMARTFORM } from './Form'
  import { getContext, onDestroy } from 'svelte'
  const { subscribe } = getContext(SMARTFORM)
  const { value, errors, showvalidation, setvalue, blur, unsubscribe } = subscribe(name)
  let bindvalue
  $: if ($value) bindvalue = $value

  function onchange (e) {
    if (e.detail) setvalue(e.detail)
    else setvalue(bindvalue)
  }
  function update (e) {
    if (e.detail) setvalue(e.detail, true)
    else setvalue(bindvalue, true)
  }
  onDestroy(unsubscribe)
</script>

<LayoutComponent id={id} label={label} showvalidation={$showvalidation} errors={$errors} {...layoutprops} let:id>
  <InputComponent id={id} name={name} bind:value={bindvalue} showvalidation={$showvalidation}
    errors={$errors} on:change={onchange} on:blur={blur} on:update={update} {...inputprops}>
    <slot></slot>
  </InputComponent>
</LayoutComponent>
