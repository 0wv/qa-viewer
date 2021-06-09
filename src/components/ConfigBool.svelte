<script>
  import { config } from '../stores.js'

  export let key
  export let value = false

  $config[key] = value
</script>

<label>
  <input bind:checked={$config[key]} type="checkbox" />
  <slot></slot>
</label>
