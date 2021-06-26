<script>
  import { config } from '../stores'
  import { QAString } from '../parser'
  import HTMLCode from './HTMLCode.svelte'
  import QAText from './QAText.svelte'

  export let qas
</script>

{#each qas as qa, i}
{#if qa.type === 'fill'}
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
{:else if qa.type === 'qa'}
<div class="question">
  {#if qa.content.type === 'exact-match'}
  <p>
    <span style="font-weight: bold;">＜問 {qa.questionIndex}＞</span>
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
    <span style="font-weight: bold;">＜問 {qa.questionIndex}＞</span>
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
{:else if qa.type === 'section'}
<QAText>
  <hr>
  {#if !$config.isEnableInnerHTML}
  {QAString.unescape(qa.content)}
  {:else}
  <HTMLCode value={QAString.unescape(qa.content)}></HTMLCode>
  {/if}
  <hr>
</QAText>
{:else if qa.type === 'text'}
<QAText>
  <p>
    {#if !$config.isEnableInnerHTML}
    {QAString.unescape(qa.content)}
    {:else}
    <HTMLCode value={QAString.unescape(qa.content)}></HTMLCode>
    {/if}
  </p>
</QAText>
{/if}
{/each}

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
