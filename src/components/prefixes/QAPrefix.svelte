<script>
  import { config } from '../../stores'
  import Answer from '../Answer.svelte'
  import AnswerBox from '../AnswerBox.svelte'
  import Question from '../Question.svelte'
  import Selection from '../Selection.svelte'

  export let qa
</script>

<div class="border mb-6 mx-4 p-4 question rounded-3xl shadow-md">
  {#if qa.content.type === 'exact-match'}
  <Question {qa}></Question>
  {#if $config.isAnswerForm}
  <AnswerBox></AnswerBox>
  {/if}
  {#if !$config.isHiddenAnswer}
  <Answer {qa}></Answer>
  {/if}
  {:else if qa.content.type === 'exact-match-selection'}
  <Question {qa}></Question>
  {#if !$config.isHiddenSelection}
  <Selection {qa}></Selection>
  {/if}
  {#if $config.isAnswerForm}
  <AnswerBox></AnswerBox>
  {/if}
  {#if !$config.isHiddenAnswer}
  <Answer {qa}></Answer>
  {/if}
  {/if}
</div>

<style>
  @media print {
    .question {
      page-break-inside: avoid;
    }
  }
</style>
