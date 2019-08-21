<script>
  export let query
  export let preserve = []
  export let reset = {}
  export let filters = {}
  import _ from 'txstate-node-utils/lib/util'
  import { goto } from '@sapper/app'
  import { state, replaceState, qs } from '../lib/helpers'
  import IconButton from './IconButton'
  import FocusLock from './FocusLock'
  import MultiSelect from './MultiSelect'
  let form
  const ids = {}
  for (const key of Object.keys(filters)) {
    ids[key] = _.randomid()
  }
  const formid = _.randomid()
  let shown = process.browser && state().filtershown
  const toggle = async e => {
    if (shown) dismiss(e)
    else {
      shown = true
      replaceState({ filtershown: true })
    }
  }
  const outsideclick = e => {
    if (shown && !e.target.closest('#' + formid)) {
      dismiss(e)
    }
  }
  const dismiss = (e) => {
    shown = false
    replaceState({ filtershown: false })
  }
  const submit = async e => {
    goto(qs('', { ...query, ...reset }))
    dismiss(e)
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
    -webkit-overflow-scrolling: touch;
    background-color: white;
    border-left: 1px solid #666666;
    box-shadow: -2px 2px 2px 1px rgba(0,0,0,0.5);
    padding: 12px;
    min-height: 80vh;
  }
</style>

<svelte:window on:click={outsideclick} />
{#if shown}
  <FocusLock hidefocus={false} on:escape={dismiss} returnfocusto="#b{formid}">
    <IconButton name="cancel" middle right label="hide filters" on:click={toggle} />
    <form action="" method="GET" id={formid} class="pure-form pure-form-stacked"
      role="dialog" aria-label="choose filters"
      bind:this={form} on:submit|preventDefault={submit}>
      {#each preserve as param}
        {#if query[param]}<input type="hidden" name={param} value={query[param]} />{/if}
      {/each}
      {#each Object.entries(reset) as [key, val]}
        <input type="hidden" name={key} value={val} />
      {/each}
      {#each Object.entries(filters) as [name, settings], idx}
        {#if settings.values}
          <MultiSelect id={ids[name]} name={name} bind:value={query[name]} label="{settings.name || _.ucfirst(name)}:">
            {#each settings.values as { val, label }}
              <option value={val} selected={val === query[name]}>{label || val}</option>
            {/each}
          </MultiSelect>
        {/if}
      {/each}
      <button class="pure-button pure-button-primary" type="submit">Apply Filters</button>
    </form>
  </FocusLock>
{:else}
  <IconButton id="b{formid}" name='filter_list' middle right label="show filters" on:click={toggle} />
{/if}
