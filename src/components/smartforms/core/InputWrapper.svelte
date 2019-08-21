<script>
  export let name
  import { SMARTFORM } from './Form'
  import { getContext } from 'svelte'
  const ctx = getContext(SMARTFORM)
  ctx.register(name)
  const value = ctx.subscribeValue(name)
  const errors = ctx.subscribeErrors(name)
  const showerrors = ctx.subscribeShowErrors(name)
</script>

<slot value={$value} showsuccess={showerrors && !$errors.length} errors={$showerrors ? $errors : []} setvalue={ctx.setvalue(name)} blur={ctx.blur(name)}></slot>
