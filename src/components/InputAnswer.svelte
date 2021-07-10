<script>
  import { user } from '../stores'

  export let qa
</script>

<div class="bg-indigo-50 leading-loose p-2 pt-4 rounded-2xl shadow">
  <span class="bg-indigo-200 px-4 py-2 rounded-2xl shadow-inner">答えを入力してください</span>
  {#if qa.type === 'fill'}
  <ul class="mt-2">
    {#each qa.content.answers as _, i}
    <li>
      <div class="flex">
        <div class="bg-gradient-to-br flex-initial from-blue-200 mr-2 mt-2 px-4 py-2 rounded shadow-md to-indigo-200">{i + 1}</div>
        <div class="flex-auto">
          <input
            bind:value={$user.answers[qa.meta.questionIndex - 1][i]}
            class="bg-indigo-100 mt-2 border-0 px-4 py-2 rounded-2xl shadow-inner w-full"
            type="text"
          >
        </div>
      </div>
    </li>
    {/each}
  </ul>
  {:else if qa.type === 'qa' && qa.content.type === 'exact-match'}
  <input
    bind:value={$user.answers[qa.meta.questionIndex - 1]}
    class="bg-indigo-100 mt-2 border-0 px-4 py-2 rounded-2xl shadow-inner w-full"
    type="text"
  >
  {/if}
</div>
