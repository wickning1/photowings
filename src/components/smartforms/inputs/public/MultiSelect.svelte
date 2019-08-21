<script>
  import _ from 'txstate-node-utils/lib/util'
  export let name
  export let label = undefined
  export let id = _.randomid()
  import { SMARTFORM } from '../../core/Form'
  import { getContext } from 'svelte'
  const { subscribe } = getContext(SMARTFORM)
  const { value, errors, showvalidation, setvalue, blur } = subscribe(name)
  $: bindvalue = $value

  import BasicLayout from '../shared/BasicLayout'
  import MultiSelect from '../basic/MultiSelect'

  function onchange () {
    setvalue(bindvalue)
  }
</script>

<BasicLayout showvalidation={$showvalidation} errors={$errors} id={id} name={name} label={label}>
  <MultiSelect id={id} name={name} bind:value={bindvalue} showsuccess={$showvalidation && !$errors.length} on:change={onchange} on:blur={blur}>
    <slot></slot>
  </MultiSelect>
</BasicLayout>
