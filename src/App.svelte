<script>
	import { onMount } from 'svelte'

	let file, qas = []

	onMount(() => {
		file.addEventListener('change', () => {
			const firstFile = file.files[0]

			if (firstFile.type === 'text/plain') {
				const reader = new FileReader()

				reader.onload = event => {
					const result = event.target.result
					qas = result
						.split('\r\n')
						.filter(v => v !== '' && v[0] !== '#')
						.map(v => v.split(':='))
						.filter(v => v.length >= 2)
						.map(v => [v[0].split(':-'), v.slice(1, v.length)])
						.map(v => {
							const answers = v[1]
							const question = v[0][0]

							if (v[0].length >= 2) {
								const selections = v[0].slice(1, v[0].length)
								const result = {
									answers,
									question,
									selections,
									type: 'exact-match-selection',
								}

								return result
							} else {
								const result = {
									answers,
									question,
									type: 'exact-match',
								}

								return result
							}
						})
				}

				reader.readAsText(firstFile)
			}
		}, false)
	})
</script>

<main>
	<input bind:this={file} type="file">
	<ol>
		{#each qas as qa}
			{#if qa.type === 'exact-match'}
				<li>
					<p>問: {qa.question}</p>
					<p>答え:</p>
					<ul>
						{#each qa.answers as answer}
							<li>{answer}</li>
						{/each}
					</ul>
				</li>
			{:else if qa.type === 'exact-match-selection'}
				<li>
					<p>問: {qa.question}</p>
					<p>選択肢:</p>
					<ol>
						{#each qa.selections as selection}
							<li>{selection}</li>
						{/each}
					</ol>
					<p>答え:</p>
					<ul>
						{#each qa.answers as answer}
							<li>{qa.selections[answer]}</li>
						{/each}
					</ul>
				</li>
			{/if}
		{/each}
	</ol>
</main>

<style>
	/* pass */
</style>