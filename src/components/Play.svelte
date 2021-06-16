<script>
  import { config, qas } from '../stores'

  if ($qas.length === 0) {
    window.location.href = '/#/'
  }

  let answer
  let contentAnswers = []
  let currentIndex = 0
  let isShowAnswer = false
  const myAnswers = Array($qas.length)
  const myResults = []

  function nextQuestion () {
    answer = ''
    contentAnswers = []
    isShowAnswer = false
    currentIndex++

    if (myAnswers.length === currentIndex) {
      return
    }

    if ($qas[currentIndex].content.type === 'exact-match-selection' && $qas[currentIndex].content.answers.length >= 2) {
      myAnswers[currentIndex] = []
    }
  }

  function okClick () {
    isShowAnswer = true
  }

  function pushToResultsAndReturn (v) {
    myResults.push(v)

    return v
  }
</script>

{#if myAnswers.length !== currentIndex}
<button onclick="window.location.href = '/#/'">戻る</button>
{#if $qas[currentIndex].type === 'fill'}
<p>
  ＜問 {currentIndex + 1}＞
  {$qas[currentIndex].content.text.replace(/\(\(.+?\)\)/, '()')}
  {#each $qas[currentIndex].content.answers as answer, i}
  <label>
    {i + 1}:
    <input bind:value={contentAnswers[i]} type="text">
  </label>
  {/each}
</p>
{#if !isShowAnswer}
<button on:click={okClick}>OK</button>
{:else}
<p>
  {#if $qas[currentIndex].content.answers.filter((v, i) => {
    return v === contentAnswers[i]
  }).length === $qas[currentIndex].content.answers.length}
  正解です！
  {:else}
  不正解です…
  {/if}
</p>
<button on:click={nextQuestion}>次の問題</button>
{/if}
{:else if $qas[currentIndex].type === 'qa'}
{#if $qas[currentIndex].content.type === 'exact-match'}
<p>
  ＜問 {currentIndex + 1}＞
  {#if !$config.isEnableInnerHTML}
  {$qas[currentIndex].content.question}
  {:else}
  <span bind:innerHTML={$qas[currentIndex].content.question} contenteditable="true"></span>
  {/if}
</p>
<textarea bind:value={answer} placeholder="答えを入力してください" />
{#if !isShowAnswer}
<br />
<button on:click={okClick}>OK</button>
{:else}
<p>
  {#if pushToResultsAndReturn($qas[currentIndex].content.answers.includes(answer))}
  正解です！
  {:else}
  不正解です…
  {/if}
</p>
<button on:click={nextQuestion}>次の問題</button>
{/if}
{:else if $qas[currentIndex].content.type === 'exact-match-selection'}
<p>＜問 {currentIndex + 1}＞ {$qas[currentIndex].content.question}</p>
{#if $qas[currentIndex].content.answers.length === 1}
<p>答えをひとつ選択してください</p>
{#each $qas[currentIndex].content.selections as selection, i}
<label>
  <input bind:group={myAnswers[currentIndex]} type="radio" value={i} />
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
  {#if pushToResultsAndReturn(myAnswers[currentIndex] === $qas[currentIndex].content.answers[0] - 1)}
  正解です！
  {:else}
  不正解です…
  {/if}
</p>
<button on:click={nextQuestion}>次の問題</button>
{/if}
{:else}
<p>答えを選択してください</p>
{#each $qas[currentIndex].content.selections as selection}
<label>
  <input bind:group={myAnswers[currentIndex]} type="checkbox" value={selection} />
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
  {#if pushToResultsAndReturn(myAnswers[currentIndex].join('') === $qas[currentIndex].content.answers.map(v =>
  $qas[currentIndex].content.selections[v - 1]).join(''))}
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
  {#each $qas as _, i}
  <li>{myResults[i] ? '正解' : '不正解'}</li>
  {/each}
</ol>
<button onclick="window.location.href = '/#/'">戻る</button>
{/if}
