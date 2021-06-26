<script>
  import { config } from '../../stores'
  import Answer from '../Answer.svelte'
  import Question from '../Question.svelte'

  export let qa
</script>

<div class="border mb-6 p-4 rounded-3xl shadow-md">
  <Question {qa}></Question>
  {#if !$config.isHiddenAnswer}
  <Answer {qa}></Answer>
  {/if}
</div>
