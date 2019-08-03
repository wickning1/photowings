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

  // all images will display with the column's width and auto height,
  // so to do our math we need to scale the heights accordingly
  function normalizeHeight (width, height) {
    // our sorting won't be perfect because the widths will fluctuate
    // until a breakpoint is reached
    // I'm using 7/8 of the maxwidth here as a guess, which gets us very
    // close to perfect, especially in the 3-4 column range
    return height * (0.875 * maxwidth / width)
  }

  // this next section is designed to minimize the amount of work that needs to be done
  // svelte is responsible for creating all my gallery components and placing them into
  // .gallery-unsorted, then after svelte finishes rendering, I use pure JS to move
  // the images into the correct column according to my layout rules
  // this way all the dom elements are preserved in responsive re-renders (because we
  // use a keyed #each loop to create them)
  let savecolumns = 0
  let cardelements = {}
  let columnelements = []
  afterUpdate(async () => {
    await tick()
    if (savecolumns !== columns) { // only do work if number of columns has changed, afterUpdate triggers on resize
      const heights = Array.apply(null, Array(columns)).map(h => 0) // initializes heights to an array of zeroes
      for (const image of images) {
        // find the column with the smallest current height
        const colidx = heights.reduce((acc, curr, curridx) => curr < heights[acc] ? curridx : acc, 0)
        // move the current card to the chosen column
        columnelements[colidx].appendChild(cardelements[image.id])
        // record the height we just added to the chosen column
        heights[colidx] += normalizeHeight(image.width, image.height) + 10
      }
      savecolumns = columns
    }
  })
</script>

<style>
  .gallery {
    display: flex;
  }
  .gallery-unsorted {
    display: none;
  }
  .gallery-column {
    padding-right: 10px;
  }
  .gallery-column:last-child {
    padding-right: 0;
  }
</style>

<div class="gallery" bind:clientWidth={w}>
  <div class="gallery-unsorted">
    {#each images as image (image.id)}
      <CardComponent image={image} bind:topelement={cardelements[image.id]} />
    {/each}
  </div>
  {#each columnarray as col, idx}
    <div class="gallery-column" style="width: {100 / columns}%;" bind:this={columnelements[idx]}></div>
  {/each}
</div>
