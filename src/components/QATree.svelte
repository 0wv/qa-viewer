<script>
  import { config } from '../stores'

  export let qas
</script>

{#each qas as qa, i}
  {#if qa.type === 'fill'}
    <p>
      <span style="font-weight: bold;">＜問 {i + 1}＞</span>
      {qa.content.text.replace(/\(\(.+?\)\)/, '()')}
    </p>
    {#if !$config.isHiddenAnswer}
      <p><span style="font-weight: bold;">＜答え＞</span></p>
      <ol>
        {#each qa.content.answers as answer}
          <li>{answer}</li>
        {/each}
      </ol>
    {/if}
  {:else if qa.type === 'qa'}
    <div class="question">
      {#if qa.content.type === 'exact-match'}
        <p>
          <span style="font-weight: bold;">＜問 {i + 1}＞</span>
          {#if !$config.isEnableInnerHTML}
            {qa.content.question}
          {:else}
            <span bind:innerHTML={qa.content.question} contenteditable />
          {/if}
        </p>
        {#if $config.isAnswerForm}
          <div class:answer-form-border={$config.isAnswerFormBorder} style="height: 2cm; margin-bottom: 1rem;" />
        {/if}
        {#if !$config.isHiddenAnswer}
          <p><span style="font-weight: bold;">＜答え＞</span></p>
          <ul>
            {#each qa.content.answers as answer}
              <li>
                {#if !$config.isEnableInnerHTML}
                  {answer}
                {:else}
                  <span bind:innerHTML={answer} contenteditable />
                {/if}
              </li>
            {/each}
          </ul>
        {/if}
        <br />
      {:else if qa.content.type === 'exact-match-selection'}
        <p>
          <span style="font-weight: bold;">＜問 {i + 1}＞</span>
          {#if !$config.isEnableInnerHTML}
            {qa.content.question}
          {:else}
            <span bind:innerHTML={qa.content.question} contenteditable />
          {/if}
        </p>
        {#if !$config.isHiddenSelection}
          <p><span style="font-weight: bold;">＜選択肢＞</span></p>
          <ol>
            {#each qa.content.selections as selection}
              <li>
                {#if !$config.isEnableInnerHTML}
                  {selection}
                {:else}
                  <span bind:innerHTML={selection} contenteditable />
                {/if}
              </li>
            {/each}
          </ol>
        {/if}
        {#if $config.isAnswerForm}
          <div class:answer-form-border={$config.isAnswerFormBorder} style="height: 2cm; margin-bottom: 1rem;" />
        {/if}
        {#if !$config.isHiddenAnswer}
          <p><span style="font-weight: bold;">＜答え＞</span></p>
          <ul>
            {#each qa.content.answers as answer}
              <li>
                {#if !$config.isEnableInnerHTML}
                  {answer}
                {:else}
                  <span bind:innerHTML={qa.content.selections[answer - 1]} contenteditable />
                {/if}
              </li>
            {/each}
          </ul>
        {/if}
        <br />
      {/if}
    </div>
  {/if}
{/each}

<style>
  @media print {
    .question {
      page-break-inside: avoid;
    }
  }

  .answer-form-border {
    border: 1px solid;
  }
</style>
