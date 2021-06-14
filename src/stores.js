import { writable } from 'svelte/store'

export const config = writable({
  isAnswerForm: false,
  isAnswerFormBorder: true,
  isEnableInnerHTML: false,
  isEnableKatex: false,
  isHiddenAnswer: false,
  isHiddenSelection: false
})
export const qaSkipCount = writable(0)
export const qas = writable([])
