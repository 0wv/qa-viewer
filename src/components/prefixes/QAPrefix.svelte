<script>
  import { QAString } from '../../parser'
  import { config } from '../../stores'
  import Answer from '../Answer.svelte'
  import HTMLCode from '../HTMLCode.svelte'
  import Question from '../Question.svelte'

  export let qa
</script>

<div class="question">
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
  <p><span style="font-weight: bold;">＜選択肢＞</span></p>
  <ol>
    {#each qa.content.selections as selection}
    <li>
      {#if !$config.isEnableInnerHTML}
      {QAString.unescape(selection)}
      {:else}
      <HTMLCode value={QAString.unescape(selection)}></HTMLCode>
      {/if}
    </li>
    {/each}
  </ol>
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
