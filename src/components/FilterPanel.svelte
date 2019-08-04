<script>
  export let query
  export let preserve = []
  export let reset = {}
  export let filters = {}
  import _ from 'txstate-node-utils/lib/util'
  import helpers from '../lib/helpers'
  import CloseButton from './CloseButton'
  import IconButton from './IconButton'
  let form
  const ids = {}
  for (const key of Object.keys(filters)) {
    ids[key] = 'f' + _.generatestring(10)
  }

  const formid = 'f' + _.generatestring(10)
  let shown = process.browser && helpers.state().filtershown
  const toggle = e => {
    shown = !shown
    helpers.replaceState({ filtershown: shown })
  }
  const dismiss = e => {
    if (!e.target.closest('#' + formid)) shown = false
    helpers.replaceState({ filtershown: false })
  }
</script>

<style>
  form {
    position: absolute;
    z-index: 2;
    top: 0;
    right: 0;
    width: 400px;
    max-width: 100%;
    overflow: auto;
    background-color: white;
    border-left: 1px solid #666666;
    box-shadow: -2px 2px 2px 1px rgba(0,0,0,0.5);
    padding: 12px;
  }
</style>

<svelte:window on:click={dismiss} />
<IconButton name={shown ? 'close-circle-outline' : 'funnel'} middle right label="{shown ? 'hide' : 'show'} filters" on:click={toggle} />
{#if shown}
  <form action="" method="GET" id={formid} class="pure-form pure-form-stacked" bind:this={form}>
    {#each preserve as param}
      {#if query[param]}<input type="hidden" name={param} value={query[param]} />{/if}
    {/each}
    {#each Object.entries(reset) as [key, val]}
      <input type="hidden" name={key} value={val} />
    {/each}
    {#each Object.entries(filters) as [name, settings]}
      <label for={ids[name]} class="sr-only">{settings.name || _.ucfirst(name)}:</label>
      {#if settings.values}
        <select id={ids[name]} name={name} on:change={() => form.submit()}>
          <option value="">Any {settings.name || _.ucfirst(name)}</option>
          {#each settings.values as { val, label }}
              <option value={val} selected={val === query[name]}>{label || val}</option>
          {/each}
        </select>
      {/if}
    {/each}
  </form>
{/if}
