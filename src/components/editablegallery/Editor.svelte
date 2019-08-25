<script>
  import { editorpreload, tags, selectednumber } from '../../stores/gallery'
  import MultiSelect from '../smartforms/inputs/public/MultiSelect'
  import SingleLine from '../smartforms/inputs/public/SingleLine'
  import Form from '../smartforms/core/Form'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  async function validate (formdata) {
    console.log('validate', formdata)
    return {}
  }
  async function submit (formdata) {
    console.log('submit')
    return {}
  }
  function dismiss() {
    dispatch('dismiss')
  }
</script>

<style>
  :global(.gallery-editor) {
    background-color: white;
    height: calc(100vh - 20px);
    width: 800px;
    max-width: calc(100vw - 20px);
    padding: 20px;
    overflow-y: auto;
  }
  .buttons {
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    margin-top: 25px;
  }
</style>

<Form preload={$editorpreload} submit={submit} validate={validate} className='gallery-editor pure-form pure-form-stacked'>
  {#if $selectednumber === 1}
    <SingleLine name="title"/>
  {/if}
  <MultiSelect name="tags">
    {#each $tags as tag}
      <option value={tag.id}>{tag.name}</option>
    {/each}
  </MultiSelect>
  <div class="buttons">
    <input type="submit" value="Update Images">
    <input type="submit" on:click|preventDefault={dismiss} value="Cancel">
  </div>
</Form>
