<script>
  import { QAString } from '../parser'
  import { config, user } from '../stores'
  import HTMLCode from './HTMLCode.svelte'

  export let dynamicColor = false
  export let qa
</script>

<div
  class="leading-loose mb-3 p-4 pl-2 rounded-2xl shadow"
  class:bg-blue-50={!dynamicColor}
  class:bg-green-50={dynamicColor && $user.results[qa.meta.questionIndex - 1]}
  class:bg-red-50={dynamicColor && !$user.results[qa.meta.questionIndex - 1]}
  style="-webkit-print-color-adjust: exact;"
>
  <span
    class="font-bold mr-2 px-4 py-2 rounded-2xl shadow-inner"
    class:bg-blue-200={!dynamicColor}
    class:bg-green-200={dynamicColor && $user.results[qa.meta.questionIndex - 1]}
    class:bg-red-200={dynamicColor && !$user.results[qa.meta.questionIndex - 1]}
  >問 {qa.meta.questionIndex}</span>
  {#if !$config.isEnableInnerHTML}
  <span class="break-words">
    {#if qa.type !== 'fill'}
    {QAString.unescape(qa.content.question)}
    {:else}
    {QAString.unescape(qa.content.text.replace(/\(\(.+?\)\)/, '()'))}
    {/if}
  </span>
  {:else}
  {#if qa.type !== 'fill'}
  <HTMLCode value={QAString.unescape(qa.content.question)}></HTMLCode>
  {:else}
  <HTMLCode value={QAString.unescape(qa.content.text.replace(/\(\(.+?\)\)/, '()'))}></HTMLCode>
  {/if}
  {/if}
</div>
