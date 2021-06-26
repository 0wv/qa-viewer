<script>
  import { QAString } from '../../parser'
  import { config } from '../../stores'
  import HTMLCode from '../HTMLCode.svelte'

  export let qa
</script>

<div class="question">
  {#if qa.content.type === 'exact-match'}
  <p>
    <span style="font-weight: bold;">＜問 {qa.meta.questionIndex}＞</span>
    {#if !$config.isEnableInnerHTML}
    {QAString.unescape(qa.content.question)}
    {:else}
    <HTMLCode value={QAString.unescape(qa.content.question)}></HTMLCode>
    {/if}
  </p>
  {#if $config.isAnswerForm}
  <div class:answer-form-border={$config.isAnswerFormBorder} style="height: 2cm; margin-bottom: 1rem;" />
  {/if}
  {#if !$config.isHiddenAnswer}
  <p><span style="font-weight: bold;">＜答え＞</span></p>
  <ul>
    {#each qa.content.answers as answer}
    <li>
      {#if !$config.isEnableInnerHTML}
      {QAString.unescape(answer)}
      {:else}
      <HTMLCode value={QAString.unescape(answer)}></HTMLCode>
      {/if}
    </li>
    {/each}
  </ul>
  {/if}
  <br>
  {:else if qa.content.type === 'exact-match-selection'}
  <p>
    <span style="font-weight: bold;">＜問 {qa.meta.questionIndex}＞</span>
    {#if !$config.isEnableInnerHTML}
    {QAString.unescape(qa.content.question)}
    {:else}
    <HTMLCode value={QAString.unescape(qa.content.question)}></HTMLCode>
    {/if}
  </p>
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
  <p><span style="font-weight: bold;">＜答え＞</span></p>
  <ul>
    {#each qa.content.answers as answer}
    <li>
      {#if !$config.isEnableInnerHTML}
      {QAString.unescape(answer)}
      {:else}
      <HTMLCode value={qa.content.selections[answer - 1]}></HTMLCode>
      {/if}
    </li>
    {/each}
  </ul>
  {/if}
  <br>
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
