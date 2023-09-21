<script lang="ts">
  import { memory } from 'tdd-game/tdd_game_bg.wasm' // will this work?
  import { Universe, Direction, Cell, GameState } from 'tdd-game'
  import Sortable from 'sortablejs'
  import GameCell from './lib/GameCell.svelte'
  import GamePlayer from './lib/GamePlayer.svelte'
  import Controls from './lib/Controls.svelte'
  import MoveList from './lib/MoveList.svelte'
  import Tests from './lib/Tests.svelte'

  const DELAY = 250

  let universe = Universe.new()
  $: width = universe.width()
  $: height = universe.height()
  $: cells = new Uint8Array(memory.buffer, universe.cells(), width * height)
  $: playerIndex = universe.player_index()

  let moves: Direction[] = []
  let touchedCells: Cell[] = [playerIndex]
  let isRecording = false
  let isMoveListEnabled = true

  document.addEventListener('keyup', (event) => {
    if (!isRecording) {
      return
    }

    switch (event.key) {
      case 'ArrowUp':
        moves = [...moves, Direction.Up]
        break
      case 'ArrowRight':
        moves = [...moves, Direction.Right]
        break
      case 'ArrowDown':
        moves = [...moves, Direction.Down]
        break
      case 'ArrowLeft':
        moves = [...moves, Direction.Left]
        break
    }
  })

  async function handleStart() {
    isRecording = false
    isMoveListEnabled = false

    let promises = moves.map((move) => async () => {
      await delay(DELAY)

      console.log('move', move)

      switch (universe.tick(move)) {
        case GameState.Playing:
          playerIndex = universe.player_index()
          touchedCells = [...touchedCells, playerIndex]

          break
        case GameState.Finished:
          isMoveListEnabled = true

          if (universe.is_player_alive() && universe.is_player_on_goal()) {
            playerIndex = universe.player_index()
            touchedCells = [...touchedCells, playerIndex]

            console.log(Array.from(cells), touchedCells)

            console.log('You won!')
            return
          }

          console.log('You lost!')

          return
        case GameState.Paused:
          break
        default:
          break
      }
    })

    await runPromisesInSequence(promises)
  }

  function handleReset() {
    universe = Universe.new()
    moves = []
    touchedCells = []
  }

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async function runPromisesInSequence(
    promises: (Promise<void> | (() => Promise<void>))[]
  ) {
    const results = []

    for (let promise of promises) {
      if (typeof promise === 'function') {
        results.push(await promise()) // In case the promise is wrapped inside a function
      } else {
        results.push(await promise) // In case it's just an array of promises
      }
    }

    return results
  }
</script>

<main>
  <div class="game">
    <h1>Program</h1>
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
      bind:isRecording
      onStart={handleStart}
      onPause={() => {
        universe.pause()
      }}
      onReset={handleReset}
    />

    <MoveList {moves} --margin-top="var(--size-4)" />
  </div>

  <div class="tests">
    <h1>Tests</h1>
    <Tests cells={Array.from(cells)} {touchedCells} />
  </div>
</main>

<style>
  main {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: var(--size-10);
  }

  .game {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    & .cells {
      --universe-width: 5;
      --universe-height: 5;
      --cell-width: var(--size-10);

      margin: var(--size-5) 0;

      display: grid;
      grid-template-columns: repeat(var(--universe-width), var(--cell-width));
      grid-template-rows: repeat(var(--universe-height), var(--cell-width));
      grid-gap: var(--cell-gap);

      max-width: fit-content;
    }
  }

  .tests {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
