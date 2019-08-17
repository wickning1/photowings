<script>
  export let selectednumber
  import IconMenu from '../IconMenu'
  $: icons = [
    { name: 'create', badgecount: selectednumber }
  ]

  function activate (e) {
    const which = e.detail
    console.log(which)
  }
  const keydown = e => {
    if (selectednumber && (e.key === 'e' || e.keyCode === 69)) {
      activate({ detail: 'create' })
    }
  }
</script>

<svelte:window on:keydown={keydown} />
<div class="sr-only" aria-live="assertive">
  {selectednumber} image{selectednumber === 1 ? '' : 's'} selected press e to begin editing
</div>
<IconMenu icons={icons} on:activate={activate} />
