<script>
  import { QAString } from '../../parser'
  import { config } from '../../stores'
  import HTMLCode from '../HTMLCode.svelte'
  import QAText from '../QAText.svelte'

  export let qa
</script>

<QAText>
  <p>
    {#if !$config.isEnableInnerHTML}
    {QAString.unescape(qa.content)}
    {:else}
    <HTMLCode value={QAString.unescape(qa.content)}></HTMLCode>
    {/if}
  </p>
</QAText>
