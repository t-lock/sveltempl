<script lang="ts">
  export let text = "";

  // TODO maybe type this in a declaration file injected with Vite?
  let { server, mode } = $$props;

  const colors = {
    ssr: "#75ADC7",
    hydrated: "#85C49B",
    csr: "#FFF099",
  };
</script>

<div
  style="background-color: {server
    ? colors.ssr
    : mode === 'csr'
      ? colors.csr
      : colors.hydrated}"
>
  {text}
</div>

<style>
  div {
    color: #242424;
    padding: 20px;
    border-radius: 6px;
  }
</style>
