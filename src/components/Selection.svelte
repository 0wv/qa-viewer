<script>
  import { QAString } from '../parser'
  import { config } from '../stores'
  import HTMLCode from './HTMLCode.svelte'

  export let qa
</script>

<div class="bg-yellow-50 leading-loose mb-3 p-2 pt-4 rounded-2xl shadow">
  <span class="bg-yellow-200 px-4 py-2 rounded-2xl shadow-inner">選択肢</span>
  <ol class="mt-4">
    {#each qa.content.selections as selection}
    <li class="bg-yellow-100 mt-2 px-4 py-2 rounded-2xl shadow-inner">
      {#if !$config.isEnableInnerHTML}
      {QAString.unescape(selection)}
      {:else}
      <HTMLCode value={QAString.unescape(selection)}></HTMLCode>
      {/if}
    </li>
    {/each}
  </ol>
</div>
