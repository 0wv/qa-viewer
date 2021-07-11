<script>
  import { QAString } from '../parser'
  import { config, user } from '../stores'
  import HTMLCode from './HTMLCode.svelte'

  export let qa
</script>

<div class="bg-yellow-50 leading-loose mb-3 p-2 pt-4 rounded-2xl shadow">
  {#if qa.content.answers.length === 1}
  <span class="bg-yellow-200 font-bold px-4 py-2 rounded-2xl shadow-inner">選択肢</span>
  <ol class="mt-4">
    {#each qa.content.selections as selection, i}
    <li class="bg-yellow-100 mt-2 px-4 py-2 rounded-2xl shadow-inner">
      <div class="float-left mr-2">
        <input bind:group={$user.answers[qa.meta.questionIndex - 1]} type="radio" value={i} />
      </div>
      {#if !$config.isEnableInnerHTML}
      {QAString.unescape(selection)}
      {:else}
      <HTMLCode value={QAString.unescape(selection)}></HTMLCode>
      {/if}
    </li>
    {/each}
  </ol>
  {:else}
  <span class="bg-yellow-200 font-bold px-4 py-2 rounded-2xl shadow-inner">選択肢</span>
  <ol class="mt-4">
    {#each qa.content.selections as selection, i}
    <li class="bg-yellow-100 mt-2 px-4 py-2 rounded-2xl shadow-inner">
      <div class="float-left mr-2">
        <input bind:group={$user.answers[qa.meta.questionIndex - 1]} type="checkbox" value={selection} />
      </div>
      {#if !$config.isEnableInnerHTML}
      {QAString.unescape(selection)}
      {:else}
      <HTMLCode value={QAString.unescape(selection)}></HTMLCode>
      {/if}
    </li>
    {/each}
  </ol>
  {/if}
</div>
