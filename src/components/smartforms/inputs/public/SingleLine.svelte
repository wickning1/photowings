<script>
  export let name
  export let id = undefined
  export let label = undefined
  export let validationuseful = false
  import Input from '../../core/Input'
  import BasicLayout from '../layouts/BasicLayout'
  import SingleLine from '../basic/SingleLine'
</script>

<Input id={id} name={name} label={label}
  LayoutComponent={BasicLayout} InputComponent={SingleLine} inputprops={{ validationuseful }}>
  <slot></slot>
</Input>
