import { writable } from 'svelte/store'
import { get } from '../lib/api'
import { aggressivederived } from '../lib/helpers'

export const selectedimages = writable({})
export const selectednumber = aggressivederived(selectedimages, $selectedimages => Object.keys($selectedimages).length)
export const selectionmode = aggressivederived(selectednumber, $selectednumber => $selectednumber > 0)

export const images = writable([])
export const imagestotal = aggressivederived(images, $images => $images.length)
let $images
images.subscribe(imgs => { $images = imgs })

export const detailimage = writable(undefined)

function commonTags (images, getter) {
  const tagcount = {}
  for (const image of images) {
    for (const tag of getter(image) || []) {
      tagcount[tag.id] = ++tagcount[tag.id] || 1
    }
  }
  return Object.entries(tagcount).filter(([tag, count]) => count === images.length).map(([tag, count]) => tag)
}
export const editing = writable(false)
export const editorready = writable(false)
export const tags = writable([])
export const people = writable([])
export const editorpreload = aggressivederived(selectedimages, $selectedimages => {
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
