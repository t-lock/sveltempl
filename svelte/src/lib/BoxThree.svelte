<script lang="ts">
  import { onMount } from "svelte";

  export let server = false;

  let mounted = false;

  // this async function won't RUN on the server when called with {#await}
  async function getTlock() {
    const tlock = (
      await fetch("https://api.github.com/users/t-lock", {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      })
    ).json();
    return tlock;
  }

  // but this lifecycle method won't even get PARSED on the server (skipped at compile time)
  onMount(async () => {
    mounted = true;
  });
</script>

<h2>
  Box Three
  <span class:server class:hydrated={!server}>
    [{server ? "server" : "hydrated"}]
  </span>
</h2>
<p>The following is dynamic content</p>

{#if !mounted}
  <p>Component Not Mounted</p>
{:else}
  <p>Component Mounted</p>
{/if}

{#await getTlock()}
  <p>fetching...</p>
{:then tlock}
  <div>
    <pre>
      {JSON.stringify(tlock, null, 2)}
    </pre>
  </div>
{/await}
