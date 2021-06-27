<script>
  import { QAString } from '../parser'
  import { config } from '../stores'
  import HTMLCode from './HTMLCode.svelte'

  export let qa
</script>

<div class="bg-blue-50 mb-3 p-4 pl-2 rounded-2xl shadow">
  <span class="bg-blue-200 mr-2 px-4 py-2 rounded-2xl shadow-inner">問 {qa.meta.questionIndex}</span>
  {#if !$config.isEnableInnerHTML}
  {#if qa.type !== 'fill'}
  {QAString.unescape(qa.content.question)}
  {:else}
  {QAString.unescape(qa.content.text.replace(/\(\(.+?\)\)/, '()'))}
  {/if}
  {:else}
  {#if qa.type !== 'fill'}
  <HTMLCode value={QAString.unescape(qa.content.question)}></HTMLCode>
  {:else}
  <HTMLCode value={QAString.unescape(qa.content.text.replace(/\(\(.+?\)\)/, '()'))}></HTMLCode>
  {/if}
  {/if}
</div>
