import { writable } from 'svelte/store'

export const config = writable({
  isAnswerForm: false,
  isEnableInnerHTML: false,
  isEnableKatex: false,
  isHiddenAnswer: false,
  isHiddenSelection: false
})
export const qas = writable([])
