<script lang="ts">
  import type { Cell, Direction } from 'tdd-game'
  // This code is for v4 of the openai package: npmjs.com/package/openai
  import OpenAI from 'openai'

  export let cells: Cell[] = []
  export let touchedCells: number[] = []

  let testCases: string[] = [
    'The player should reach the goal',
    'The player should not touch the lava',
  ]
  let isRunningTests = false
  let passedTests: number[] = []

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  })

  async function runTests() {
    isRunningTests = true

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You will be provided with a JSON object that includes the following: an array (cells) of integers which represent a two-dimensional grid of cells, an array (touchedCells) of integers which represent indexes of the cells array that were touched, as well as an array (testCases) of strings which represent test cases in natural language that you must verify based on the given cells and directions whether they passed or not. Each Cell value represents a type of cell, evaluate the test cased based on them, Here are the the cell types and their integer value: 0 = Floor, 1 = Lava, 2 = Goal. You should return a JSON array (for example: "[0,1,2]") with the indexes of the successful test cases in the order they were given. Example: Given the following input: {"cells" [0,2,0,1,0,0,0,0,0], "touchedCells": [0,0,2], "testCases": ["The player should reach the goal", "The player should not touch the lava"]}, the output should be: [0, 1]}',
          },
          {
            role: 'user',
            content: JSON.stringify({
              cells,
              touchedCells,
              testCases,
            }),
          },
        ],
        temperature: 0,
        max_tokens: 1024,
      })
      console.log(response)

      if (response.choices[0].message.content) {
        passedTests = JSON.parse(response.choices[0].message.content)
      }
    } catch (error) {
      console.error(error)
    } finally {
      isRunningTests = false
    }
  }
</script>

<section>
  <div class="test-cases">
    {#each testCases as testCase, index}
      <textarea
        class="test-case"
        bind:value={testCase}
        class:passed={passedTests.includes(index)}
      />
    {/each}
  </div>

  <div class="test-controls">
    <button on:click={() => (testCases = [...testCases, ''])}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-5 h-5"
      >
        <path
          d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
        />
      </svg>
      <span>Add Test Case</span>
    </button>
    <button class="run-tests" on:click={runTests} disabled={isRunningTests}>
      <span>Run Tests</span>
    </button>
  </div>
</section>

<style>
  section {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    margin: var(--size-4) 0;
  }

  .test-cases {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;

    margin-bottom: var(--size-4);

    & .test-case {
      padding: var(--size-2) var(--size-3);
      font-size: var(--size-4);
      background-color: var(--gray-100);
      border-radius: 8px;
      color: var(--gray-800);

      &.passed {
        background-color: var(--green-100);
      }

      &:not(:last-child) {
        margin-bottom: var(--size-2);
      }
    }
  }

  .test-controls {
    display: flex;

    & .run-tests {
      margin-left: var(--size-2);
      background-color: var(--blue-400);
    }
  }
</style>
