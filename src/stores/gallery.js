import { writable, derived } from 'svelte/store'
import { get } from '../lib/api'

export const selectedimages = writable({})
export const selectednumber = derived(selectedimages, $selectedimages => Object.keys($selectedimages).length)
export const selectionmode = derived(selectednumber, $selectednumber => $selectednumber > 0)

export const images = writable([])
export const imagestotal = derived(images, $images => $images.length)
let $images
images.subscribe(imgs => { $images = imgs })

export const detailimage = writable(undefined)

function commonTags (images, getter) {
  const tags = {}
  for (const image of images) {
    for (const tag of getter(image) || []) {
      tags[tag] = true
    }
  }
  return Object.keys(tags)
}
export const editing = writable(false)
export const editorready = writable(false)
export const tags = writable([])
export const people = writable([])
export const editorpreload = derived(selectedimages, $selectedimages => {
  const images = Object.values($selectedimages)
  const tags = commonTags(images, image => image.tags)
  const peoplerelated = commonTags(images, image => image.people_related)
  const peoplefeatured = commonTags(images, image => image.people_featured)
  return {
    tags,
    peoplerelated,
    peoplefeatured
  }
})

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

export async function beginEditing () {
  editorready.set(false)
  editing.set(true)
  tags.set(await get('tag'))
  people.set(await get('person'))
  editorready.set(true)
}
export function cancelEditing () {
  editing.set(false)
}
