<script>
  import { QAString } from '../parser'
  import { config, user } from '../stores'

  export let dynamicColor = false
  export let qa
</script>

<div
  class="leading-loose mb-3 p-4 px-2 rounded-2xl shadow"
  class:bg-blue-50={!dynamicColor}
  class:bg-green-50={dynamicColor && $user.results[qa.meta.questionIndex - 1]}
  class:bg-red-50={dynamicColor && !$user.results[qa.meta.questionIndex - 1]}
  style="-webkit-print-color-adjust: exact;"
>
  <span
    class="font-bold mr-2 px-4 py-2 rounded-2xl"
    class:bg-blue-200={!dynamicColor}
    class:bg-green-200={dynamicColor && $user.results[qa.meta.questionIndex - 1]}
    class:bg-red-200={dynamicColor && !$user.results[qa.meta.questionIndex - 1]}
  >問 {qa.meta.questionIndex}</span>
  {#if !$config.isEnableInnerHTML}
  <span class="break-words whitespace-pre-line">
    {#if qa.type !== 'fill'}
    {QAString.unescape(qa.content.question)}
    {:else}
    {QAString.unescape(qa.content.text.replace(/\(\(.+?\)\)/, '()'))}
    {/if}
  </span>
  {:else}
  <span class="break-words whitespace-pre-line">
    {#if qa.type !== 'fill'}
    {@html QAString.unescape(qa.content.question)}
    {:else}
    {@html QAString.unescape(qa.content.text.replace(/\(\(.+?\)\)/, '()'))}
    {/if}
  </span>
  {/if}
</div>
