<script>
  import { setContext } from 'svelte'
  export let level = 2
  setContext('headerlevel', {
    getLevel: () => level
  })
</script>

<slot></slot>
