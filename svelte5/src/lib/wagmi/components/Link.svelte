<script lang="ts">
  import toast_ from "svelte-hot-french-toast";

  const { href, description }: { href: string; description: string } = $props();
</script>

<a {href} target="_blank"><span class="text-gray-400 text-sm italic">{description}</span></a>
