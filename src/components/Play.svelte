<script>
  import { config, qas, user } from '../stores'
  import { prefixMap } from '../parser'
  import InputAnswer from './InputAnswer.svelte'
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
          ? []
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

{#if $user.answers.length !== currentIndex}
<nav class="bg-gray-50 flex mb-3 px-4 py-2 shadow">
  <ul>
    <li>
      <button class="bg-gray-200 px-4 py-2 rounded-full" onclick="window.location.href = '/#/'">戻る</button>
    </li>
  </ul>
</nav>
{#if filteredQAs[currentIndex].type === 'fill'}
<div class="mb-3 mx-4">
  <Question qa={filteredQAs[currentIndex]}></Question>
  <InputAnswer qa={filteredQAs[currentIndex]}></InputAnswer>
</div>
{#if !isShowAnswer}
<div class="mx-4">
  <button class="bg-gray-50 px-4 py-2 rounded-full shadow-md w-full" on:click={okClick}>OK</button>
</div>
{:else}
<p>
  {#if checkAnswer()}
  正解です！
  {:else}
  不正解です…
  {/if}
</p>
<button on:click={nextQuestion}>次の問題</button>
{/if}
{:else if filteredQAs[currentIndex].type === 'qa'}
{#if filteredQAs[currentIndex].content.type === 'exact-match'}
<p>
  <Question qa={filteredQAs[currentIndex]}></Question>
</p>
<textarea bind:value={$user.answers[currentIndex]} placeholder="答えを入力してください" />
{#if !isShowAnswer}
<br />
<button on:click={okClick}>OK</button>
{:else}
<p>
  {#if checkAnswer()}
  正解です！
  {:else}
  不正解です…
  {/if}
</p>
<button on:click={nextQuestion}>次の問題</button>
{/if}
{:else if filteredQAs[currentIndex].content.type === 'exact-match-selection'}
<p><Question qa={filteredQAs[currentIndex]}></Question></p>
{#if filteredQAs[currentIndex].content.answers.length === 1}
<p>答えをひとつ選択してください</p>
{#each filteredQAs[currentIndex].content.selections as selection, i}
<label>
  <input bind:group={$user.answers[currentIndex]} type="radio" value={i} />
  {#if !$config.isEnableInnerHTML}
  {selection}
  {:else}
  <span bind:innerHTML={selection} contenteditable="true"></span>
  {/if}
</label>
{/each}
{#if !isShowAnswer}
<button on:click={okClick}>OK</button>
{:else}
<p>
  {#if checkAnswer()}
  正解です！
  {:else}
  不正解です…
  {/if}
</p>
<button on:click={nextQuestion}>次の問題</button>
{/if}
{:else}
<p>答えを選択してください</p>
{#each filteredQAs[currentIndex].content.selections as selection}
<label>
  <input bind:group={$user.answers[currentIndex]} type="checkbox" value={selection} />
  {#if !$config.isEnableInnerHTML}
  {selection}
  {:else}
  <span bind:innerHTML={selection} contenteditable="true"></span>
  {/if}
</label>
{/each}
{#if !isShowAnswer}
<button on:click={okClick}>OK</button>
{:else}
<p>
  {#if checkAnswer()}
  正解です！
  {:else}
  不正解です…
  {/if}
</p>
<button on:click={nextQuestion}>次の問題</button>
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
