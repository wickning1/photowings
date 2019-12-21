<script>
  import { getContext, setContext } from 'svelte'
  const ctx = getContext('headerlevel')
  export let below = ctx ? ctx.getLevel() : 0
  setContext('headerlevel', {
    getLevel: () => parseInt(below) + 1
  })
</script>

<slot></slot>
