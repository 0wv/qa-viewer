<script>
  import { QAString } from '../parser'
  import { config, qas, user } from '../stores'
  import HTMLCode from './HTMLCode.svelte'

  export let qa
</script>

<table
  class="bg-gray-50 border-2 border-b-0 border-gray-400 flex flex-col mb-2 shadow-md w-full"
>
  <thead>
    <tr class="border-b-4 border-gray-400 flex">
      {#if qa.type !== 'qa'}
      <th class="flex-initial px-4 py-2 w-16">番号</th>
      {/if}
      <th class="flex-1 px-4 py-2">入力した答え</th>
      <th class="flex-1 px-4 py-2">解答</th>
    </tr>
  </thead>
  {#if qa.type === 'fill'}
  <tbody>
    {#each qa.content.answers as answer, i}
    <tr class="border-b-2 border-gray-400 flex">
      <td class="flex-initial text-center px-4 py-2 w-16">{i + 1}</td>
      <td
        class="flex-1 px-4 py-2"
        class:bg-green-200={$qas[qa.meta.questionIndex - 1].content.answers[i] === $user.answers[qa.meta.questionIndex - 1][i]}
        class:bg-red-200={$qas[qa.meta.questionIndex - 1].content.answers[i] !== $user.answers[qa.meta.questionIndex - 1][i]}
        class:bg-opacity-50={typeof $user.results[i] === 'boolean'}
        class:text-green-600={$qas[qa.meta.questionIndex - 1].content.answers[i] === $user.answers[qa.meta.questionIndex - 1][i]}
        class:text-red-600={$qas[qa.meta.questionIndex - 1].content.answers[i] !== $user.answers[qa.meta.questionIndex - 1][i]}
      >{$user.answers[qa.meta.questionIndex - 1][i]}</td>
      <td
        class="flex-1 px-4 py-2"
        class:bg-green-200={$qas[qa.meta.questionIndex - 1].content.answers[i] !== $user.answers[qa.meta.questionIndex - 1][i]}
        class:bg-opacity-50={typeof $user.results[i] === 'boolean'}
        class:text-green-600={$qas[qa.meta.questionIndex - 1].content.answers[i] !== $user.answers[qa.meta.questionIndex - 1][i]}
      >
        {#if !$config.isEnableInnerHTML}
        {QAString.unescape(answer)}
        {:else}
        <HTMLCode value={QAString.unescape(answer)}></HTMLCode>
        {/if}
      </td>
    </tr>
    {/each}
  </tbody>
  {:else if qa.type === 'qa'}
  {#if qa.content.type === 'exact-match'}
  <tbody class="table">
    {#each qa.content.answers as answer, i}
    <tr class="border-b-2 border-gray-400">
      {#if i === 0}
      <td
        class="px-4 py-2"
        class:bg-green-200={qa.content.answers.includes($user.answers[qa.meta.questionIndex - 1])}
        class:bg-red-200={!qa.content.answers.includes($user.answers[qa.meta.questionIndex - 1])}
        class:bg-opacity-50={typeof $user.results[i] === 'boolean'}
        class:text-green-600={qa.content.answers.includes($user.answers[qa.meta.questionIndex - 1])}
        class:text-red-600={!qa.content.answers.includes($user.answers[qa.meta.questionIndex - 1])}
        rowspan={qa.content.answers.length}
        style="width: 50%;"
      >{$user.answers[qa.meta.questionIndex - 1]}</td>
      {/if}
      <td
        class="px-4 py-2"
        class:bg-green-200={!qa.content.answers.includes($user.answers[qa.meta.questionIndex - 1])}
        class:bg-opacity-50={typeof $user.results[i] === 'boolean'}
        class:text-green-600={!qa.content.answers.includes($user.answers[qa.meta.questionIndex - 1])}
        style="width: 50%;"
      >
        {#if !$config.isEnableInnerHTML}
        {QAString.unescape(answer)}
        {:else}
        {#if qa.content.type === 'exact-match-selection'}
        <HTMLCode value={qa.content.selections[answer - 1]}></HTMLCode>
        {:else}
        <HTMLCode value={QAString.unescape(answer)}></HTMLCode>
        {/if}
        {/if}
      </td>
    </tr>
    {/each}
  </tbody>
  {:else if qa.content.type === 'exact-match-selection'}
  {#if qa.content.answers.length === 1}
  <tbody class="table">
    <tr class="border-b-2 border-gray-400">
      <td
        class="px-4 py-2"
        class:bg-green-200={qa.content.answers[0] - 1 === $user.answers[qa.meta.questionIndex - 1]}
        class:bg-red-200={qa.content.answers[0] - 1 !== $user.answers[qa.meta.questionIndex - 1]}
        class:bg-opacity-50={typeof $user.results[qa.meta.questionIndex - 1] === 'boolean'}
        class:text-green-600={qa.content.answers[0] - 1 === $user.answers[qa.meta.questionIndex - 1]}
        class:text-red-600={qa.content.answers[0] - 1 !== $user.answers[qa.meta.questionIndex - 1]}
        style="width: 50%;"
      >{qa.content.selections[$user.answers[qa.meta.questionIndex - 1]]}</td>
      <td
        class="px-4 py-2"
        class:bg-green-200={qa.content.answers[0] - 1 === $user.answers[qa.meta.questionIndex - 1]}
        class:bg-opacity-50={typeof $user.results[qa.meta.questionIndex - 1] === 'boolean'}
        class:text-green-600={qa.content.answers[0] - 1 === $user.answers[qa.meta.questionIndex - 1]}
        style="width: 50%;"
      >
        {#if !$config.isEnableInnerHTML}
        {QAString.unescape(qa.content.selections[qa.content.answers[0] - 1])}
        {:else}
        <HTMLCode value={QAString.unescape(qa.content.selections[qa.content.answers[0] - 1])}></HTMLCode>
        {/if}
      </td>
    </tr>
  </tbody>
  {:else}
  <tbody class="table">
    {#each qa.content.answers as answer, i}
    <tr class="border-b-2 border-gray-400">
      {#if i === 0}
      <td
        class="px-4 py-2"
        class:bg-green-200={JSON.stringify(qa.content.answers.map(v => qa.content.selections[v - 1])) === JSON.stringify($user.answers[qa.meta.questionIndex - 1])}
        class:bg-red-200={JSON.stringify(qa.content.answers.map(v => qa.content.selections[v - 1])) !== JSON.stringify($user.answers[qa.meta.questionIndex - 1])}
        class:bg-opacity-50={typeof $user.results[qa.meta.questionIndex - 1] === 'boolean'}
        class:text-green-600={JSON.stringify(qa.content.answers.map(v => qa.content.selections[v - 1])) === JSON.stringify($user.answers[qa.meta.questionIndex - 1])}
        class:text-red-600={JSON.stringify(qa.content.answers.map(v => qa.content.selections[v - 1])) !== JSON.stringify($user.answers[qa.meta.questionIndex - 1])}
        rowspan={qa.content.answers.length}
        style="width: 50%;"
      >{$user.answers[qa.meta.questionIndex - 1]}</td>
      {/if}
      <td
        class="px-4 py-2"
        class:bg-green-200={JSON.stringify(qa.content.answers.map(v => qa.content.selections[v - 1])) !== JSON.stringify($user.answers[qa.meta.questionIndex - 1])}
        class:bg-opacity-50={typeof $user.results[qa.meta.questionIndex - 1] === 'boolean'}
        class:text-green-600={JSON.stringify(qa.content.answers.map(v => qa.content.selections[v - 1])) !== JSON.stringify($user.answers[qa.meta.questionIndex - 1])}
        style="width: 50%;"
      >
        {#if !$config.isEnableInnerHTML}
        {QAString.unescape(qa.content.selections[answer - 1])}
        {:else}
        <HTMLCode value={QAString.unescape(qa.content.selections[answer - 1])}></HTMLCode>
        {/if}
      </td>
    </tr>
    {/each}
  </tbody>
  {/if}
  {/if}
  {/if}
</table>
