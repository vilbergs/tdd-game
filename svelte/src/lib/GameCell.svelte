<script lang="ts">
  // import type { Cell } from 'tdd-game'

  export let type: number = 0

  const cellClassNames = ['floor', 'lava', 'goal']
</script>

<div class="cell {cellClassNames[type]}">
  <slot />
</div>

<style>
  .cell {
    --cell-size: calc(12 * 4px);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
    width: 100%;
    height: 100%;
  }

  .floor {
    --floor-color: oklch(74% 0 52.94);

    background-color: var(--floor-color);
  }

  .lava {
    --lava-color: oklch(70% 0.227 38.12);
    background-color: var(--lava-color);
  }

  .goal {
    --goal-color: oklch(85.29% 0.328 142.94);
    background-color: var(--goal-color);
  }
</style>
