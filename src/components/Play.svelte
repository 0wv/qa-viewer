<script>
  import { qas, user } from '../stores'
  import { prefixMap } from '../parser'
  import AnswerTable from './AnswerTable.svelte'
  import InputAnswer from './InputAnswer.svelte'
  import InputSelection from './InputSelection.svelte'
  import Question from './Question.svelte'

  const filteredQAs = $qas.filter(v => (
    Object.keys(prefixMap)
      .filter(k => prefixMap[k].hasQuestionIndex)
      .includes(v.type)
  ))

  if (filteredQAs.length === 0) {
    window.location.href = '/#/'
  }

  let currentIndex = 0
  let isShowAnswer = false
  $user.answers = [...Array(filteredQAs.length)]
    .map((_, i) => (
      filteredQAs[i].type === 'qa'
        ? (
            filteredQAs[i].content.type === 'exact-match-selection' &&
            filteredQAs[i].content.answers.length >= 2
          )
            ? []
            : filteredQAs[i].content.type === 'exact-match-selection'
              ? 0
              : ''
        : filteredQAs[i].type === 'fill'
          ? Array(filteredQAs[i].content.answers.length).fill('')
          : undefined
    ))
  $user.results = []

  function checkAnswer () {
    return (
      filteredQAs[currentIndex].type === 'fill'
        ? filteredQAs[currentIndex].content.answers.filter((v, i) => (
          pushToResultsAndReturn(v === $user.answers[currentIndex][i])
        )).length === filteredQAs[currentIndex].content.answers.length
        : filteredQAs[currentIndex].type === 'qa'
          ? (
              filteredQAs[currentIndex].content.type === 'exact-match'
                ? pushToResultsAndReturn(
                  filteredQAs[currentIndex].content.answers.includes($user.answers[currentIndex])
                )
                : filteredQAs[currentIndex].content.type === 'exact-match-selection'
                  ? filteredQAs[currentIndex].content.answers.length === 1
                    ? (
                        pushToResultsAndReturn(
                          $user.answers[currentIndex] === filteredQAs[currentIndex].content.answers[0] - 1
                        )
                      )
                    : (
                        pushToResultsAndReturn(
                          $user.answers[currentIndex].join('') === filteredQAs[currentIndex].content.answers.map(v => (
                            filteredQAs[currentIndex].content.selections[v - 1])
                          ).join('')
                        )
                      )
                  : false
            )
          : false
    )
  }

  function nextQuestion () {
    isShowAnswer = false
    currentIndex++
  }

  function okClick () {
    isShowAnswer = true
  }

  function pushToResultsAndReturn (v) {
    $user.results.push(v)

    return v
  }
</script>

<div class="bg-gradient-to-br flex flex-col from-indigo-300 min-h-inherit to-blue-300 min-w-full">
  {#if $user.answers.length !== currentIndex}
  <nav class="bg-gray-50 bg-opacity-80 flex mb-3 px-4 py-2 shadow sticky top-0">
    <ul>
      <li>
        <button class="bg-gray-50 border-2 border-gray-400 px-4 py-2 rounded-full" onclick="window.location.href = '/#/'">戻る</button>
      </li>
    </ul>
  </nav>
  {#if filteredQAs[currentIndex].type === 'fill'}
  <div class="flex-grow mb-3 mx-4">
    <Question qa={filteredQAs[currentIndex]}></Question>
    <InputAnswer qa={filteredQAs[currentIndex]}></InputAnswer>
  </div>
  {#if !isShowAnswer}
  <div class="bg-gray-50 bg-opacity-80 bottom-0 px-4 py-2 shadow sticky">
    <button class="bg-gray-50 border-2 border-gray-400 px-4 py-2 rounded-full w-full" on:click={okClick}>OK</button>
  </div>
  {:else}
  <div class="bg-gray-50 bg-opacity-80 bottom-0 px-4 py-2 shadow sticky">
    <p>
      {#if checkAnswer()}
      すべて正解です！
      {:else}
      {$user.answers[currentIndex].length}個中{filteredQAs[currentIndex].content.answers.filter((v, i) => (
        v !== $user.answers[currentIndex][i]
      )).length}個不正解です…
      {/if}
    </p>
    <AnswerTable qa={filteredQAs[currentIndex]}></AnswerTable>
    <button class="bg-gray-50 border-2 border-gray-400 mt-2 px-4 py-2 rounded-full w-full" on:click={nextQuestion}>次の問題</button>
  </div>
  {/if}
  {:else if filteredQAs[currentIndex].type === 'qa'}
  {#if filteredQAs[currentIndex].content.type === 'exact-match'}
  <div class="flex-grow mb-3 mx-4">
    <Question qa={filteredQAs[currentIndex]}></Question>
    <InputAnswer qa={filteredQAs[currentIndex]}></InputAnswer>
  </div>
  {#if !isShowAnswer}
  <div class="bg-gray-50 bg-opacity-80 bottom-0 px-4 py-2 shadow sticky">
    <button class="bg-gray-50 border-2 border-gray-400 px-4 py-2 rounded-full w-full" on:click={okClick}>OK</button>
  </div>
  {:else}
  <div class="bg-gray-50 bg-opacity-80 bottom-0 px-4 py-2 shadow sticky">
    <p>
      {#if checkAnswer()}
      正解です！
      {:else}
      不正解です…
      {/if}
    </p>
    <AnswerTable qa={filteredQAs[currentIndex]}></AnswerTable>
    <button class="bg-gray-50 border-2 border-gray-400 mt-2 px-4 py-2 rounded-full w-full" on:click={nextQuestion}>次の問題</button>
  </div>
  {/if}
  {:else if filteredQAs[currentIndex].content.type === 'exact-match-selection'}
  {#if filteredQAs[currentIndex].content.answers.length === 1}
  <div class="flex-grow mb-3 mx-4">
    <Question qa={filteredQAs[currentIndex]}></Question>
    <InputSelection qa={filteredQAs[currentIndex]}></InputSelection>
  </div>
  {#if !isShowAnswer}
  <div class="bg-gray-50 bg-opacity-80 bottom-0 px-4 py-2 shadow sticky">
    <button class="bg-gray-50 border-2 border-gray-400 px-4 py-2 rounded-full w-full" on:click={okClick}>OK</button>
  </div>
  {:else}
  <div class="bg-gray-50 bg-opacity-80 bottom-0 px-4 py-2 shadow sticky">
    <p>
      {#if checkAnswer()}
      正解です！
      {:else}
      不正解です…
      {/if}
    </p>
    <AnswerTable qa={filteredQAs[currentIndex]}></AnswerTable>
    <button class="bg-gray-50 border-2 border-gray-400 mt-2 px-4 py-2 rounded-full w-full" on:click={nextQuestion}>次の問題</button>
  </div>
  {/if}
  {:else}
  <div class="flex-grow mb-3 mx-4">
    <Question qa={filteredQAs[currentIndex]}></Question>
    <InputSelection qa={filteredQAs[currentIndex]}></InputSelection>
  </div>
  {#if !isShowAnswer}
  <div class="bg-gray-50 bg-opacity-80 bottom-0 px-4 py-2 shadow sticky">
    <button class="bg-gray-50 border-2 border-gray-400 px-4 py-2 rounded-full w-full" on:click={okClick}>OK</button>
  </div>
  {:else}
  <div class="bg-gray-50 bg-opacity-80 bottom-0 px-4 py-2 shadow sticky">
    <p>
      {#if checkAnswer()}
      正解です！
      {:else}
      不正解です…
      {/if}
    </p>
    <AnswerTable qa={filteredQAs[currentIndex]}></AnswerTable>
    <button class="bg-gray-50 border-2 border-gray-400 mt-2 px-4 py-2 rounded-full w-full" on:click={nextQuestion}>次の問題</button>
  </div>
  {/if}
  {/if}
  {/if}
  {/if}
  {:else}
  <p>＜結果＞</p>
  <ol>
    {#each filteredQAs as _, i}
    <li>{$user.results[i] ? '正解' : '不正解'}</li>
    {/each}
  </ol>
  <button onclick="window.location.href = '/#/'">戻る</button>
  {/if}
</div>

<style>
  .min-h-inherit { min-height: inherit; }
</style>
