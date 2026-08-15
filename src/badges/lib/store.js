import { writable } from 'svelte/store'

export const authReady = writable(false)
export const user = writable(null)
export const collected = writable({})
export const gpsDenied = writable(false)
