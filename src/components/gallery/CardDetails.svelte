<script>
  import { photoTime } from '../../lib/helpers'
  import Header from '../Header'
  export let image
  export let hover
</script>

<Header class="name">{image.title}</Header>
{#if hover}
  <div class="taken">{photoTime(image.taken)}</div>
  {#if image.latitude && image.longitude}
    <a class="location" href="https://www.google.com/maps/search/?api=1&query={image.latitude},{image.longitude}">view on map</a>
  {/if}
{/if}
