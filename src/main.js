const systemInfo = wx.getSystemInfoSync();
const canvas = wx.createCanvas();
const ctx = canvas.getContext('2d');

const width = systemInfo.windowWidth;
const height = systemInfo.windowHeight;

const DPR = systemInfo.pixelRatio || 1;
canvas.width = width * DPR;
canvas.height = height * DPR;

ctx.scale(DPR, DPR);

const CARD_WIDTH = Math.min(78, width * 0.18);
const CARD_HEIGHT = CARD_WIDTH * 1.2;
const SLOT_CAPACITY = 7;
const SLOT_Y = height - CARD_HEIGHT - 24;

const ICONS = ['🍀', '🌸', '🍋', '🍇', '🥕', '🍄', '🌽', '🥝', '🍉', '🌰'];

const state = {
  cards: [],
  slot: [],
  score: 0,
  level: 1,
  isGameOver: false,
  isWin: false,
  restartButton: null,
};

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function roundedRect(x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#fff7f0');
  gradient.addColorStop(0.45, '#ffe3c3');
  gradient.addColorStop(1, '#ffc892');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const sun = ctx.createRadialGradient(width * 0.8, height * 0.1, 10, width * 0.8, height * 0.1, 140);
  sun.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  sun.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, width, height);
}

function createLevel(level = 1) {
  const totalCards = Math.min(54, 30 + level * 6);
  const cardCount = totalCards - (totalCards % 3);
  const typePool = ICONS.slice(0, Math.min(10, 5 + Math.floor(level / 2)));
  const types = [];

  for (let i = 0; i < cardCount / 3; i += 1) {
    const icon = randomChoice(typePool);
    types.push(icon, icon, icon);
  }

  for (let i = types.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [types[i], types[j]] = [types[j], types[i]];
  }

  const cards = [];
  let id = 0;
  const layers = 4;
  const layerCounts = [
    Math.floor(cardCount * 0.38),
    Math.floor(cardCount * 0.3),
    Math.floor(cardCount * 0.2),
    cardCount,
  ];
  layerCounts[3] = cardCount - layerCounts[0] - layerCounts[1] - layerCounts[2];

  let typeIndex = 0;
  for (let layer = 0; layer < layers; layer += 1) {
    const count = layerCounts[layer];
    const spread = 0.9 - layer * 0.12;
    const centerX = width / 2;
    const centerY = height * 0.46 - layer * 10;

    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / Math.max(count, 1);
      const radiusX = width * 0.25 * spread + Math.random() * 28;
      const radiusY = height * 0.19 * spread + Math.random() * 20;

      const x = centerX + Math.cos(angle) * radiusX - CARD_WIDTH / 2 + (Math.random() - 0.5) * 24;
      const y = centerY + Math.sin(angle) * radiusY - CARD_HEIGHT / 2 + (Math.random() - 0.5) * 20;

      cards.push({
        id: id += 1,
        type: types[typeIndex],
        x: Math.max(18, Math.min(width - CARD_WIDTH - 18, x)),
        y: Math.max(85, Math.min(SLOT_Y - CARD_HEIGHT - 26, y)),
        layer,
        removed: false,
      });

      typeIndex += 1;
    }
  }

  state.cards = cards;
  state.slot = [];
  state.score = 0;
  state.isGameOver = false;
  state.isWin = false;
}

function overlapRatio(a, b) {
  const xOverlap = Math.max(0, Math.min(a.x + CARD_WIDTH, b.x + CARD_WIDTH) - Math.max(a.x, b.x));
  const yOverlap = Math.max(0, Math.min(a.y + CARD_HEIGHT, b.y + CARD_HEIGHT) - Math.max(a.y, b.y));
  return (xOverlap * yOverlap) / (CARD_WIDTH * CARD_HEIGHT);
}

function isBlocked(card) {
  if (card.removed) return false;
  return state.cards.some((other) => {
    if (other.removed || other.id === card.id) return false;
    if (other.layer <= card.layer) return false;
    return overlapRatio(card, other) > 0.2;
  });
}

function drawCard(card, options = {}) {
  const blocked = options.blocked;
  const x = card.x;
  const y = card.y;

  ctx.save();
  ctx.translate(x, y);

  ctx.shadowColor = blocked ? 'rgba(80,80,80,0.14)' : 'rgba(155, 78, 18, 0.25)';
  ctx.shadowBlur = blocked ? 6 : 14;
  ctx.shadowOffsetY = 4;

  roundedRect(0, 0, CARD_WIDTH, CARD_HEIGHT, 14);
  const fill = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT);
  if (blocked) {
    fill.addColorStop(0, '#e2ddd5');
    fill.addColorStop(1, '#cbc4bb');
  } else {
    fill.addColorStop(0, '#fffefb');
    fill.addColorStop(1, '#fff4e4');
  }
  ctx.fillStyle = fill;
  ctx.fill();

  ctx.shadowColor = 'transparent';
  roundedRect(0, 0, CARD_WIDTH, CARD_HEIGHT, 14);
  ctx.lineWidth = 2;
  ctx.strokeStyle = blocked ? '#c1baaf' : '#f0d8a8';
  ctx.stroke();

  ctx.font = `${Math.floor(CARD_WIDTH * 0.38)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = blocked ? '#968e84' : '#7b4c13';
  ctx.fillText(card.type, CARD_WIDTH / 2, CARD_HEIGHT * 0.45);

  ctx.font = `${Math.floor(CARD_WIDTH * 0.14)}px sans-serif`;
  ctx.fillStyle = blocked ? '#a69c8e' : '#bc8a41';
  ctx.fillText('咩', CARD_WIDTH / 2, CARD_HEIGHT * 0.77);

  ctx.restore();
}

function drawTopBar() {
  ctx.save();
  roundedRect(14, 14, width - 28, 58, 16);
  const panel = ctx.createLinearGradient(0, 14, 0, 72);
  panel.addColorStop(0, 'rgba(255,253,244,0.95)');
  panel.addColorStop(1, 'rgba(255,240,214,0.95)');
  ctx.fillStyle = panel;
  ctx.fill();

  ctx.fillStyle = '#8a5419';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('羊了个羊 · 三消挑战', 30, 40);

  ctx.font = '15px sans-serif';
  ctx.fillStyle = '#b06c21';
  ctx.fillText(`关卡 ${state.level}`, 30, 62);

  const left = state.cards.filter((c) => !c.removed).length;
  ctx.textAlign = 'right';
  ctx.fillText(`剩余 ${left}`, width - 30, 40);
  ctx.fillText(`得分 ${state.score}`, width - 30, 62);
  ctx.restore();
}

function drawSlot() {
  const slotX = (width - SLOT_CAPACITY * (CARD_WIDTH * 0.84)) / 2;
  const slotCardWidth = CARD_WIDTH * 0.8;
  const slotCardHeight = CARD_HEIGHT * 0.82;

  roundedRect(slotX - 12, SLOT_Y - 12, SLOT_CAPACITY * slotCardWidth + 24, slotCardHeight + 24, 18);
  ctx.fillStyle = 'rgba(255, 244, 226, 0.92)';
  ctx.fill();

  for (let i = 0; i < SLOT_CAPACITY; i += 1) {
    const x = slotX + i * slotCardWidth;
    roundedRect(x + 2, SLOT_Y, slotCardWidth - 4, slotCardHeight, 10);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fill();

    ctx.strokeStyle = 'rgba(222, 187, 139, 0.6)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  state.slot.forEach((card, index) => {
    const x = slotX + index * slotCardWidth;
    ctx.save();
    ctx.translate(x, SLOT_Y);
    roundedRect(3, 0, slotCardWidth - 6, slotCardHeight, 10);
    const fill = ctx.createLinearGradient(0, 0, 0, slotCardHeight);
    fill.addColorStop(0, '#fffdf6');
    fill.addColorStop(1, '#ffe9c9');
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = '#f0c480';
    ctx.stroke();

    ctx.font = `${Math.floor(slotCardWidth * 0.38)}px sans-serif`;
    ctx.fillStyle = '#7d4e1d';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(card.type, slotCardWidth / 2, slotCardHeight * 0.45);
    ctx.restore();
  });

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#8f6028';
  ctx.textAlign = 'center';
  ctx.fillText('集齐 3 张相同卡牌自动消除', width / 2, SLOT_Y - 16);
}

function drawOverlay() {
  if (!state.isGameOver && !state.isWin) return;

  ctx.fillStyle = 'rgba(53, 36, 18, 0.4)';
  ctx.fillRect(0, 0, width, height);

  const panelWidth = width * 0.78;
  const panelHeight = 240;
  const panelX = (width - panelWidth) / 2;
  const panelY = height * 0.24;

  roundedRect(panelX, panelY, panelWidth, panelHeight, 20);
  const fill = ctx.createLinearGradient(0, panelY, 0, panelY + panelHeight);
  fill.addColorStop(0, '#fffdf8');
  fill.addColorStop(1, '#ffeac5');
  ctx.fillStyle = fill;
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#71451a';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(state.isWin ? '挑战成功！' : '挑战失败', width / 2, panelY + 72);

  ctx.font = '18px sans-serif';
  ctx.fillStyle = '#9b6428';
  ctx.fillText(`本局得分 ${state.score}`, width / 2, panelY + 118);

  roundedRect(width / 2 - 92, panelY + 146, 184, 56, 14);
  ctx.fillStyle = '#ffbe58';
  ctx.fill();
  ctx.strokeStyle = '#f39a2f';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#6a3d16';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('再来一局', width / 2, panelY + 182);

  state.restartButton = {
    x: width / 2 - 92,
    y: panelY + 146,
    w: 184,
    h: 56,
  };
}

function removeTriples() {
  const countByType = {};
  state.slot.forEach((c) => {
    countByType[c.type] = (countByType[c.type] || 0) + 1;
  });

  Object.keys(countByType).forEach((type) => {
    if (countByType[type] >= 3) {
      let removed = 0;
      state.slot = state.slot.filter((card) => {
        if (card.type === type && removed < 3) {
          removed += 1;
          return false;
        }
        return true;
      });
      state.score += 30;
    }
  });
}

function cardAtPoint(x, y) {
  const available = state.cards
    .filter((c) => !c.removed)
    .sort((a, b) => a.layer - b.layer);

  for (let i = available.length - 1; i >= 0; i -= 1) {
    const card = available[i];
    const inside = x >= card.x && x <= card.x + CARD_WIDTH && y >= card.y && y <= card.y + CARD_HEIGHT;
    if (!inside) continue;
    if (isBlocked(card)) continue;
    return card;
  }
  return null;
}

function processTap(x, y) {
  if (state.restartButton) {
    const btn = state.restartButton;
    const hit = x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h;
    if (hit) {
      state.level = state.isWin ? state.level + 1 : Math.max(1, state.level);
      createLevel(state.level);
      state.restartButton = null;
      return;
    }
  }

  if (state.isGameOver || state.isWin) return;

  const card = cardAtPoint(x, y);
  if (!card) return;

  card.removed = true;
  state.slot.push({ type: card.type });
  state.score += 10;

  removeTriples();

  if (state.slot.length >= SLOT_CAPACITY) {
    state.isGameOver = true;
  }

  if (state.cards.every((c) => c.removed)) {
    state.isWin = true;
  }
}

function render() {
  ctx.clearRect(0, 0, width, height);
  drawBackground();
  drawTopBar();

  const drawable = state.cards
    .filter((c) => !c.removed)
    .sort((a, b) => a.layer - b.layer);

  drawable.forEach((card) => drawCard(card, { blocked: isBlocked(card) }));

  drawSlot();
  drawOverlay();
}

function frame() {
  render();
  requestAnimationFrame(frame);
}

wx.onTouchStart((event) => {
  const touch = event.touches[0];
  if (!touch) return;
  processTap(touch.clientX, touch.clientY);
});

createLevel(1);
frame();
