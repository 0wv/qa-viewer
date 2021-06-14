<script>
  import { config } from '../stores'
  import { qaUnescape } from '../parser'
  import HTMLCode from './HTMLCode.svelte'

  export let qas
</script>

{#each qas as qa, i}
{#if qa.type === 'fill'}
<p>
  <span style="font-weight: bold;">＜問 {i + 1}＞</span>
  {qaUnescape(qa.content.text.replace(/\(\(.+?\)\)/, '()'))}
</p>
{#if !$config.isHiddenAnswer}
<p><span style="font-weight: bold;">＜答え＞</span></p>
<ol>
  {#each qa.content.answers as answer}
  <li>{qaUnescape(answer)}</li>
  {/each}
</ol>
{/if}
{:else if qa.type === 'qa'}
<div class="question">
  {#if qa.content.type === 'exact-match'}
  <p>
    <span style="font-weight: bold;">＜問 {i + 1}＞</span>
    {#if !$config.isEnableInnerHTML}
    {qaUnescape(qa.content.question)}
    {:else}
    <HTMLCode value={qaUnescape(qa.content.question)}></HTMLCode>
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
      {qaUnescape(answer)}
      {:else}
      <HTMLCode value={qaUnescape(answer)}></HTMLCode>
      {/if}
    </li>
    {/each}
  </ul>
  {/if}
  <br />
  {:else if qa.content.type === 'exact-match-selection'}
  <p>
    <span style="font-weight: bold;">＜問 {i + 1}＞</span>
    {#if !$config.isEnableInnerHTML}
    {qaUnescape(qa.content.question)}
    {:else}
    <HTMLCode value={qaUnescape(qa.content.question)}></HTMLCode>
    {/if}
  </p>
  {#if !$config.isHiddenSelection}
  <p><span style="font-weight: bold;">＜選択肢＞</span></p>
  <ol>
    {#each qa.content.selections as selection}
    <li>
      {#if !$config.isEnableInnerHTML}
      {qaUnescape(selection)}
      {:else}
      <HTMLCode value={qaUnescape(selection)}></HTMLCode>
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
      {qaUnescape(answer)}
      {:else}
      <HTMLCode value={qa.content.selections[answer - 1]}></HTMLCode>
      {/if}
    </li>
    {/each}
  </ul>
  {/if}
  <br />
  {/if}
</div>
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
