<script>
  export let name
  export let id = _.randomid()
  export let label = name
  import Input from '../../core/Input'
  import BasicLayout from '../shared/BasicLayout'
  import MultiSelect from '../basic/MultiSelect'
</script>

<Input id={id} name={name} label={label} LayoutComponent={BasicLayout} InputComponent={MultiSelect}>
  <slot></slot>
</Input>
