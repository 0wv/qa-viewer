<script>
    const fetchExample = (async () => {
      const responce = await fetch('/example-qa.txt')

      return await responce.text()
    })()
</script>

<button onclick="window.location.href = '/#/'">戻る</button>
<h1>ヘルプ</h1>
{#await fetchExample}
    <p>...waiting</p>
{:then text}
    <h2>例</h2>
    <button on:click={() => navigator.clipboard.writeText(text)}>例の内容をすべてコピー</button>
    <pre>
    <code>{text}</code>
</pre>
{/await}
