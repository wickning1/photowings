import { writable, derived } from 'svelte/store'

export const selectedimages = writable({})
export const selectednumber = derived(selectedimages, $selectedimages => Object.keys($selectedimages).length)
export const selectionmode = derived(selectednumber, $selectednumber => $selectednumber > 0)
