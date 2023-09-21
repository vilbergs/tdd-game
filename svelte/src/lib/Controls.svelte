<script lang="ts">
  export let onStart: () => void
  export let onPause: () => void
  export let onReset: () => void
  export let onRecord: () => void

  export let isRecording: boolean = false
</script>

<div class="controls {$$props.class || ''}">
  <button class="start" on:click={onStart}>Start</button>
  <button class="stop" on:click={onPause}>Pause</button>
  <button class="reset" on:click={onReset}>Reset</button>
  <button
    class="record"
    on:click={() => {
      isRecording = !isRecording
      onRecord()
    }}>{isRecording ? 'Stop Recording' : 'Record Moves'}</button
  >
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

    & .pause {
      background-color: oklch(50.67% 0 202.24);
    }

    & .record {
      background-color: oklch(64.41% 0.281 29.65);
    }
  }
</style>
