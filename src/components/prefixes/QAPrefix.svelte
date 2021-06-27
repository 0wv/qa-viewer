<script>
  import { config } from '../../stores'
  import Answer from '../Answer.svelte'
  import Question from '../Question.svelte'
  import Selection from '../Selection.svelte'

  export let qa
</script>

<div class="border mb-6 p-4 question rounded-3xl shadow-md">
  {#if qa.content.type === 'exact-match'}
  <Question {qa}></Question>
  {#if $config.isAnswerForm}
  <div class:answer-form-border={$config.isAnswerFormBorder} style="height: 2cm; margin-bottom: 1rem;" />
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
  <div class:answer-form-border={$config.isAnswerFormBorder} style="height: 2cm; margin-bottom: 1rem;" />
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

  .answer-form-border {
    border: 1px solid;
  }
</style>
