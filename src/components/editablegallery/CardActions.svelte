<script>
  import IconButton from '../IconButton'
  import { selectedimages } from '../../stores/gallery'
  export let image
  export let hover = true
  const onclick = e => {
    selectedimages.update(si => {
      if (si[image.id]) {
        const { [image.id]: value, ...ret } = si // deselect
        return ret
      } else {
        return { ...si, [image.id]: image } // select
      }
    })
  }

  $: selected = $selectedimages[image.id]
</script>

<IconButton name={selected ? 'check_box' : 'check_box_outline_blank'}
  label={selected ? 'deselect image' : 'add image to selected group'} relative on:click={onclick} />
<IconButton name='create' label='edit image' relative href='image/{image.id}/edit' />
