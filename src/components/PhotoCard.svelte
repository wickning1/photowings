<script>
  import Header from './Header'
  import helpers from '../lib/helpers'
  export let image
  let hover = false
  let mouseovertimer
  const mouseover = (e) => {
    clearTimeout(mouseovertimer)
    mouseovertimer = setTimeout(() => { hover = true }, 100)
  }
  const mouseout = (e) => {
    clearTimeout(mouseovertimer)
    mouseovertimer = setTimeout(() => { hover = false }, 100)
  }
</script>

<style>
  figure { position: relative; }
  figcaption {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0,0,0,0.8);
    color: white;
    padding: 1rem;
  }
  img {
    display: block;
    width: 100%;
  }
</style>

<figure on:mouseover={mouseover} on:mouseout={mouseout}>
  <img src="api/image/inline/{image.id}" alt="{image.notes}" width="{image.width}" height="{image.height}">
  <figcaption>
    <Header class="name">{image.name}</Header>
    {#if hover}
      <div class="taken">{helpers.photoTime(image.taken)}</div>
      {#if image.latitude && image.longitude}
        <a class="location" href="https://www.google.com/maps/search/?api=1&query={image.latitude},{image.longitude}">view on map</a>
      {/if}
    {/if}
  </figcaption>
</figure>
