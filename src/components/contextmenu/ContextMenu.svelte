<script>
  import { which, data } from '../../stores/contextmenu'
  import { selectednumber } from '../../stores/selectedimages'
  import SelectedImagesMenu from './SelectedImagesMenu'
</script>

{#if $selectednumber}
  <SelectedImagesMenu selectednumber={$selectednumber} />
{/if}
