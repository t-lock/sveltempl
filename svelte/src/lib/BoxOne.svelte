<script lang="ts">
  import { count } from "./count";
  import PropText from "./PropText.svelte";
  import SlotText from "./SlotText.svelte";

  function handleClick() {
    $count++;
  }

  export let server = false;

  let ideas = ["shitty", "sucky", "swell", "super"];
</script>

<h2>
  Box One
  <span class:server class:hydrated={!server}>
    [{server ? "server" : "hydrated"}]
  </span>
</h2>
<p>I render global state from a store</p>
<p>The global count is {$count}</p>
<button on:click={handleClick}>Increase global</button>

<div class="flex flex-col gap-5">
  {#each ideas as idea, i}
    {@const even = i % 2 === 0}
    {#if even}
      <PropText text={idea} />
    {:else}
      <SlotText>{idea}</SlotText>
    {/if}
  {/each}
</div>

<style>
  h2, p {
    color: orchid;
  }
</style>
