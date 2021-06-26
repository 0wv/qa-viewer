<script>
  import { QAString } from '../../parser'
  import { config } from '../../stores'

  export let qa
</script>

<p>
  <span style="font-weight: bold;">＜問 {qa.questionIndex}＞</span>
  {QAString.unescape(qa.content.text.replace(/\(\(.+?\)\)/, '()'))}
</p>
{#if !$config.isHiddenAnswer}
<p><span style="font-weight: bold;">＜答え＞</span></p>
<ol>
  {#each qa.content.answers as answer}
  <li>{QAString.unescape(answer)}</li>
  {/each}
</ol>
{/if}
