<script>
  import { config } from '../stores.js'

  export let key
</script>

<label>
  <input bind:checked={$config[key]} type="checkbox" />
  <slot></slot>
</label>
