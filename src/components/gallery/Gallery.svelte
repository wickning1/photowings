<script>
  import Card from './Card'
  import { onMount, afterUpdate, tick } from 'svelte'
  export let images
  export let maxwidth = 400
  export let CardComponent = Card

  // make number of columns rely on the current width of the gallery
  let w = 1000 // this is bound to .gallery clientWidth, see HTML section below
  $: columns = Math.ceil(w / maxwidth)
  $: columnarray = new Array(columns)

  // this next section is designed to minimize the amount of work that needs to be done
  // svelte is responsible for creating all gallery components and placing them into
  // .gallery-unsorted, then after svelte finishes rendering, we use pure JS to move
  // the images into the correct column according to the heights
  // this way all the dom elements are preserved in responsive re-renders (because we
  // use a keyed #each loop to create them)
  let savecolumns = 0
  let cardelements = {}
  let columnelements = []
  afterUpdate(async () => {
    await tick()
    if (savecolumns !== columns) { // only do work if number of columns has changed, afterUpdate triggers on resize
      const heights = Array.apply(null, Array(columns)).map(h => 0) // initializes heights to an array of zeroes
      const cardheights = images.reduce((acc, curr) => { acc[curr.id] = cardelements[curr.id].clientHeight; return acc }, {})
      for (const image of images) {
        // find the column with the smallest current height
        const colidx = heights.reduce((acc, curr, curridx) => curr < heights[acc] ? curridx : acc, 0)
        // move the current card to the chosen column
        columnelements[colidx].appendChild(cardelements[image.id])
        // record the height we just added to the chosen column
        heights[colidx] += cardheights[image.id] + 10
      }
      savecolumns = columns
    }
  })
</script>

<style>
  .gallery {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .gallery-unsorted {
    visibility: hidden;
    height: 1px;
  }
  .gallery-column {
    padding-right: 10px;
  }
  .gallery-column:last-child {
    padding-right: 0;
  }
</style>

<div class="gallery" bind:clientWidth={w}>
  {#each columnarray as col, idx}
    <div class="gallery-column" style="width: {100 / columns}%;" bind:this={columnelements[idx]}></div>
  {/each}
  <div class="gallery-unsorted" style="width: {100 / columns}%;">
    {#each images as image (image.id)}
      <CardComponent image={image} bind:topelement={cardelements[image.id]} />
    {/each}
  </div>
</div>
