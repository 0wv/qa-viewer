<script>
  import { Base64 } from 'js-base64'
  import { onMount } from 'svelte'
  import { config, qas } from '../stores'
  import katex from 'katex'
  import * as zip from '@zip.js/zip.js'
  import '../../node_modules/katex/dist/katex.css'
  import ConfigBool from './ConfigBool.svelte'
  import QATree from './QATree.svelte'
  import { QAString } from '../parser'

  let file

  function loadFromClipboard () {
    navigator.clipboard
      .readText()
      .then(text => (new QAString(text)).format())
      .then(qaString => {
        if (!$config.isEnableKatex) {
          qas.set(qaString.items)
        } else {
          let result = qaString
          const matches = result.match(/\$.+?\$/g)

          matches.forEach(match => {
            result = result.replace(match, QAString.escape(katex.renderToString(match.slice(1).slice(0, -1), {
              output: 'html',
              throwOnError: false
            }).replace(/\n/g, '')))
          })

          qas.set(QAString.unescapeItems((new QAString(result)).format().items))
        }
      })
  }

  onMount(() => {
    file.addEventListener('change', () => {
      const firstFile = file.files[0]

      if (firstFile.type === 'text/plain') {
        const reader = new FileReader()

        reader.onload = event => {
          const result = event.target.result

          if (!$config.isEnableKatex) {
            qas.set((new QAString(result)).format().items)
          } else {
            let newResult = result
            const matches = result.match(/\$.+?\$/g)

            matches.forEach((match) => {
              newResult = newResult.replace(match, QAString.escape(katex.renderToString(match.slice(1).slice(0, -1), {
                output: 'html',
                throwOnError: false
              }).replace(/\n/g, '')))
            })

            qas.set((new QAString(newResult)).format().items)
          }
        }

        reader.readAsText(firstFile)
      } else if (
        firstFile.type === 'application/x-zip-compressed' ||
        firstFile.type === 'application/zip' ||
        /\.qax$/.test(firstFile.name)
      ) {
        const reader = new zip.ZipReader(new zip.BlobReader(firstFile))

        reader
          .getEntries()
          .then(entries => entries.filter(entry => entry.filename === 'main.txt')[0])
          .then(qaString => {
            qaString
              .getData(new zip.TextWriter())
              .then(data => {
                const result = data
                let newResult = result

                if ($config.isEnableKatex) {
                  const katexExpressionMatches = newResult.match(/\$.+?\$/g)

                  katexExpressionMatches.forEach((match) => {
                    newResult = newResult.replace(match, QAString.escape(katex.renderToString(match.slice(1).slice(0, -1), {
                      output: 'html',
                      throwOnError: false
                    }).replace(/\n/g, '')))
                  })
                }

                const filePathMatches = data.match(/\.\/[^\s]+/g) || []

                if (filePathMatches.length !== 0) {
                  filePathMatches.forEach(match => {
                    reader
                      .getEntries()
                      .then(entries => entries.filter(entry => `./${entry.filename}` === match)[0])
                      .then(matched => {
                        if (!matched) {
                          return
                        }

                        matched
                          .getData(new zip.Uint8ArrayWriter())
                          .then(data => {
                            newResult = newResult.replace(match, `<img class="display-block mx-auto my-4" src="data:image/png;base64,${Base64.fromUint8Array(data)}">`)
                            qas.set((new QAString(newResult)).format().items)
                          })
                      })
                  })
                } else {
                  qas.set((new QAString(result)).format().items)
                }
              })
          })
      }
    }, false)
  })
</script>

<svelte:head>
  <title>QA Viewer</title>
</svelte:head>

<header class="bg-gray-50 bg-opacity-80 mb-3 px-4 py-2 shadow sticky top-0">
  <h1
    class="text-4xl"
    style="font-family: 'Chelsea Market', cursive;"
  >QA Viewer</h1>
  <details class="border-l-4 border-gray-500 my-2 px-2 py-1" open>
    <summary>メニュー</summary>
    <details class="border-l-4 border-red-500 my-2 px-2 py-1" open>
      <summary>入力</summary>
      <div class="my-1">
        <input
          bind:this={file}
          class="px-4 py-2 max-w-full"
          type="file"
        >
      </div>
      <div class="my-1">
        <button
          class="px-4 py-2 max-w-full"
          on:click={loadFromClipboard}
        >クリップボードから読み込む</button>
      </div>
    </details>
    <details class="border-l-4 border-green-500 my-2 px-2 py-1" open>
      <summary>出力</summary>
      <div class="my-1">
        <button
          class="px-4 py-2 max-w-full"
          disabled={$qas.length === 0}
          on:click={() => { window.location.href = '/#/play' }}
        >Play!</button>
      </div>
      <div class="my-1">
        <button
          class="px-4 py-2 max-w-full"
          on:click={() => window.print()}
        >印刷</button>
      </div>
    </details>
    <details class="border-l-4 border-blue-500 my-2 px-2">
      <summary>設定</summary>
      <ConfigBool key="isHiddenSelection">選択肢を隠す</ConfigBool>
      <ConfigBool key="isHiddenAnswer">答えを隠す</ConfigBool>
      <ConfigBool key="isAnswerForm">解答欄を表示する</ConfigBool>
      {#if $config.isAnswerForm}
      <details>
        <summary>詳細設定</summary>
        <ConfigBool key="isAnswerFormBorder">解答欄をボーダーで囲む</ConfigBool>
      </details>
      {/if}
      <ConfigBool key="isEnableInnerHTML">innerHTMLを有効化</ConfigBool>
      <ConfigBool key="isEnableKatex">KaTeXを有効化</ConfigBool>
    </details>
    <div class="my-1">
      <button
        class="px-4 py-2 max-w-full"
        on:click={() => { window.location.href = '/#/help' }}
      >ヘルプ</button>
    </div>
  </details>
</header>
<QATree qas={$qas}></QATree>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Chelsea+Market&display=swap');

  @media print {
    header {
      display: none;
    }
  }
</style>
