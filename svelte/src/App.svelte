<script lang="ts">
  import { memory } from 'tdd-game/tdd_game_bg.wasm' // will this work?
  import { Universe, Direction, Cell, GameState } from 'tdd-game'
  import Sortable from 'sortablejs'
  import GameCell from './lib/GameCell.svelte'
  import GamePlayer from './lib/GamePlayer.svelte'
  import Controls from './lib/Controls.svelte'

  const universe = Universe.new()
  const width = universe.width()
  const height = universe.height()

  const cellsPtr = universe.cells()
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height)

  let count: number = 0
  const increment = () => {
    count += 1
  }

  // requestAnimationFrame(renderLoop)

  // function renderLoop() {
  //   // universe.tick()
  //   increment()
  //   requestAnimationFrame(renderLoop)
  // }
</script>

<main>
  <div class="cells">
    <!-- {#each cells as cell, index (`${index}-${cell}`)}
        <GameCell type={cell}>
          {#if index === universe.player_index()}
            <GamePlayer />
          {/if}
        </GameCell>
      {/each} -->
    {#each { length: 25 } as _, i}
      <GameCell type={Math.random() < 0.2 ? 1 : 0}>
        {#if i === universe.player_index()}
          <GamePlayer />
        {/if}
      </GameCell>
    {/each}
  </div>

  <Controls
    --margin-top="var(--size-4)"
    onStart={() => {}}
    onStop={() => {}}
    onReset={() => {}}
    onRecord={() => {}}
  />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .cells {
    --universe-width: 5;
    --universe-height: 5;
    --cell-width: var(--size-10);

    display: grid;
    grid-template-columns: repeat(var(--universe-width), var(--cell-width));
    grid-template-rows: repeat(var(--universe-height), var(--cell-width));
    grid-gap: var(--cell-gap);

    max-width: fit-content;
  }
</style>
