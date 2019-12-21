<script>
  export let name
  export let id = undefined
  export let label = undefined
  export let disabled = false
  export let allowadd = false
  export let validationuseful = false
  import MultiSelect from '../smartforms/inputs/public/MultiSelect'
  const datatovalues = data => data.map(t => t.id)
  const valuestodata = value => value.map(v => ({ id: v.value }))
</script>

<MultiSelect id={id} name={name} label={label} datatovalues={datatovalues} valuestodata={valuestodata}
  validationuseful={validationuseful} disabled={disabled} allowadd={allowadd} placeholder='Select Tags'>
  <slot></slot>
</MultiSelect>
