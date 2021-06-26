<script>
  import { config } from '../../stores'
  import Answer from '../Answer.svelte'
  import Question from '../Question.svelte'

  export let qa
</script>

<Question {qa}></Question>
{#if !$config.isHiddenAnswer}
<Answer {qa}></Answer>
{/if}
