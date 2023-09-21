<script>
  let count = 1

  const increment = () => (count += 1)
</script>

<main>
  <button style="" on:click={increment}>Rerender</button>

  {#key count}
    <div class="cells">
      {#each { length: 25 } as _, i}
        <div class="cell {Math.random() < 0.2 ? 'lava' : 'floor'}" />
      {/each}
    </div>
  {/key}
</main>

<style>
  main {
    width: 500px;
  }
  .cells {
    --universe-width: 5;
    --universe-height: 5;
    --cell-gap: 8px;

    max-width: fit-content;

    display: grid;
    grid-template-columns: repeat(var(--universe-width), 1fr);
    grid-template-rows: repeat(var(--universe-height), 1fr);
    grid-gap: var(--cell-gap);
  }

  .cell {
    --cell-size: calc(12 * 4px);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
    width: var(--cell-size);
    height: var(--cell-size);
  }

  .floor {
    --floor-color: oklch(74% 0 52.94);

    background-color: var(--floor-color);
  }

  .lava {
    --lava-color: oklch(70% 0.227 38.12);
    background-color: var(--lava-color);
  }
</style>
