<script>
  import { selectednumber } from '../../stores/gallery'
  import SelectedImagesMenu from './SelectedImagesMenu'
</script>

{#if $selectednumber}
  <SelectedImagesMenu selectednumber={$selectednumber} />
{/if}
