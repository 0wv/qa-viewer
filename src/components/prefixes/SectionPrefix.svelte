<script>
  import { QAString } from '../../parser'
  import { config } from '../../stores'
  import HTMLCode from '../HTMLCode.svelte'

  export let qa
</script>

<div class="border-4 border-purple-200 bg-purple-50 leading-loose mb-6 p-4 pl-2 rounded-2xl shadow">
  {#if !$config.isEnableInnerHTML}
  {QAString.unescape(qa.content)}
  {:else}
  <HTMLCode value={QAString.unescape(qa.content)}></HTMLCode>
  {/if}
</div>
