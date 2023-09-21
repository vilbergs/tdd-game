<script lang="ts">
  import { memory } from 'tdd-game/tdd_game_bg.wasm' // will this work?
  import { Universe, Direction, Cell, GameState } from 'tdd-game'
  import Sortable from 'sortablejs'
  import GameCell from './lib/GameCell.svelte'
  import GamePlayer from './lib/GamePlayer.svelte'
  import Controls from './lib/Controls.svelte'

  let universe = Universe.new()
  const width = universe.width()
  const height = universe.height()

  let cellsPtr = universe.cells()
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height)

  let moves = [Direction.Up, Direction.Right, Direction.Down, Direction.Left]
  let isRecording = false
  let playerIndex = universe.player_index()

  function handleStart() {
    moves.forEach((move) => {
      console.log(move)
      universe.tick(move)

      playerIndex = universe.player_index()
    })
  }
</script>

{#key universe}
  <main>
    {isRecording}
    <div class="cells">
      {#each cells as cell, index (`${index}-${cell}`)}
        <GameCell type={cell}>
          {#if index === playerIndex}
            <GamePlayer />
          {/if}
        </GameCell>
      {/each}
    </div>

    <Controls
      --margin-top="var(--size-4)"
      bind:isRecording
      onStart={handleStart}
      onPause={() => {
        universe.pause()
      }}
      onReset={() => {
        console.log('reset')
        universe = Universe.new()
        cellsPtr = universe.cells()
      }}
      onRecord={() => {}}
    />
  </main>
{/key}

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
