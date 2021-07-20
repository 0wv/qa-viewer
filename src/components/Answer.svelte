<script>
  import { QAString } from '../parser'
  import { config } from '../stores'

  export let qa
</script>

<div
  class="bg-green-50 leading-loose p-2 pt-4 rounded-2xl shadow"
  style="-webkit-print-color-adjust: exact;"
>
  <span class="bg-green-200 font-bold px-4 py-2 rounded-2xl shadow-inner">答え</span>
  <ul class="mt-4">
    {#each qa.content.answers as answer}
    <li class="bg-green-100 mt-2 px-4 py-2 rounded-2xl shadow-inner">
      {#if !$config.isEnableInnerHTML}
      {#if qa.content.type !== 'exact-match-selection'}
      {QAString.unescape(answer)}
      {:else}
      {QAString.unescape(qa.content.selections[answer - 1])}
      {/if}
      {:else}
      {#if qa.content.type === 'exact-match-selection'}
      {@html qa.content.selections[answer - 1]}
      {:else}
      {@html QAString.unescape(answer)}
      {/if}
      {/if}
    </li>
    {/each}
  </ul>
</div>
