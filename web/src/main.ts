import './style.css'

import { memory } from 'tdd-game/tdd_game_bg.wasm' // will this work?
import { Universe, Direction, Cell, GameState } from 'tdd-game'

const gameWrapper = document.getElementById('game')!

let universe = Universe.new()
let width = universe.width()
let height = universe.height()
const controls = getControls()

reset(universe)

controls.onStart(() => {
  if (universe.state() === GameState.Playing) {
    return
  }

  if (universe.state() === GameState.Initial) {
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

async function renderLoop() {
  switch (universe.tick()) {
    case GameState.Playing:
      draw()
      break
    case GameState.Finished:
      if (universe.is_player_alive()) {
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

  await delay(100)
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
  ;[Direction.Up, Direction.Right, Direction.Up, Direction.Left].forEach(
    (direction) => {
      universe.queue_move(direction)
    }
  )

  renderCells()
  drawPlayer()
  drawStats()

  return [universe, width, height]
}

function renderCells() {
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
