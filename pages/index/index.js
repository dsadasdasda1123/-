const BOARD_SIZE = 6;
const TOTAL_TILES = 72;
const SLOT_LIMIT = 7;
const TYPE_POOL = ['🐑', '🥕', '🌽', '🍇', '🍓', '🌰', '🍀', '🌸', '🍄', '🌻', '🍋', '🥔'];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildHeights(targetTotal) {
  const cells = BOARD_SIZE * BOARD_SIZE;
  let heights = new Array(cells).fill(1);
  let current = cells;

  while (current < targetTotal) {
    const idx = Math.floor(Math.random() * cells);
    if (heights[idx] < 3) {
      heights[idx] += 1;
      current += 1;
    }
  }

  while (current > targetTotal) {
    const idx = Math.floor(Math.random() * cells);
    if (heights[idx] > 1) {
      heights[idx] -= 1;
      current -= 1;
    }
  }

  return heights;
}

function createTileTypes(total) {
  const typeCount = TYPE_POOL.length;
  const eachCount = Math.floor(total / typeCount / 3) * 3;
  const types = [];

  for (let i = 0; i < typeCount; i += 1) {
    for (let j = 0; j < eachCount; j += 1) {
      types.push(TYPE_POOL[i]);
    }
  }

  while (types.length < total) {
    const pick = TYPE_POOL[Math.floor(Math.random() * TYPE_POOL.length)];
    if ((types.filter((item) => item === pick).length + 1) % 3 === 0) {
      types.push(pick);
    }
  }

  return shuffle(types);
}

Page({
  data: {
    boardCells: [],
    slotTiles: [],
    score: 0,
    remain: TOTAL_TILES,
    status: 'playing',
    message: '点击最上层卡片，凑齐 3 张可消除。',
    usedUndo: false
  },

  onLoad() {
    this.startGame();
  },

  startGame() {
    const heights = buildHeights(TOTAL_TILES);
    const types = createTileTypes(TOTAL_TILES);
    const tiles = [];
    let typeIndex = 0;
    let id = 1;

    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const height = heights[row * BOARD_SIZE + col];
        for (let layer = 0; layer < height; layer += 1) {
          tiles.push({
            id,
            type: types[typeIndex],
            row,
            col,
            layer,
            removed: false
          });
          id += 1;
          typeIndex += 1;
        }
      }
    }

    this.tiles = tiles;
    this.history = [];

    this.setData({
      slotTiles: [],
      score: 0,
      remain: this.tiles.length,
      status: 'playing',
      message: '点击最上层卡片，凑齐 3 张可消除。',
      usedUndo: false
    });

    this.refreshBoard();
  },

  refreshBoard() {
    const boardCells = [];
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const stack = this.tiles
          .filter((item) => !item.removed && item.row === row && item.col === col)
          .sort((a, b) => b.layer - a.layer);

        boardCells.push({
          key: `${row}-${col}`,
          row,
          col,
          top: stack[0] || null,
          depth: stack.length
        });
      }
    }

    this.setData({ boardCells });
  },

  handlePick(e) {
    if (this.data.status !== 'playing') {
      return;
    }

    const { id } = e.currentTarget.dataset;
    const tile = this.tiles.find((item) => item.id === id);

    if (!tile || tile.removed) {
      return;
    }

    const top = this.getTopTile(tile.row, tile.col);
    if (!top || top.id !== tile.id) {
      return;
    }

    tile.removed = true;
    const slotTiles = [...this.data.slotTiles, { id: tile.id, type: tile.type }];

    this.history.push({ tileId: tile.id, slotTiles: [...this.data.slotTiles] });

    const clearedResult = this.clearTriples(slotTiles);
    const remain = this.tiles.filter((item) => !item.removed).length;

    let status = 'playing';
    let message = `已收入 ${tile.type}，继续加油！`;
    let score = this.data.score + 10 + clearedResult.cleared * 30;

    if (remain === 0) {
      status = 'win';
      message = '通关成功！你是放置小天才！';
      score += 200;
    } else if (clearedResult.slotTiles.length >= SLOT_LIMIT) {
      status = 'lose';
      message = '槽位已满，挑战失败，再来一局！';
    }

    this.setData({
      slotTiles: clearedResult.slotTiles,
      remain,
      score,
      status,
      message
    });

    this.refreshBoard();
  },

  clearTriples(slotTiles) {
    let working = [...slotTiles];
    let cleared = 0;
    let changed = true;

    while (changed) {
      changed = false;
      const counter = {};
      working.forEach((item) => {
        counter[item.type] = (counter[item.type] || 0) + 1;
      });

      Object.keys(counter).forEach((type) => {
        if (counter[type] >= 3) {
          let removed = 0;
          working = working.filter((item) => {
            if (item.type === type && removed < 3) {
              removed += 1;
              return false;
            }
            return true;
          });
          cleared += 1;
          changed = true;
        }
      });
    }

    return { slotTiles: working, cleared };
  },

  getTopTile(row, col) {
    return this.tiles
      .filter((item) => !item.removed && item.row === row && item.col === col)
      .sort((a, b) => b.layer - a.layer)[0];
  },

  handleUndo() {
    if (this.data.usedUndo || this.data.status !== 'playing' || this.history.length === 0) {
      return;
    }

    const last = this.history.pop();
    const tile = this.tiles.find((item) => item.id === last.tileId);
    if (!tile) {
      return;
    }

    tile.removed = false;
    this.setData({
      slotTiles: last.slotTiles,
      remain: this.data.remain + 1,
      status: 'playing',
      message: '已撤回上一步，请谨慎选择。',
      usedUndo: true
    });

    this.refreshBoard();
  },

  handleRestart() {
    this.startGame();
  }
});
