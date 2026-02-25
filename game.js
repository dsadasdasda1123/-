const TILE_TYPES = ['🍎', '🍇', '🥕', '🥝', '🍋', '🍒', '🥔', '🌽'];
const MATCH_COUNT = 3;
const TRAY_LIMIT = 7;
const TOTAL_CARDS = 72;

class YangStyleMatchGame {
  constructor() {
    this.canvas = wx.createCanvas();
    this.ctx = this.canvas.getContext('2d');
    this.dpr = wx.getSystemInfoSync().pixelRatio || 1;

    this.safeTop = 0;
    this.screenWidth = 375;
    this.screenHeight = 667;
    this.boardTop = 0;
    this.boardHeight = 0;
    this.trayTop = 0;
    this.tileSize = 36;
    this.cols = 8;
    this.rows = 10;
    this.layers = 3;
    this.tileGap = 6;
    this.layerOffset = 8;

    this.cards = [];
    this.tray = [];
    this.score = 0;
    this.gameOver = false;
    this.win = false;
    this.message = '点击可见卡片，集齐 3 张消除';

    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onResize = this.onResize.bind(this);

    this.init();
  }

  init() {
    this.updateLayout();
    this.resetGame();

    wx.onTouchEnd(this.onTouchEnd);
    wx.onWindowResize(this.onResize);
    this.render();
  }

  updateLayout() {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    this.screenWidth = info.windowWidth || info.screenWidth;
    this.screenHeight = info.windowHeight || info.screenHeight;
    this.safeTop = info.safeArea ? info.safeArea.top : (info.statusBarHeight || 0);

    const minHorizontalPadding = 18;
    const boardWidth = this.screenWidth - minHorizontalPadding * 2;

    this.cols = this.screenWidth < 360 ? 7 : 8;
    this.rows = this.screenHeight < 640 ? 9 : 10;

    const byWidth = boardWidth / this.cols;
    const byHeight = (this.screenHeight * 0.62) / this.rows;
    this.tileSize = Math.floor(Math.max(30, Math.min(54, byWidth, byHeight)));
    this.tileGap = Math.max(4, Math.floor(this.tileSize * 0.12));
    this.layerOffset = Math.max(6, Math.floor(this.tileSize * 0.16));

    this.boardTop = this.safeTop + 72;
    this.boardHeight = this.rows * (this.tileSize + this.tileGap);
    this.trayTop = this.boardTop + this.boardHeight + 34;

    this.canvas.width = Math.floor(this.screenWidth * this.dpr);
    this.canvas.height = Math.floor(this.screenHeight * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  buildDeck() {
    const typeCount = TOTAL_CARDS / MATCH_COUNT;
    const deck = [];

    for (let i = 0; i < typeCount; i += 1) {
      const type = TILE_TYPES[i % TILE_TYPES.length];
      for (let j = 0; j < MATCH_COUNT; j += 1) {
        deck.push(type);
      }
    }

    for (let i = deck.length - 1; i > 0; i -= 1) {
      const n = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[n]] = [deck[n], deck[i]];
    }

    return deck;
  }

  buildCards() {
    const deck = this.buildDeck();
    const cards = [];

    const boardWidth = this.cols * (this.tileSize + this.tileGap);
    const startX = (this.screenWidth - boardWidth) / 2;

    let id = 0;
    for (let layer = 0; layer < this.layers; layer += 1) {
      const cardsPerLayer = Math.floor(deck.length / this.layers);
      for (let i = 0; i < cardsPerLayer; i += 1) {
        const row = Math.floor(i / this.cols);
        const col = i % this.cols;

        if (row >= this.rows) {
          break;
        }

        const xJitter = Math.random() * this.layerOffset - this.layerOffset / 2;
        const yJitter = Math.random() * this.layerOffset - this.layerOffset / 2;

        cards.push({
          id: id += 1,
          type: deck.pop(),
          layer,
          x: startX + col * (this.tileSize + this.tileGap) + layer * this.layerOffset + xJitter,
          y: this.boardTop + row * (this.tileSize + this.tileGap) + layer * this.layerOffset + yJitter,
          removed: false
        });
      }
    }

    while (deck.length) {
      cards.push({
        id: id += 1,
        type: deck.pop(),
        layer: this.layers - 1,
        x: startX + Math.random() * (boardWidth - this.tileSize),
        y: this.boardTop + Math.random() * (this.boardHeight - this.tileSize),
        removed: false
      });
    }

    cards.sort((a, b) => a.layer - b.layer);
    return cards;
  }

  resetGame() {
    this.cards = this.buildCards();
    this.tray = [];
    this.score = 0;
    this.gameOver = false;
    this.win = false;
    this.message = '点击可见卡片，集齐 3 张消除';
    this.render();
  }

  onResize() {
    this.updateLayout();
    this.resetGame();
  }

  getTopCardAt(x, y) {
    let target = null;

    for (let i = this.cards.length - 1; i >= 0; i -= 1) {
      const card = this.cards[i];
      if (card.removed) {
        continue;
      }

      const inside = x >= card.x && x <= card.x + this.tileSize && y >= card.y && y <= card.y + this.tileSize;
      if (!inside) {
        continue;
      }

      let blocked = false;
      for (let j = i + 1; j < this.cards.length; j += 1) {
        const top = this.cards[j];
        if (top.removed) {
          continue;
        }

        const overlap = !(
          top.x + this.tileSize < card.x + this.tileSize * 0.2 ||
          top.x > card.x + this.tileSize * 0.8 ||
          top.y + this.tileSize < card.y + this.tileSize * 0.2 ||
          top.y > card.y + this.tileSize * 0.8
        );

        if (overlap) {
          blocked = true;
          break;
        }
      }

      if (!blocked) {
        target = card;
        break;
      }
    }

    return target;
  }

  resolveTray() {
    const counter = {};
    this.tray.forEach((type) => {
      counter[type] = (counter[type] || 0) + 1;
    });

    Object.keys(counter).forEach((type) => {
      if (counter[type] >= MATCH_COUNT) {
        let needRemove = MATCH_COUNT;
        this.tray = this.tray.filter((item) => {
          if (item === type && needRemove > 0) {
            needRemove -= 1;
            return false;
          }
          return true;
        });
        this.score += 10;
        this.message = `消除成功 +10，当前分数：${this.score}`;
      }
    });
  }

  checkState() {
    const alive = this.cards.some((card) => !card.removed);
    if (!alive) {
      this.win = true;
      this.gameOver = true;
      this.message = `通关！最终分数：${this.score}`;
      return;
    }

    if (this.tray.length >= TRAY_LIMIT) {
      this.gameOver = true;
      this.message = '槽位满了，点击底部按钮重开';
    }
  }

  onTouchEnd(event) {
    const touch = event.changedTouches && event.changedTouches[0];
    if (!touch) {
      return;
    }

    const x = touch.x;
    const y = touch.y;

    const buttonWidth = 120;
    const buttonHeight = 44;
    const buttonX = (this.screenWidth - buttonWidth) / 2;
    const buttonY = this.screenHeight - 72;

    const tappedRestart =
      x >= buttonX &&
      x <= buttonX + buttonWidth &&
      y >= buttonY &&
      y <= buttonY + buttonHeight;

    if (tappedRestart) {
      this.resetGame();
      return;
    }

    if (this.gameOver) {
      return;
    }

    const card = this.getTopCardAt(x, y);
    if (!card) {
      return;
    }

    card.removed = true;
    this.tray.push(card.type);
    this.resolveTray();
    this.checkState();
    this.render();
  }

  drawBackground() {
    const ctx = this.ctx;
    ctx.fillStyle = '#f7f4e8';
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    const grd = ctx.createLinearGradient(0, 0, 0, this.screenHeight);
    grd.addColorStop(0, '#fff9e8');
    grd.addColorStop(1, '#f0e8ce');
    ctx.fillStyle = grd;
    ctx.fillRect(0, this.safeTop, this.screenWidth, this.screenHeight - this.safeTop);
  }

  drawHeader() {
    const ctx = this.ctx;
    ctx.fillStyle = '#553f1d';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('咩咩三消', this.screenWidth / 2, this.safeTop + 36);

    ctx.fillStyle = '#775b31';
    ctx.font = '16px sans-serif';
    ctx.fillText(this.message, this.screenWidth / 2, this.safeTop + 60);
  }

  drawCards() {
    const ctx = this.ctx;

    this.cards.forEach((card) => {
      if (card.removed) {
        return;
      }

      ctx.fillStyle = '#fefdf7';
      ctx.strokeStyle = '#d2b67a';
      ctx.lineWidth = 2;
      const radius = Math.max(6, Math.floor(this.tileSize * 0.18));
      this.roundRect(card.x, card.y, this.tileSize, this.tileSize, radius, true, true);

      ctx.fillStyle = '#6b4e1d';
      ctx.font = `${Math.floor(this.tileSize * 0.54)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(card.type, card.x + this.tileSize / 2, card.y + this.tileSize / 2 + 1);
    });
  }

  drawTray() {
    const ctx = this.ctx;
    const slotSize = Math.max(28, this.tileSize - 4);
    const totalWidth = TRAY_LIMIT * (slotSize + 6) - 6;
    const startX = (this.screenWidth - totalWidth) / 2;

    ctx.fillStyle = '#dac8a1';
    this.roundRect(startX - 10, this.trayTop - 10, totalWidth + 20, slotSize + 20, 14, true, false);

    for (let i = 0; i < TRAY_LIMIT; i += 1) {
      const x = startX + i * (slotSize + 6);
      const y = this.trayTop;
      ctx.fillStyle = '#fffaf0';
      ctx.strokeStyle = '#c3ab78';
      this.roundRect(x, y, slotSize, slotSize, 8, true, true);

      const tile = this.tray[i];
      if (tile) {
        ctx.fillStyle = '#6b4e1d';
        ctx.font = `${Math.floor(slotSize * 0.52)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tile, x + slotSize / 2, y + slotSize / 2 + 1);
      }
    }

    ctx.fillStyle = '#654f2b';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(`槽位：${this.tray.length}/${TRAY_LIMIT}  分数：${this.score}`, this.screenWidth / 2, this.trayTop + slotSize + 28);
  }

  drawRestartButton() {
    const ctx = this.ctx;
    const buttonWidth = 120;
    const buttonHeight = 44;
    const x = (this.screenWidth - buttonWidth) / 2;
    const y = this.screenHeight - 72;

    ctx.fillStyle = this.gameOver ? '#d66a42' : '#b9852f';
    this.roundRect(x, y, buttonWidth, buttonHeight, 12, true, false);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.gameOver ? '再来一局' : '重开', x + buttonWidth / 2, y + buttonHeight / 2 + 1);
  }

  roundRect(x, y, width, height, radius, fill, stroke) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  }

  render() {
    this.drawBackground();
    this.drawHeader();
    this.drawCards();
    this.drawTray();
    this.drawRestartButton();
  }
}

new YangStyleMatchGame();
