<script>
  import { QAString } from '../parser'
  import { config, user } from '../stores'

  export let qa
</script>

<div class="bg-yellow-50 leading-loose mb-3 p-2 pt-4 rounded-2xl shadow">
  {#if qa.content.answers.length === 1}
  <span class="bg-yellow-200 font-bold px-4 py-2 rounded-2xl">選択肢</span>
  <ol class="mt-4">
    {#each qa.content.selections as selection, i}
    <li
      class="bg-yellow-100 mt-2 px-4 py-2 ring-inset ring-yellow-300 rounded-2xl"
      class:ring-4={$user.answers[qa.meta.questionIndex - 1] === i}
      on:click={() => { $user.answers[qa.meta.questionIndex - 1] = i }}
    >
      <div class="float-left mr-2">
        <input bind:group={$user.answers[qa.meta.questionIndex - 1]} type="radio" value={i} />
      </div>
      {#if !$config.isEnableInnerHTML}
      {QAString.unescape(selection)}
      {:else}
      {@html QAString.unescape(selection)}
      {/if}
    </li>
    {/each}
  </ol>
  {:else}
  <span class="bg-yellow-200 font-bold px-4 py-2 rounded-2xl">選択肢</span>
  <ol class="mt-4">
    {#each qa.content.selections as selection, i}
    <li class="bg-yellow-100 mt-2 px-4 py-2 rounded-2xl">
      <div class="float-left mr-2">
        <input bind:group={$user.answers[qa.meta.questionIndex - 1]} type="checkbox" value={selection} />
      </div>
      {#if !$config.isEnableInnerHTML}
      {QAString.unescape(selection)}
      {:else}
      {@html QAString.unescape(selection)}
      {/if}
    </li>
    {/each}
  </ol>
  {/if}
</div>
