<script>
	import TextSvg from '$lib/components/TextSvg.svelte';

	let containerRef;
	$effect(() => {
		console.log(containerRef.querySelector('svg'));
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<div bind:this={containerRef} class="relative">
	<TextSvg className="absolute" />
</div>
