<script lang="ts">
  export let text: string = "default";
</script>

<div class="flex flex-col p-5 border border-slate-300 gap-5">
  <span>{text}</span>
  <slot />
</div>
