  <script>
  export let returnfocusto = undefined
  export let hidefocus = true
  export let hidefocuslabel = "focus moved to dialog"
  import { onMount, onDestroy, createEventDispatcher, tick } from 'svelte'
  import tabbable from 'tabbable'
  const dispatch = createEventDispatcher()

  let lockelement
  let abovelockelement
  let active = true
  onMount(() => {
    if (!window.FocusLockStack) window.FocusLockStack = []
    const prevFocusLock = window.FocusLockStack.slice(-1)[0]
    if (prevFocusLock) prevFocusLock.pause()
    window.FocusLockStack.push({
      pause: () => { active = false },
      unpause: () => { active = true }
    })

    if (!returnfocusto) {
      returnfocusto = document.querySelector(':focus')
    }
    setInitialFocus()
  })
  onDestroy(async () => {
    const wasactive = active
    active = false
    await tick()
    if (returnfocusto && wasactive) {
      if (returnfocusto.focus) returnfocusto.focus()
      else {
        const retfocus = document.querySelector(returnfocusto)
        if (retfocus) retfocus.focus()
      }
    }
    window.FocusLockStack.pop()
    const prevFocusLock = window.FocusLockStack.slice(-1)[0]
    if (prevFocusLock) prevFocusLock.unpause()
  })
  const setInitialFocus = () => {
    const firstfocus = tabbable(lockelement)[0]
    if (firstfocus && firstfocus.focus) {
      firstfocus.focus()
    }
  }
  const setLastFocus = () => {
    const lastfocus = tabbable(lockelement).slice(-1)[0]
    if (lastfocus && lastfocus.focus) {
      lastfocus.focus()
    }
  }
  const keydown = e => {
    if (active && e.key === "Escape" || e.keyCode === 27) {
      e.stopPropagation()
      e.preventDefault()
      dispatch('escape')
    }
  }
  const focusin = e => {
    if (active && lockelement && !lockelement.contains(e.target)) {
      if (e.target === abovelockelement) setLastFocus()
      else setInitialFocus()
    }
  }
</script>

<style>
  .hiddenfocus {
    outline: 0
  }
</style>

<svelte:window on:keydown={keydown} on:focusin={focusin}/>
<div bind:this={abovelockelement} tabindex="0"></div>
<div bind:this={lockelement} on:keydown={keydown}>
  {#if hidefocus}<div class="hiddenfocus" aria-label={hidefocuslabel} tabindex="0" on:blur={() =>{ hidefocus = false }}></div>{/if}
  <slot></slot>
</div>
<div tabindex="0"></div>
