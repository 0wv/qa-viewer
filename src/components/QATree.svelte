<script>
  import FillPrefix from './prefixes/FillPrefix.svelte'
  import QAPrefix from './prefixes/QAPrefix.svelte'
  import SectionPrefix from './prefixes/SectionPrefix.svelte'
  import TextPrefix from './prefixes/TextPrefix.svelte'

  const prefixComponentMap = {
    fill: FillPrefix,
    qa: QAPrefix,
    section: SectionPrefix,
    text: TextPrefix
  }

  export let qas
</script>

{#each qas as qa}
{#if qa.type in prefixComponentMap}
<svelte:component qa={qa} this={prefixComponentMap[qa.type]}></svelte:component>
{/if}
{/each}
