<script>
	import { onMount } from "svelte";
	import { qas } from "./stores";
	import "@exampledev/new.css";

	let clipboardHandler, file;
	let isAnswerForm = false;
	let isHiddenAnswer = false;
	let isHiddenSelection = false;
	let playHandler;
	let printHandler;

	function parseQAString(qaString) {
		const result = qaString
			.replace(/\r?\n/g, "\n")
			.split("\n")
			.filter((v) => v !== "" && v[0] !== "#")
			.map((v) => v.split(":="))
			.filter((v) => v.length >= 2)
			.map((v) => [v[0].split(":-"), v.slice(1, v.length)])
			.map((v) => {
				const answers = v[1];
				const question = v[0][0];

				if (v[0].length >= 2) {
					const selections = v[0].slice(1, v[0].length);
					const result = {
						answers,
						question,
						selections,
						type: "exact-match-selection",
					};

					return result;
				} else {
					const result = {
						answers,
						question,
						type: "exact-match",
					};

					return result;
				}
			});

		return result;
	}

	onMount(() => {
		clipboardHandler.addEventListener("click", () => {
			navigator.clipboard
				.readText()
				.then((text) => {
					qas.set(parseQAString(text));
				})
				.catch((e) => {
					alert(e);
				});
		});

		file.addEventListener(
			"change",
			() => {
				const firstFile = file.files[0];

				if (firstFile.type === "text/plain") {
					const reader = new FileReader();

					reader.onload = (event) => {
						const result = event.target.result;
						qas.set(parseQAString(result));
					};

					reader.readAsText(firstFile);
				}
			},
			false
		);

		playHandler.addEventListener("click", () => {
			window.location.href = "/#/play";
		});

		printHandler.addEventListener("click", () => {
			window.print();
		});
	});
</script>

<svelte:head>
	<title>QA Viewer</title>
</svelte:head>

<header>
	<input bind:this={file} type="file" />
	<button bind:this={clipboardHandler}>クリップボードから読み込む</button>
	<button bind:this={printHandler}>印刷</button>
	<button bind:this={playHandler} disabled={$qas.length === 0}>Play!</button>
	<label>
		<input bind:checked={isHiddenSelection} type="checkbox" />
		選択肢を隠す
	</label>
	<label>
		<input bind:checked={isHiddenAnswer} type="checkbox" />
		答えを隠す
	</label>
	<label>
		<input bind:checked={isAnswerForm} type="checkbox" />
		解答欄を表示する
	</label>
</header>
{#each $qas as qa, i}
	{#if qa.type === "exact-match"}
		<p>
			<span style="font-weight: bold;">＜問 {i + 1}＞</span>
			{qa.question}
		</p>
		{#if isAnswerForm}
			<div style="border: 1px solid; height: 2cm; margin-bottom: 1rem;" />
		{/if}
		{#if !isHiddenAnswer}
			<p><span style="font-weight: bold;">＜答え＞</span></p>
			<ul>
				{#each qa.answers as answer}
					<li>{answer}</li>
				{/each}
			</ul>
		{/if}
		<br />
	{:else if qa.type === "exact-match-selection"}
		<p>
			<span style="font-weight: bold;">＜問 {i + 1}＞</span>
			{qa.question}
		</p>
		{#if !isHiddenSelection}
			<p><span style="font-weight: bold;">＜選択肢＞</span></p>
			<ol>
				{#each qa.selections as selection}
					<li>{selection}</li>
				{/each}
			</ol>
		{/if}
		{#if isAnswerForm}
			<div style="border: 1px solid; height: 2cm; margin-bottom: 1rem;" />
		{/if}
		{#if !isHiddenAnswer}
			<p><span style="font-weight: bold;">＜答え＞</span></p>
			<ul>
				{#each qa.answers as answer}
					<li>{qa.selections[answer - 1]}</li>
				{/each}
			</ul>
		{/if}
		<br />
	{/if}
{/each}

<style>
	@media print {
		header {
			display: none;
		}
	}
</style>
