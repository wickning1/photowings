<script>
  import PhotoCard from './PhotoCard'
  import { onMount } from 'svelte'
  export let images
  export let maxwidth = 400

  // hide the gallery until it's been mounted, to avoid flashing the user with the wrong number
  // of columns
  let shown = false

  // make number of columns rely on the current width of the gallery
  let w = 1000
  let columns
  $: columns = Math.ceil(w / maxwidth)

  // all images will display with the column's width and auto height,
  // so to do our math we need to scale the heights accordingly
  function normalizeHeight (width, height) {
    return height * (0.8333 * maxwidth / width)
  }

  // find the column with the smallest current height
  function arrayMin (array) {
    return array.reduce((acc, curr, curridx) => curr < array[acc] ? curridx : acc, 0)
  }

  // function to efficiently sort images into columns
  function makeImageColumns (columns, images) {
    const ret = Array.apply(null, Array(columns)).map(c => ([]))
    const heights = Array.apply(null, Array(columns)).map(h => 0)
    for (const image of images) {
      const colidx = arrayMin(heights)
      ret[colidx].push(image)
      heights[colidx] += normalizeHeight(image.width, image.height) + 10
    }
    return ret
  }

  $: imagecolumns = makeImageColumns(columns, images)
</script>

<style>
  .gallery {
    display: flex;
    visibility: hidden;
  }
  .gallery-column {
    padding-right: 10px;
  }
  .gallery-column:last-child {
    padding-right: 0;
  }
  .gallery :global(figure) {
    width: 100%;
    margin-bottom: 10px;
  }
  .shown {
    visibility: visible;
  }
</style>

<svelte:window on:load={() => { shown = true}}/>
<div class="gallery" class:shown bind:clientWidth={w}>
  {#each imagecolumns as images}
    <div class="gallery-column" style="width: {100 / columns}%;">
      {#each images as image (image.id)}
        <PhotoCard image={image} />
      {/each}
    </div>
  {/each}
</div>
