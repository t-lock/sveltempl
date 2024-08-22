<script lang="ts">
  import { dndzone } from "svelte-dnd-action";
  import { flip } from "svelte/animate";

  type Board = Col[];

  type Col = {
    id: number;
    name: string;
    items: Item[];
  };

  type Item = {
    id: number;
    name: string;
    color: string;
  };

  export let board: Board = [];

  const flipDurationMs = 200;

  function handleDndConsiderColumns(e: any) {
    board = e.detail.items;
  }

  function handleDndFinalizeColumns(e: any) {
    board = e.detail.items;
    handleBake()
  }

  function handleDndConsiderCards(cid: any, e: any) {
    const colIdx = board.findIndex((c) => c.id === cid);
    board[colIdx].items = e.detail.items;
    board = [...board];
  }

  function handleDndFinalizeCards(cid: any, e: any) {
    const colIdx = board.findIndex((c) => c.id === cid);
    board[colIdx].items = e.detail.items;
    board = [...board];
    handleBake()
  }

  async function handleBake() {
    try {
      const response = await fetch("/api/updateBoard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(board),
      });

      if (!response.ok) {
        console.error(response);
        console.error(await response.json());
      }
    } catch (error) {
      console.error(error);
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<section
  class="board"
  use:dndzone={{ items: board, flipDurationMs, type: "columns" }}
  on:consider={handleDndConsiderColumns}
  on:finalize={handleDndFinalizeColumns}
>
  {#each board as column (column.id)}
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
