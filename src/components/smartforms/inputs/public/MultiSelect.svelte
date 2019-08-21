<script>
  export let name
  export let label = undefined
  export let id = undefined
  import MultiSelect from '../connected/MultiSelect'
  import InputWrapper from '../../core/InputWrapper'
</script>

<InputWrapper name={name} let:value let:showsuccess let:errors let:setvalue let:blur>
  <MultiSelect id={id} name={name} label={label} value={value} showsuccess={showsuccess} errors={errors} setvalue={setvalue} blur={blur}>
    <slot></slot>
  </MultiSelect>
</InputWrapper>
