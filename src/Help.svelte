<script>
    const fetchExample = (async () => {
      const responce = await fetch('/example-qa.txt')
      const result = await responce.text()

      return result
    })()
</script>

<button onclick="window.location.href = '/#/'">戻る</button>
<h1>ヘルプ</h1>
{#await fetchExample}
    <p>...waiting</p>
{:then text}
    <button on:click={() => navigator.clipboard.writeText(text)}>例の内容をすべてコピー</button>
    <pre>
    <code>{text}</code>
</pre>
{/await}
