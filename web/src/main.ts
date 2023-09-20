import './style.css'

import { memory } from 'tdd-game/tdd_game_bg.wasm' // will this work?
import { Universe, Direction, Cell, GameState } from 'tdd-game'
import Sortable from 'sortablejs'

const DEBUG = false

const DELAY = 500

const gameWrapper = document.getElementById('game')!
// let moves = [Direction.Up, Direction.Down, Direction.Left, Direction.Right]
let moves: Direction[] = []
let isRecording = false

let universe = Universe.new()
let width = universe.width()
let height = universe.height()
const controls = getControls()

reset(universe)

controls.onStart(() => {
  if (universe.state() === GameState.Playing) {
    return
  }

  if (isRecording) {
    toggleRecording()
  }

  if (universe.state() === GameState.Initial) {
    controls.movesContainer.disable()
    moves.forEach((direction) => {
      universe.queue_move(direction)
    })

    universe.play()
    requestAnimationFrame(renderLoop)
  } else {
    universe.play()
  }
})

controls.onStop(() => {
  universe.pause()
})

controls.onReset(() => reset())

controls.onRecord(toggleRecording)

async function renderLoop() {
  switch (universe.tick()) {
    case GameState.Playing:
      draw()
      break
    case GameState.Finished:
      controls.movesContainer.enable()

      if (universe.is_player_alive() && universe.is_player_on_goal()) {
        draw()

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

  await delay(DELAY)
  requestAnimationFrame(renderLoop)
}

function getIndex(row: number, column: number) {
  return row * width + column
}

function draw() {
  drawPlayer()
  drawStats()
}

function reset(existingUniverse = Universe.new()) {
  universe = existingUniverse

  document.documentElement.style.setProperty(
    '--universe-width',
    width.toString()
  )
  document.documentElement.style.setProperty(
    '--universe-height',
    height.toString()
  )

  controls.movesContainer.reset()

  renderCells()
  drawPlayer()
  drawStats()

  return [universe, width, height]
}

function renderCells() {
  const cellClassNames = ['cell floor', 'cell lava', 'cell goal']

  gameWrapper.innerHTML = ''

  const fragment = document.createDocumentFragment()

  const cellsPtr = universe.cells()
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height)

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col)

      const cell = document.createElement('div')
      cell.className = cellClassNames[cells[idx]]

      fragment.appendChild(cell)
    }
  }

  gameWrapper.appendChild(fragment)
}

function drawPlayer() {
  const player = document.querySelector('.player')

  if (player) {
    player.remove()
  }

  const playerElement = document.createElement('div')
  playerElement.className = 'player'

  console.log(universe.player_y(), universe.player_x())

  let idx = getIndex(universe.player_y(), universe.player_x())

  const cell = gameWrapper.children[idx]

  cell.appendChild(playerElement)
}

function drawStats() {
  if (!DEBUG) {
    return
  }

  const statsElement = document.getElementById('stats')!

  statsElement.innerHTML = ''

  const stats = { x: universe.player_x(), y: universe.player_y() }

  const list = document.createElement('ul')

  Object.entries(stats).forEach(([key, value]) => {
    const li = document.createElement('li')

    li.innerHTML = `<b>${key}:</b> ${value}`

    list.appendChild(li)
  })

  statsElement.appendChild(list)
}

function getControls() {
  const start = document.getElementById('start')!
  const stop = document.getElementById('stop')!
  const reset = document.getElementById('reset')!
  const record = document.getElementById('record')!

  const movesElement = document.getElementById('moves')!

  const sortable = Sortable.create(movesElement, {
    animation: 150,
    // Element dragging ended
    onSort: function ({ item, oldIndex, newIndex }) {
      const itemElement = item

      const direction = parseInt(itemElement.dataset.direction!) as Direction

      if (typeof oldIndex !== 'number' || typeof newIndex !== 'number') {
        return
      }

      moves.splice(oldIndex, 1)
      moves.splice(newIndex, 0, direction)
    },
  })

  const movesContainer = {
    reset() {
      moves = []
      movesElement.innerHTML = ''
    },
    addDirection(direction: Direction) {
      moves.push(direction)
      movesElement.appendChild(createMoveElement(direction))
    },
    disable() {
      sortable.option('disabled', true)
    },
    enable() {
      sortable.option('disabled', false)
    },
  }

  function createMoveElement(direction: Direction) {
    const move = document.createElement('div')
    move.dataset.direction = direction.toString()
    move.className = 'move'
    move.innerHTML = renderDirection(direction)

    return move
  }

  return {
    start,
    stop,
    reset,
    record,
    movesContainer,
    onStart(callback = () => {}) {
      start.addEventListener('click', callback)
    },
    onStop(callback = () => {}) {
      stop.addEventListener('click', callback)
    },
    onReset(callback = () => {}) {
      reset.addEventListener('click', callback)
    },
    onRecord(callback = () => {}) {
      record.addEventListener('click', callback)
    },
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function renderDirection(direction: Direction) {
  switch (direction) {
    case Direction.Up:
      return '↑'
    case Direction.Down:
      return '↓'
    case Direction.Left:
      return '←'
    case Direction.Right:
      return '→'
    default:
      return ''
  }
}

function handleKeyRecord(event: KeyboardEvent) {
  let direction: Direction | null = null

  if (event.key === 'ArrowUp') {
    direction = Direction.Up
  } else if (event.key === 'ArrowDown') {
    direction = Direction.Down
  } else if (event.key === 'ArrowLeft') {
    direction = Direction.Left
  } else if (event.key === 'ArrowRight') {
    direction = Direction.Right
  } else {
    return
  }

  controls.movesContainer.addDirection(direction)
}

function toggleRecording() {
  isRecording = !isRecording

  if (!isRecording) {
    document.removeEventListener('keyup', handleKeyRecord)
    controls.record.innerHTML = 'Record Moves'

    return
  }

  controls.record.innerHTML = 'Stop Recording'

  document.addEventListener('keyup', handleKeyRecord)
}
