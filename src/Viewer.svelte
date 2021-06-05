<script>
	import { Base64 } from "js-base64";
	import { onMount } from "svelte";
	import { qas } from "./stores";
	import katex from "katex";
	import * as zip from "@zip.js/zip.js";
	import "../node_modules/katex/dist/katex.css";
	import "@exampledev/new.css";

	let clipboardHandler, file;
	let isAnswerForm = false;
	let isEnableInnerHTML = false;
	let isEnableKatex = false;
	let isHiddenAnswer = false;
	let isHiddenSelection = false;
	let playHandler;
	let printHandler;

	function helpClick() {
		window.location.href = "/#/help";
	}

	function parseQAString(qaString) {
		const result = convertQAString(qaString)
			.split("\n")
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

	function qaEscape(qaString) {
		const result = qaString.replace(/:-/g, "[:__colon_hyphen__:]");

		return result;
	}

	function qaUnescape(qas) {
		const result = qas.map((qa) => {
			if (qa.type === "exact-match") {
				const result = {
					answers: qa.answers.map((answer) =>
						answer.replace(/\[:__colon_hyphen__:\]/g, ":-")
					),
					question: qa.question.replace(
						/\[:__colon_hyphen__:\]/g,
						":-"
					),
					type: qa.type,
				};

				return result;
			} else if (qa.type === "exact-match-selection") {
				const result = {
					answers: qa.answers.map((answer) =>
						answer.replace(/\[:__colon_hyphen__:\]/g, ":-")
					),
					question: qa.question.replace(
						/\[:__colon_hyphen__:\]/g,
						":-"
					),
					selections: qa.selections.map((selection) =>
						selection.replace(/\[:__colon_hyphen__:\]/g, ":-")
					),
					type: qa.type,
				};

				return result;
			}
		});

		return result;
	}

	function convertQAString(qaString) {
		const result = qaString
			.replace(/\r?\n/g, "\n")
			.split("\n")
			.filter((v) => v !== "" && v[0] !== "#")
			.join("\n");

		return result;
	}

	onMount(() => {
		clipboardHandler.addEventListener("click", () => {
			navigator.clipboard
				.readText()
				.then((text) => convertQAString(text))
				.then((text) => {
					if (!isEnableKatex) {
						qas.set(parseQAString(text));
					} else {
						let result = text;
						const matches = result.match(/\$.+?\$/g);

						matches.forEach((match) => {
							result = result.replace(
								match,
								qaEscape(
									katex
										.renderToString(
											match.slice(1).slice(0, -1),
											{
												output: "html",
												throwOnError: false,
											}
										)
										.replace(/\n/g, "")
								)
							);
						});

						qas.set(qaUnescape(parseQAString(result)));
					}
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

						if (!isEnableKatex) {
							qas.set(parseQAString(result));
						} else {
							let newResult = result;
							const matches = result.match(/\$.+?\$/g);

							matches.forEach((match) => {
								newResult = newResult.replace(
									match,
									qaEscape(
										katex
											.renderToString(
												match.slice(1).slice(0, -1),
												{
													output: "html",
													throwOnError: false,
												}
											)
											.replace(/\n/g, "")
									)
								);
							});

							qas.set(qaUnescape(parseQAString(newResult)));
						}
					};

					reader.readAsText(firstFile);
				} else if (
					firstFile.type === "application/x-zip-compressed" ||
					firstFile.type === "application/zip"
				) {
					const reader = new zip.ZipReader(
						new zip.BlobReader(firstFile)
					);

					reader
						.getEntries()
						.then(
							(entries) =>
								entries.filter(
									(entry) => entry.filename === "main.txt"
								)[0]
						)
						.then((qaString) => {
							qaString
								.getData(new zip.TextWriter())
								.then((data) => {
									let result = data;
									const matches = data.match(/\.\/[^\s]+/g);

									matches.forEach((match) => {
										reader
											.getEntries()
											.then(
												(entries) =>
													entries.filter(
														(entry) =>
															`./${entry.filename}` ===
															match
													)[0]
											)
											.then((matched) => {
												if (!matched) {
													return;
												}

												matched
													.getData(
														new zip.Uint8ArrayWriter()
													)
													.then((data) => {
														result = result.replace(
															match,
															`<img src="data:image/png;base64,${Base64.fromUint8Array(
																data
															)}">`
														);
														qas.set(
															parseQAString(
																result
															)
														);
													});
											});
									});
								});
						});
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
	<button on:click={helpClick}>ヘルプ</button>
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
	<label>
		<input bind:checked={isEnableInnerHTML} type="checkbox" />
		innerHTMLを有効化
	</label>
	<label>
		<input bind:checked={isEnableKatex} type="checkbox" />
		KaTeXを有効化
	</label>
</header>
{#each $qas as qa, i}
	<div class="question">
		{#if qa.type === "exact-match"}
			<p>
				<span style="font-weight: bold;">＜問 {i + 1}＞</span>
				{#if !isEnableInnerHTML}
					{qa.question}
				{:else}
					<span bind:innerHTML={qa.question} contenteditable />
				{/if}
			</p>
			{#if isAnswerForm}
				<div
					style="border: 1px solid; height: 2cm; margin-bottom: 1rem;"
				/>
			{/if}
			{#if !isHiddenAnswer}
				<p><span style="font-weight: bold;">＜答え＞</span></p>
				<ul>
					{#each qa.answers as answer}
						<li>
							{#if !isEnableInnerHTML}
								{answer}
							{:else}
								<span bind:innerHTML={answer} contenteditable />
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
			<br />
		{:else if qa.type === "exact-match-selection"}
			<p>
				<span style="font-weight: bold;">＜問 {i + 1}＞</span>
				{#if !isEnableInnerHTML}
					{qa.question}
				{:else}
					<span bind:innerHTML={qa.question} contenteditable />
				{/if}
			</p>
			{#if !isHiddenSelection}
				<p><span style="font-weight: bold;">＜選択肢＞</span></p>
				<ol>
					{#each qa.selections as selection}
						<li>
							{#if !isEnableInnerHTML}
								{selection}
							{:else}
								<span
									bind:innerHTML={selection}
									contenteditable
								/>
							{/if}
						</li>
					{/each}
				</ol>
			{/if}
			{#if isAnswerForm}
				<div
					style="border: 1px solid; height: 2cm; margin-bottom: 1rem;"
				/>
			{/if}
			{#if !isHiddenAnswer}
				<p><span style="font-weight: bold;">＜答え＞</span></p>
				<ul>
					{#each qa.answers as answer}
						<li>
							{#if !isEnableInnerHTML}
								{answer}
							{:else}
								<span
									bind:innerHTML={qa.selections[answer - 1]}
									contenteditable
								/>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
			<br />
		{/if}
	</div>
{/each}

<style>
	@media print {
		header {
			display: none;
		}

		.question {
			page-break-inside: avoid;
		}
	}
</style>
