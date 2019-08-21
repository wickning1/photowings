<script>
  export let name
  export let label
  export let id = undefined
  export let value
  export let showsuccess
  export let errors
  export let setvalue
  export let blur
  import BasicLayout from '../shared/BasicLayout'
  import MultiSelect from '../basic/MultiSelect'

  function onchange () {
    setvalue(value)
  }
</script>

<BasicLayout showsuccess={showsuccess} errors={errors} id={id} name={name} label={label} let:id>
  <MultiSelect id={id} name={name} bind:value={value} on:change={onchange} on:blur={blur}>
    <slot></slot>
  </MultiSelect>
</BasicLayout>
