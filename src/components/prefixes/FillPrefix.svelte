<script>
  import { config } from '../../stores'
  import Answer from '../Answer.svelte'
  import Question from '../Question.svelte'

  export let qa
</script>

<div class="border mb-6 mx-4 p-4 question rounded-3xl shadow-md">
  <Question {qa}></Question>
  {#if !$config.isHiddenAnswer}
  <Answer {qa}></Answer>
  {/if}
</div>

<style>
  @media print {
    .question {
      page-break-inside: avoid;
    }
  }
</style>
