mod utils;

use std::{collections::VecDeque, fmt};

use rand::prelude::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    fn alert(s: &str);
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Direction {
    Up = 0,
    Right = 1,
    Down = 2,
    Left = 3,
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum GameState {
    Initial = 0,
    Playing = 1,
    Finished = 2,
    Paused = 3,
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum PlayerState {
    Alive = 0,
    Dead = 1,
}

#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Player {
    x: u32,
    y: u32,
    alive: bool,
}

#[wasm_bindgen]
impl Player {
    pub fn new(x: u32, y: u32) -> Player {
        Player { x, y, alive: true }
    }

    pub fn move_player(&mut self, direction: Direction) -> () {
        match direction {
            Direction::Up => self.y -= 1,
            Direction::Right => self.x += 1,
            Direction::Down => self.y += 1,
            Direction::Left => self.x -= 1,
        }
    }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    Floor = 0,
    Lava = 1,
    Goal = 2,
}

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: Vec<Cell>,
    player: Player,
    moves: VecDeque<Direction>,
    state: GameState,
}

#[wasm_bindgen]
impl Universe {
    pub fn new() -> Universe {
        let mut rng = rand::thread_rng();

        let width = 5;
        let height = 5;

        let middle = width / 2;
        let player_pos = (height - 1) * width + middle;

        let cells = (0..width * height)
            .map(|idx| {
                let rand: f64 = rng.gen();

                match idx {
                    num if num == middle => Cell::Goal,
                    num if num != player_pos && num % 2 == 0 && rand < 0.2 => Cell::Lava,
                    _ => Cell::Floor,
                }
            })
            .collect();

        let player = Player::new(middle, height - 1);

        Universe {
            width,
            height,
            cells,
            player,
            moves: VecDeque::new(),
            state: GameState::Initial,
        }
    }

    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn state(&self) -> GameState {
        self.state
    }

    pub fn cells(&self) -> *const Cell {
        self.cells.as_ptr()
    }

    pub fn player_x(&self) -> u32 {
        self.player.x
    }

    pub fn player_y(&self) -> u32 {
        self.player.y
    }

    pub fn player_index(&self) -> u32 {
        self.get_index(self.player.y, self.player.x) as u32
    }

    pub fn is_player_alive(&self) -> bool {
        self.player.alive
    }

    pub fn is_player_on_goal(&self) -> bool {
        self.cells[self.get_index(self.player.y, self.player.x)] == Cell::Goal
    }

    pub fn queue_move(&mut self, direction: Direction) {
        self.moves.push_back(direction)
    }

    pub fn play(&mut self) {
        self.state = GameState::Playing;
    }

    pub fn pause(&mut self) {
        self.state = GameState::Paused;
    }

    fn next_move(&mut self) -> Option<Direction> {
        self.moves.pop_front()
    }

    pub fn tick(&mut self, direction: Direction) -> GameState {
        if self.player.alive == false {
            self.state = GameState::Finished;

            return self.state;
        }

        if self.state == GameState::Paused {
            return self.state;
        }

        self.state = GameState::Playing;

        // log("Moving in direction:");
        // log_u32(direction as u32);
        // if (self.player.x == 0 && direction == Direction::Left)
        //     || (self.player.x == self.width - 1 && direction == Direction::Right)
        //     || (self.player.y == 0 && direction == Direction::Up)
        //     || (self.player.y == self.height - 1 && direction == Direction::Down)
        // {
        //     log("now we here");
        //     log_u32(self.player_x());
        //     log_u32(self.player_y());
        //     return self.state;
        // } else {
        // }

        self.player.move_player(direction);

        let floor_idx = self.get_index(self.player.y, self.player.x);

        match self.cells[floor_idx] {
            Cell::Floor => (),
            Cell::Lava => {
                self.player.alive = false;
            }
            Cell::Goal => {
                self.state = GameState::Finished;
            }
        };

        self.state
    }
}

impl fmt::Display for Universe {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        for line in self.cells.as_slice().chunks(self.width as usize) {
            for &cell in line {
                let symbol = if cell == Cell::Floor { '◻' } else { '◼' };
                write!(f, "{}", symbol)?;
            }
            write!(f, "\n")?;
        }

        Ok(())
    }
}
