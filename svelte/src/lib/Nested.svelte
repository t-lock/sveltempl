<script lang="ts">
  import SlotText from "./SlotText.svelte";
</script>

<SlotText text="Top">
  <SlotText text="Middle">
    <SlotText text="Inner" />
  </SlotText>
</SlotText>
