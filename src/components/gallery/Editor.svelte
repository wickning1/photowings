<script>
  import { editorpreload } from '../../stores/gallery'
  import MultiSelect from '../smartforms/inputs/public/MultiSelect'
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

<Form preload={$editorpreload} submit={submit} validate={validate}>
  <MultiSelect name="tags">
    <option value="0113">Wedding</option>
  </MultiSelect>
</Form>
