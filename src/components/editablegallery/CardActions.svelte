<script>
  import IconButton from '../IconButton'
  import { selectedimages } from '../../stores/selectedimages'
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

<IconButton name={selected ? 'checkbox-outline' : 'square-outline'}
  label={selected ? 'deselect image' : 'add image to selected group'} relative on:click={onclick} />
