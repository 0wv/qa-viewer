<script>
  import { QAString } from '../parser'
  import { config } from '../stores'
  import HTMLCode from './HTMLCode.svelte'

  export let qa
</script>

<div class="bg-green-50 p-2 pt-4 rounded shadow">
  <span class="bg-green-200 p-2 rounded shadow-inner">答え</span>
  <ul class="mt-4">
    {#each qa.content.answers as answer}
    <li class="bg-green-100 mt-2 p-4 shadow-inner">
      {#if !$config.isEnableInnerHTML}
      {QAString.unescape(answer)}
      {:else}
      {#if qa.content.type === 'exact-match'}
      <HTMLCode value={QAString.unescape(answer)}></HTMLCode>
      {:else if qa.content.type === 'exact-match-selection'}
      <HTMLCode value={qa.content.selections[answer - 1]}></HTMLCode>
      {/if}
      {/if}
    </li>
    {/each}
  </ul>
</div>
