<script lang="ts">
  import { Direction } from 'tdd-game'

  export let direction: Direction = Direction.Up
</script>

<div class="arrow">
  {#if direction === Direction.Up}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="arrow-svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
      />
    </svg>
  {:else if direction === Direction.Right}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="arrow-svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
      />
    </svg>
  {:else if direction === Direction.Left}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="arrow-svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
      />
    </svg>
  {:else if direction === Direction.Down}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="arrow-svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
      />
    </svg>
  {:else}
    N/A
  {/if}
</div>

<style>
  .arrow {
    cursor: pointer;
    font-family: monospace;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--size-1);
    background-color: oklch(38.24% 0.044 260.47);
    width: var(--size-11);
    height: var(--size-11);
    color: white;

    & svg {
      stroke-width: 3;
      width: var(--size-9);
      height: var(--size-9);
    }
  }
</style>
