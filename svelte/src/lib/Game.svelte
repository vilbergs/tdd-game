<script lang="ts">
  import { memory } from 'tdd-game/tdd_game_bg.wasm' // will this work?
  import { Universe, Direction, Cell, GameState } from 'tdd-game'
  import Sortable from 'sortablejs'
  import GameCell from './GameCell.svelte'
  import GamePlayer from './GamePlayer.svelte'

  const universe = Universe.new()
  const width = universe.width()
  const height = universe.height()

  const cellsPtr = universe.cells()
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height)
</script>

<div class="cells">
  {#each cells as cell, index (`${index}-${cell}`)}
    <GameCell type={cell}>
      {#if index === universe.player_index()}
        <GamePlayer />
      {:else}
        <!-- 
          Huge svelte bug requires us to have some content
          otherwise rendering gets incredibly slow
         -->
        &nbsp;
      {/if}
    </GameCell>
  {/each}
</div>

<style>
  .cells {
    --universe-width: 5;
    --universe-height: 5;

    display: grid;
    grid-template-columns: repeat(var(--universe-width), 1fr);
    grid-template-rows: repeat(var(--universe-height), 1fr);
    grid-gap: var(--cell-gap);
  }
</style>
