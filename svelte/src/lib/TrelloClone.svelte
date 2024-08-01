<script lang="ts">
  // This is done in a single file for clarity. A more factored version here: https://svelte.dev/repl/288f827275db4054b23c437a572234f6?version=3.38.2
  import { dndzone } from "svelte-dnd-action";
  import { flip } from "svelte/animate";

  const colors = ["#75ADC7", "#85C49B", "#E0B386", "#D48D98", "#FFF099"];

  let board = [
    {
      id: 1,
      name: "TODO",
      items: [
        { id: 41, name: "item41", color: colors[0] },
        { id: 42, name: "item42", color: colors[1] },
        { id: 43, name: "item43", color: colors[2] },
        { id: 44, name: "item44", color: colors[3] },
        { id: 45, name: "item45", color: colors[4] },
        { id: 46, name: "item46", color: colors[0] },
        { id: 47, name: "item47", color: colors[1] },
        { id: 48, name: "item48", color: colors[2] },
        { id: 49, name: "item49", color: colors[3] },
      ],
    },
    {
      id: 2,
      name: "DOING",
      items: [],
    },
    {
      id: 3,
      name: "DONE",
      items: [],
    },
  ];

  let columnItems = board;

  const flipDurationMs = 200;
  function handleDndConsiderColumns(e: any) {
    columnItems = e.detail.items;
  }
  function handleDndFinalizeColumns(e: any) {
    columnItems = e.detail.items;
  }
  function handleDndConsiderCards(cid: any, e: any) {
    const colIdx = columnItems.findIndex((c) => c.id === cid);
    columnItems[colIdx].items = e.detail.items;
    columnItems = [...columnItems];
  }
  function handleDndFinalizeCards(cid: any, e: any) {
    const colIdx = columnItems.findIndex((c) => c.id === cid);
    columnItems[colIdx].items = e.detail.items;
    columnItems = [...columnItems];
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<section
  class="board"
  use:dndzone={{ items: columnItems, flipDurationMs, type: "columns" }}
  on:consider={handleDndConsiderColumns}
  on:finalize={handleDndFinalizeColumns}
>
  {#each columnItems as column (column.id)}
    <div class="column" animate:flip={{ duration: flipDurationMs }}>
      <div class="column-title">{column.name}</div>
      <div
        class="column-content"
        use:dndzone={{ items: column.items, flipDurationMs }}
        on:consider={(e) => handleDndConsiderCards(column.id, e)}
        on:finalize={(e) => handleDndFinalizeCards(column.id, e)}
      >
        {#each column.items as item (item.id)}
          <div
            class="card"
            animate:flip={{ duration: flipDurationMs }}
            style="background-color: {item.color}"
          >
            {item.name}
          </div>
        {/each}
      </div>
    </div>
  {/each}
</section>

<style>
  .board {
    height: 90vh;
    width: 100%;
    padding: 0.5em;
    margin-bottom: 40px;
  }
  .column {
    height: 100%;
    width: 250px;
    padding: 0.5em;
    margin: 1em;
    float: left;
    border: 1px solid #6b6b6b;
    /*Notice we make sure this container doesn't scroll so that the title stays on top and the dndzone inside is scrollable*/
    overflow-y: hidden;
  }
  .column-content {
    height: 100%;
    /* Notice that the scroll container needs to be the dndzone if you want dragging near the edge to trigger scrolling */
    overflow-y: scroll;
  }
  .column-title {
    margin-bottom: 1em;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .card {
    min-height: 40px;
    /* width: 100%; */
    margin: 0.4em 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333333;
    border-radius: 6px;
  }
</style>
