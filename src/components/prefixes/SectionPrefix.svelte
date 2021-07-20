<script>
  import { QAString } from '../../parser'
  import { config } from '../../stores'

  export let qa
</script>

<div
  class="border-4 border-purple-200 bg-purple-50 font-bold leading-loose mb-6 mx-4 p-4 pl-2 question rounded-2xl shadow text-lg"
  style="-webkit-print-color-adjust: exact;"
>
  {#if !$config.isEnableInnerHTML}
  {QAString.unescape(qa.content)}
  {:else}
  {@html QAString.unescape(qa.content)}
  {/if}
</div>

<style>
  @media print {
    .question {
      page-break-inside: avoid;
    }
  }
</style>
