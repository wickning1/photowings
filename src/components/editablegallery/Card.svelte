<script>
  import Card from '../gallery/Card'
  import CardActions from './CardActions'
  import { selectionmode } from '../../stores/selectedimages'
  export let image
  export let topelement = null
</script>

<style>
  :global(.gallery .gallery-column .hover-controls) {
    background-color: var(--primary-bg-alpha);
  }
</style>

<Card ActionsComponent={CardActions} image={image} bind:topelement={topelement} showactions={$selectionmode} />
