<script>
  export let name
  export let id = undefined
  export let label = undefined
  export let validationuseful = false
  export let disabled = false
  export let placeholder = undefined
  export let allowadd = false
  export let datatovalues = undefined
  export let valuestodata = undefined
  import Input from '../../core/Input'
  import BasicLayout from '../layouts/BasicLayout'
  import MultiSelect from '../basic/MultiSelect'
</script>

<Input id={id} name={name} label={label}
  LayoutComponent={BasicLayout} InputComponent={MultiSelect} inputprops={{ validationuseful, disabled, allowadd, placeholder, datatovalues, valuestodata }}>
  <slot></slot>
</Input>
