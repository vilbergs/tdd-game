<script lang="ts">
  import type { Direction } from 'tdd-game'
  import Arrow from './Arrow.svelte'

  // your script goes here

  export let moves: Direction[] = []
</script>

<div class="moves">
  {#if moves.length === 0}
    <p>Please record your program instructions.</p>
  {/if}

  {#each moves as move, index (`${index}-${move}`)}
    <Arrow direction={move} />
  {/each}
</div>

<style>
  .moves {
    margin-top: var(--margin-top, 0);

    display: flex;
    align-items: center;
    background-color: var(--gray-100);
    border-radius: var(--size-2);
    width: 100%;
    padding: var(--size-2);
    min-height: var(--size-13);

    & > *:not(:last-child) {
      margin-right: var(--size-3);
    }

    & p {
      margin: 0 auto;
      text-align: center;
      color: var(--gray-800);
    }
  }
</style>
