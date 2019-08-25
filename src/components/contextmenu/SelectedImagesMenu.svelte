<script>
  export let selectednumber
  import IconMenu from '../IconMenu'
  import { selectAll, deselectAll, beginEditing, editing } from '../../stores/gallery'
  $: icons = [
    { name: 'edit', label: `edit ${selectednumber} image${selectednumber === 1 ? '' : 's'}`, badgecount: selectednumber },
    { name: 'done_all', label: 'select all' },
    { name: 'close', label: 'deselect all' },
  ]

  function activate (e) {
    const which = e.detail
    if (which === 'edit') beginEditing()
    if (which === 'done_all') selectAll()
    if (which === 'close') deselectAll()
  }
  const keydown = e => {
    if (!$editing) {
      if (e.key === 'a') selectAll()
      if (e.key === 'e') beginEditing()
      if (e.key === 'x') deselectAll()
    }
  }
</script>

<svelte:window on:keydown={keydown} />
<div class="sr-only" aria-live="assertive">
  {selectednumber} image{selectednumber === 1 ? '' : 's'} selected press e to begin editing, a to select all, x to cancel selections
</div>
<IconMenu icons={icons} on:activate={activate} />
