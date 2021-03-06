<script>
  import Card from './Card'
  import HasJS from '../noscript/HasJS'
  import NoJS from '../noscript/NoJS'
  import { afterUpdate, tick } from 'svelte'
  export let images
  export let maxwidth = 400
  export let CardComponent = Card
  export let widthguess = 799

  // make number of columns rely on the current width of the gallery
  let w = widthguess // this is bound to .gallery clientWidth, see HTML section below
  $: columns = Math.ceil(w / maxwidth)
  $: columnarray = [...Array(columns).keys()]

  // this next section is designed to minimize the amount of work that needs to be done
  // svelte is responsible for creating all gallery components and placing them into
  // .gallery-unsorted, then after svelte finishes rendering, we use pure JS to move
  // the images into the correct column according to the heights
  // this way all the dom elements are preserved in responsive re-renders (because we
  // use a keyed #each loop to create them)
  let savecolumns = 0
  let cardelements = {}
  let columnelements = []
  let unsortedcolumn
  $: savecolumns = 0 * images.length // little trick to trigger a sort when images array changes
  afterUpdate(async () => {
    await tick()
    if (savecolumns !== columns) { // only do work if number of columns has changed, afterUpdate triggers on resize
      const heights = Array.apply(null, Array(columns)).map(h => 0) // initializes heights to an array of zeroes
      // elements in columns that have just been eliminated need to be placed back into the DOM
      // in order to have a height - the easiest way to do that is to add them into unsorted
      images.filter(image => !cardelements[image.id].clientHeight)
        .forEach(image => unsortedcolumn.append(cardelements[image.id]))
      // collect all the card heights at this new column width
      // we do this before we start the main sorting loop so that all our
      // DOM reads are bundled up to avoid thrashing
      const cardheights = images.reduce((acc, curr) => { acc[curr.id] = cardelements[curr.id].clientHeight; return acc }, {})
      // begin sorting images into columns
      for (const image of images) {
        // find the column with the smallest current height
        const colidx = heights.reduce((acc, curr, curridx) => curr < heights[acc] ? curridx : acc, 0)
        // move the current card to the chosen column
        columnelements[colidx].append(cardelements[image.id])
        // record the height we just added to the chosen column
        // do NOT read the height from the DOM, it would cause thrashing
        heights[colidx] += cardheights[image.id] + 10
        // allow garbage collection of empty column elements
        while (columnelements.length > columns) columnelements.pop()
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
    padding-left: 10px;
  }
  .gallery-column:first-child {
    padding-left: 0;
  }
</style>

<div class="gallery" bind:clientWidth={w}>
  {#each columnarray as idx}
    <div class="gallery-column" style="width: {100 / columns}%;" bind:this={columnelements[idx]}>
      <NoJS>
        {#each images as image, imageidx}
          {#if imageidx % columns === idx}
            <CardComponent image={image} />
          {/if}
        {/each}
      </NoJS>
    </div>
  {/each}
  <HasJS>
    <div class="gallery-unsorted" style="width: {100 / columns}%;" bind:this={unsortedcolumn}>
      {#each images as image (image.id)}
        <CardComponent image={image} bind:topelement={cardelements[image.id]} />
      {/each}
    </div>
  </HasJS>
</div>
