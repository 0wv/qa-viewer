<script>
  import { QAString } from '../../parser'
  import { config } from '../../stores'
  import Question from '../Question.svelte'

  export let qa
</script>

<Question {qa}></Question>
{#if !$config.isHiddenAnswer}
<p><span style="font-weight: bold;">＜答え＞</span></p>
<ol>
  {#each qa.content.answers as answer}
  <li>{QAString.unescape(answer)}</li>
  {/each}
</ol>
{/if}
