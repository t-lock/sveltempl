<script lang="ts">
  import { count } from "./count";

  function handleClick() {
    $count++;
  }

  export let server = false;
  export let name = "One";
</script>

<h2>
  Box {name}
  <span class:server class:hydrated={!server}>
    [{server ? "server" : "hydrated"}]
  </span>
</h2>
<p>I render global state from a store</p>
<p>The global count is {$count}</p>
<button on:click={handleClick}>Increase global</button>

<style>
  h2,
  p {
    color: orchid;
  }
</style>
