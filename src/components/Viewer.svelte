<script>
  import { Base64 } from 'js-base64'
  import { onMount } from 'svelte'
  import { config, qas } from '../stores'
  import katex from 'katex'
  import * as zip from '@zip.js/zip.js'
  import '../../node_modules/katex/dist/katex.css'
  import '@exampledev/new.css'
  import ConfigBool from './ConfigBool.svelte'
  import QATree from './QATree.svelte'
  import {
    convertQAString,
    parseQAString,
    qaEscape,
    qasUnescape
  } from '../parser'

  let file

  function loadFromClipboard () {
    navigator.clipboard
      .readText()
      .then((text) => convertQAString(text))
      .then((text) => {
        if (!$config.isEnableKatex) {
          qas.set(parseQAString(text))
        } else {
          let result = text
          const matches = result.match(/\$.+?\$/g)

          matches.forEach((match) => {
            result = result.replace(match, qaEscape(katex.renderToString(match.slice(1).slice(0, -1), {
              output: 'html',
              throwOnError: false
            }).replace(/\n/g, '')))
          })

          qas.set(qasUnescape(parseQAString(result)))
        }
      })
      .catch((e) => {
        alert(e)
      })
  }

  onMount(() => {
    file.addEventListener('change', () => {
      const firstFile = file.files[0]

      if (firstFile.type === 'text/plain') {
        const reader = new FileReader()

        reader.onload = (event) => {
          const result = event.target.result

          if (!$config.isEnableKatex) {
            qas.set(parseQAString(result))
          } else {
            let newResult = result
            const matches = result.match(/\$.+?\$/g)

            matches.forEach((match) => {
              newResult = newResult.replace(match, qaEscape(katex.renderToString(match.slice(1).slice(0, -1), {
                output: 'html',
                throwOnError: false
              }).replace(/\n/g, '')))
            })

            qas.set(qasUnescape(parseQAString(newResult)))
          }
        }

        reader.readAsText(firstFile)
      } else if (firstFile.type === 'application/x-zip-compressed' || firstFile.type === 'application/zip') {
        const reader = new zip.ZipReader(new zip.BlobReader(firstFile))

        reader
          .getEntries()
          .then((entries) => entries.filter((entry) => entry.filename === 'main.txt')[0])
          .then((qaString) => {
            qaString
              .getData(new zip.TextWriter())
              .then((data) => {
                let result = data
                const matches = data.match(/\.\/[^\s]+/g)

                matches.forEach((match) => {
                  reader
                    .getEntries()
                    .then((entries) => entries.filter((entry) => `./${entry.filename}` === match)[0])
                    .then((matched) => {
                      if (!matched) {
                        return
                      }

                      matched
                        .getData(new zip.Uint8ArrayWriter())
                        .then((data) => {
                          result = result.replace(match, `<img src="data:image/png;base64,${Base64.fromUint8Array(data)}">`)
                          qas.set(parseQAString(result))
                        })
                    })
                })
              })
          })
      }
    }, false)
  })
</script>

<svelte:head>
  <title>QA Viewer</title>
</svelte:head>

<header>
  <h1>QA Viewer</h1>
  <hr>
  <input bind:this={file} type="file" />
  <button on:click={loadFromClipboard}>クリップボードから読み込む</button>
  <hr>
  <button on:click={() => { window.location.href = '/#/help' }}>ヘルプ</button>
  <button on:click={() => window.print()}>印刷</button>
  <button disabled={$qas.length === 0} on:click={() => { window.location.href = '/#/play' }}>Play!</button>
  <hr>
  <details>
    <summary>追加の設定</summary>
    <ConfigBool key="isHiddenSelection">選択肢を隠す</ConfigBool>
    <ConfigBool key="isHiddenAnswer">答えを隠す</ConfigBool>
    <ConfigBool key="isAnswerForm">解答欄を表示する</ConfigBool>
    <ConfigBool key="isEnableInnerHTML">innerHTMLを有効化</ConfigBool>
    <ConfigBool key="isEnableKatex">KaTeXを有効化</ConfigBool>
  </details>
</header>
<QATree></QATree>

<style>
  @media print {
    header {
      display: none;
    }
  }
</style>
