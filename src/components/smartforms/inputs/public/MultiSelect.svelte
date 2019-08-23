<script>
  import _ from 'txstate-node-utils/lib/util'
  export let name
  export let id = _.randomid()
  export let label = undefined
  import Input from '../../core/Input'
  import BasicLayout from '../layouts/BasicLayout'
  import MultiSelect from '../basic/MultiSelect'
</script>

<Input id={id} name={name} label={label}
  LayoutComponent={BasicLayout} InputComponent={MultiSelect}>
  <slot></slot>
</Input>
