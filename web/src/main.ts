import './style.css'

import { memory } from 'tdd-game/tdd_game_bg.wasm' // will this work?
import { Universe, Direction, Cell, GameState } from 'tdd-game'

const gameWrapper = document.getElementById('game')!
let universe = Universe.new()
const width = universe.width()
const height = universe.height()
const controls = getControls()

document.documentElement.style.setProperty('--universe-width', width.toString())
document.documentElement.style.setProperty(
  '--universe-height',
  height.toString()
)

let moves = [Direction.Up, Direction.Right, Direction.Up, Direction.Left]

moves.forEach((direction) => {
  universe.queue_move(direction)
})

// requestAnimationFrame(renderLoop)
drawCells()
drawPlayer()
drawStats()

controls.onStart(() => {
  if (universe.state() === GameState.Playing) {
    return
  }

  universe.play()

  console.log(universe.state())

  if (universe.state() === GameState.Initial) {
    requestAnimationFrame(renderLoop)
  }
})

controls.onStop(() => {
  universe.pause()
})

controls.onReset(() => {
  universe = Universe.new()
  moves = [Direction.Up, Direction.Right, Direction.Up, Direction.Left]
  moves.forEach((direction) => {
    universe.queue_move(direction)
  })

  drawCells()
  drawPlayer()
  drawStats()
})

async function renderLoop() {
  console.log(universe.state())
  switch (universe.tick()) {
    case GameState.Playing:
      drawPlayer()
      drawStats()
      break
    case GameState.Finished:
      if (universe.is_player_alive()) {
        alert('You won!')

        return
      }

      alert('You lost!')
      return
    case GameState.Paused:
      break
    default:
      break
  }

  await delay(500)
  requestAnimationFrame(renderLoop)
}

function getIndex(row: number, column: number) {
  return row * width + column
}

function drawCells() {
  gameWrapper.innerHTML = ''

  const fragment = document.createDocumentFragment()

  const cellsPtr = universe.cells()
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height)

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col)

      const cell = document.createElement('div')
      cell.className = cells[idx] === Cell.Floor ? 'cell floor' : 'cell lava'

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

  let idx = getIndex(universe.player_y(), universe.player_x())

  const cell = gameWrapper.children[idx]

  cell.appendChild(playerElement)
}

function drawStats() {
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

  return {
    start,
    stop,
    reset,
    onStart(callback = () => {}) {
      start.addEventListener('click', callback)
    },
    onStop(callback = () => {}) {
      stop.addEventListener('click', callback)
    },
    onReset(callback = () => {}) {
      reset.addEventListener('click', callback)
    },
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
