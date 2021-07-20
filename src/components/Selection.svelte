<script>
  import { QAString } from '../parser'
  import { config } from '../stores'

  export let qa
</script>

<div
  class="bg-yellow-50 leading-loose mb-3 p-2 pt-4 rounded-2xl shadow"
  style="-webkit-print-color-adjust: exact;"
>
  <span class="bg-yellow-200 font-bold px-4 py-2 rounded-2xl">選択肢</span>
  <ol class="mt-4">
    {#each qa.content.selections as selection}
    <li class="bg-yellow-100 mt-2 px-4 py-2 rounded-2xl">
      {#if !$config.isEnableInnerHTML}
      {QAString.unescape(selection)}
      {:else}
      {@html QAString.unescape(selection)}
      {/if}
    </li>
    {/each}
  </ol>
</div>
