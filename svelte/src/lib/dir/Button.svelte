<script lang="ts">
  function handleClick() {
    alert("I am the nested button");
  }
</script>

<button on:click={handleClick}>The Nested Button</button>
