<script>
  import { QAString } from '../../parser'
  import { config } from '../../stores'
  import HTMLCode from '../HTMLCode.svelte'

  export let qa
</script>

<div>
  <hr>
  {#if !$config.isEnableInnerHTML}
  {QAString.unescape(qa.content)}
  {:else}
  <HTMLCode value={QAString.unescape(qa.content)}></HTMLCode>
  {/if}
  <hr>
</div>
