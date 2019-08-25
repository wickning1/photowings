<script>
  import { editorpreload, tags, selectednumber } from '../../stores/gallery'
  import MultiSelect from '../smartforms/inputs/public/MultiSelect'
  import SingleLine from '../smartforms/inputs/public/SingleLine'
  import Form from '../smartforms/core/Form'
  async function validate (formdata) {
    console.log('validate', formdata)
    return {}
  }
  async function submit (formdata) {
    console.log('submit')
    return {}
  }
</script>

<style>
  :global(.gallery-editor) {
    background-color: white;
    height: 90vh;
    width: 800px;
    max-width: 90vw;
    padding: 20px;
    overflow-y: auto;
  }
</style>

<Form preload={$editorpreload} submit={submit} validate={validate} className='gallery-editor'>
  {#if $selectednumber === 1}
    <SingleLine name="title"/>
  {/if}
  <MultiSelect name="tags">
    {#each $tags as tag}
      <option value={tag.id}>{tag.name}</option>
    {/each}
  </MultiSelect>
  <input type="submit" value="Update Images">
</Form>
