<script lang="ts">
  import { count as globalCount } from "./count";
  let count = 0;

  function handleClick() {
    count++;
  }

  export let server = false;
</script>

<h2>
  Box Two
  <span class:server class:hydrated={!server}>
    [{server ? "server" : "hydrated"}]
  </span>
</h2>

<p>I render local state as well as global state from a store</p>

<p>The count is {count}</p>

<button on:click={handleClick}>Increase local</button>

<div>
  <p>Global count:</p>

  <pre>{$globalCount}</pre>
</div>
