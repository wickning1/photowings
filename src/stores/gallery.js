import { writable, derived } from 'svelte/store'

export const selectedimages = writable({})
export const selectednumber = derived(selectedimages, $selectedimages => Object.keys($selectedimages).length)
export const selectionmode = derived(selectednumber, $selectednumber => $selectednumber > 0)

export const images = writable([])
export const imagestotal = derived(images, $images => $images.length)
let $images
images.subscribe(imgs => { $images = imgs })

export const detailimage = writable(undefined)

export function selectImage (image) {
  selectedimages.update(si => {
    si[image.id] = image
    return si
  })
}
export function selectAll () {
  selectedimages.update(si => {
    for (const image of $images) {
      si[image.id] = image
    }
    return si
  })
}
export function deselectAll () {
  selectedimages.set({})
}

export function detailView (image) {
  detailimage.set(image)
}
export function cancelDetailView () {
  detailimage.set(undefined)
}

export function beginEditingAll () {

}
