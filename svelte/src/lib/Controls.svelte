<script lang="ts">
  export let onStart: () => void
  export let onStop: () => void
  export let onReset: () => void
  export let onRecord: () => void
</script>

<div class="controls {$$props.class || ''}">
  <button class="start">Start</button>
  <button class="stop">Stop</button>
  <button class="reset">Reset</button>
  <button class="record">Record Moves</button>
</div>

<style>
  .controls {
    display: flex;
    align-items: center;
    margin-top: var(--margin-top, 0);

    & button {
      all: unset;
      cursor: pointer;
      text-transform: uppercase;
      color: white;
      padding: var(--size-2) var(--size-4);
      border-radius: var(--size-max);

      -webkit-font-smoothing: antialiased;
      font-size: var(--size-4);
      background-color: oklch(50.67% 0 202.24);

      &:not(:last-child) {
        margin-right: var(--size-1);
      }
    }

    & .start {
      background-color: oklch(38.24% 0.044 260.47);
    }

    & .stop {
      background-color: oklch(50.67% 0 202.24);
    }

    & .record {
      background-color: oklch(64.41% 0.281 29.65);
    }
  }
</style>
