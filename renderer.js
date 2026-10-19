// ---------- Mascot ("Cookie" the corgi, sitting at the keyboard) ----------
//
// The head, ears, markings and body are authored as SVG path data in a
// fixed design space - head centred on (DESIGN_CX, DESIGN_CY) - and drawn
// with Path2D, shifted down by MASCOT_SHIFT_Y so Cookie sits right behind
// the desk. The idle bob is applied by translating the whole head group.

const FUR = '#e98a3a';
const FUR_LIGHT = '#f8b567';
const FUR_SHADE = '#c9692a';
const ARM_FUR = '#ee9545';
const OUTLINE = '#5b3418';
const INNER_EAR = '#fad0ae';
const INNER_EAR_SHADE = '#efa08a';
const WHITE = '#fff9f0';
const WHITE_SHADE = '#f3e2cc';
const BROW = '#fbc888';
const BLUSH = 'rgba(255, 143, 168, 0.55)';
const WHISKER_DOT = '#d9b9a0';
const EYE = '#24140c';
const IRIS = '#6e3a1c';
const PUPIL = '#140a05';
const NOSE = '#2a1a14';
const MOUTH = '#5b2a1a';
const TONGUE = '#ff7f98';
const BLUSH_PETTED = 'rgba(255, 143, 168, 0.85)';
const COLLAR = '#1C1C1F';
const TAG = '#edb55a';
const TAG_EDGE = '#9c6a24';
const CHIP = '#6b3e1f';

// Noctis N-9 palette shared by the PC tower, chair, desk mat, clock and
// keyboard backlight: near-black parts lit by one red accent.
const NOCTIS_RED = '#D10A12';
const NOCTIS_GLOW = '#FF4D55';
const NOCTIS_SOFT = '#FF7A80';
const NOCTIS_INK = '#F2F2F4';
const NOCTIS_PART = '#1C1C1F';
const NOCTIS_EDGE = '#2A2A2E';
// Chakra Petch isn't available offline; Bahnschrift ships with Windows and
// has the same squared, technical feel.
const TECH_FONT = 'Bahnschrift, "Segoe UI", Consolas, sans-serif';

const MASCOT_TOP = 28;
const HEAD_RY = 42;
const DESIGN_CX = 150;
const DESIGN_CY = 52;
const MASCOT_SHIFT_Y = MASCOT_TOP + HEAD_RY - DESIGN_CY;

// Rounded crown widening into fluffy cheek tufts at the jaw.
const HEAD_PATH = new Path2D(
  'M150,14 C176,14 192,30 194,52 C199,58 199,66 194,71 C197,78 191,85 184,85 ' +
  'C176,94 162,96 150,96 C138,96 124,94 116,85 C109,85 103,78 106,71 ' +
  'C101,66 101,58 106,52 C108,30 124,14 150,14 Z'
);
// White blaze: a thin stripe between the eyes opening into muzzle and cheeks.
const BLAZE_PATH = new Path2D(
  'M150,28 C154,28 155,36 155,44 C156,54 168,58 178,64 C186,70 184,84 174,89 ' +
  'C166,93 158,94 150,94 C142,94 134,93 126,89 C116,84 114,70 122,64 ' +
  'C132,58 144,54 145,44 C145,36 146,28 150,28 Z'
);
// Right ear; the left one is the same path mirrored around DESIGN_CX. Its
// base sits inside the head so the head fill hides the seam.
const EAR_PATH = new Path2D('M162,30 C166,14 180,3 192,1 C199,0 201,6 200,13 C199,26 195,37 188,47 Z');
const EAR_INNER_PATH = new Path2D('M170,31 C174,19 184,10 191,9 C194,9 195,12 194,16 C193,26 190,34 185,41 Z');
const TORSO_PATH = new Path2D('M118,90 C113,100 113,108 117,114 L183,114 C187,108 187,100 182,90 Z');
const BIB_PATH = new Path2D(
  'M132,92 C132,101 138,108 143,110 C146,113 148,111 150,113 C152,111 154,113 157,110 ' +
  'C162,108 168,101 168,92 Z'
);
const COLLAR_PATH = new Path2D('M117,88 C130,98 170,98 183,88 L184,95 C170,105 130,105 116,95 Z');
const NOSE_PATH = new Path2D('M142,67 C142,62.5 158,62.5 158,67 C158,72 153,75.5 150,75.5 C147,75.5 142,72 142,67 Z');
const OPEN_MOUTH_PATH = new Path2D('M141,80 C144,84 147,83 150,79 C153,83 156,84 159,80 C157,89 143,89 141,80 Z');
const TONGUE_PATH = new Path2D('M144.6,84.2 C146,88.4 154,88.4 155.4,84.2 C153,82.8 147,82.8 144.6,84.2 Z');
const SWEAT_PATH = new Path2D('M189,27 C192,32 194,35 194,37.5 A5,5 0 0 1 184,37.5 C184,35 186,32 189,27 Z');
const PANT_TONGUE_PATH = new Path2D(
  'M144.8,83.6 C144.6,90 146.5,93 150,93 C153.5,93 155.4,90 155.2,83.6 C152,82.4 148,82.4 144.8,83.6 Z'
);
const BLEP_PATH = new Path2D('M150.6,81 C150.6,84.8 155.6,84.8 155.6,80.8 Z');
// Small heart centred on the origin.
const HEART_PATH = new Path2D(
  'M0,2.5 C-4,-0.5 -3.5,-4 -1.5,-4 C-0.6,-4 0,-3.2 0,-2.5 C0,-3.2 0.6,-4 1.5,-4 C3.5,-4 4,-0.5 0,2.5 Z'
);
// Clip for the lunch cookie: everything except a round bite near the mouth.
const BITE_PATH = new Path2D();
BITE_PATH.rect(150, 60, 60, 60);
BITE_PATH.moveTo(177, 81);
BITE_PATH.arc(172, 81, 5, 0, Math.PI * 2);

const EYE_LEFT_X = 133;
const EYE_RIGHT_X = 167;
const EYE_Y = 52;

// String paths are parsed once and reused. Every string passed to
// strokeLine is a constant (or one of a handful of variants), so the cache
// stays small and nothing is re-parsed per frame.
const pathCache = new Map();

function cachedPath(d) {
  let path = pathCache.get(d);
  if (!path) {
    path = new Path2D(d);
    pathCache.set(d, path);
  }
  return path;
}

// Gradients whose coordinates never change are built once. A gradient is
// resolved in the transform current at fill time, so cached ones still
// follow the bob, mirroring and translations they are drawn under.
const gradientCache = new Map();

function cachedGradient(key, make) {
  let gradient = gradientCache.get(key);
  if (!gradient) {
    gradient = make();
    gradientCache.set(key, gradient);
  }
  return gradient;
}

function linearGradient(x0, y0, x1, y1, stops) {
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const [offset, color] of stops) gradient.addColorStop(offset, color);
  return gradient;
}

function strokeLine(path, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke(typeof path === 'string' ? cachedPath(path) : path);
}

function fillEllipse(x, y, rx, ry, fill, rotation = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

// `tilt` (radians) swings both ears outward around their base, used while
// Cookie is being petted.
function drawEars(tilt) {
  const earGrad = cachedGradient('ear', () =>
    linearGradient(162, 0, 201, 47, [[0, FUR_LIGHT], [0.55, FUR], [1, FUR_SHADE]])
  );
  const innerGrad = cachedGradient('innerEar', () =>
    linearGradient(0, 9, 0, 41, [[0, INNER_EAR], [1, INNER_EAR_SHADE]])
  );
  for (const side of [1, -1]) {
    ctx.save();
    if (side === -1) {
      ctx.translate(DESIGN_CX * 2, 0);
      ctx.scale(-1, 1);
    }
    if (tilt) {
      ctx.translate(176, 40);
      ctx.rotate(tilt);
      ctx.translate(-176, -40);
    }
    ctx.fillStyle = earGrad;
    ctx.fill(EAR_PATH);
    strokeLine(EAR_PATH, OUTLINE, 2);

    ctx.fillStyle = innerGrad;
    ctx.fill(EAR_INNER_PATH);
    ctx.restore();
  }
}

// Chest, white bib, collar and the little cookie name tag. Drawn before
// the arms and head, and not bobbed, so the head nods over a steady body.
function drawTorso() {
  ctx.save();
  ctx.translate(MASCOT_CENTER_X - DESIGN_CX, MASCOT_SHIFT_Y);

  ctx.fillStyle = cachedGradient('torso', () => linearGradient(0, 90, 0, 114, [[0, FUR], [1, FUR_SHADE]]));
  ctx.fill(TORSO_PATH);
  strokeLine(TORSO_PATH, OUTLINE, 2);

  ctx.fillStyle = cachedGradient('bib', () => linearGradient(0, 92, 0, 113, [[0, WHITE], [1, WHITE_SHADE]]));
  ctx.fill(BIB_PATH);

  // Black Noctis collar with a red pinstripe along its lower edge.
  ctx.fillStyle = COLLAR;
  ctx.fill(COLLAR_PATH);
  strokeLine('M119,93 C131,102.2 169,102.2 181,93', NOCTIS_RED, 1.1);
  strokeLine(COLLAR_PATH, OUTLINE, 1.6);

  ctx.beginPath();
  ctx.arc(150, 99.5, 1.8, 0, Math.PI * 2);
  ctx.strokeStyle = '#b8892c';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(150, 106, 5.5, 0, Math.PI * 2);
  ctx.fillStyle = TAG;
  ctx.fill();
  ctx.strokeStyle = TAG_EDGE;
  ctx.stroke();
  for (const [x, y, r] of [[148, 104.3, 1.1], [152.6, 106.6, 1], [148.6, 108.6, 0.9]]) {
    fillEllipse(x, y, r, r, CHIP);
  }

  ctx.restore();
}

// Big glossy eye: a dark rim with a warm brown iris and a darker pupil
// that slide toward `look` (a vector of length <= 1) to follow the mouse.
// The highlights barely move, which makes the eyeball read as turning.
function drawOpenEye(x, y, look) {
  fillEllipse(x, y, 6.4, 7.4, EYE);
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(x, y, 6.4, 7.4, 0, 0, Math.PI * 2);
  ctx.clip();
  fillEllipse(x + look.x * 2, y + 0.6 + look.y * 2, 5, 5.8, IRIS);
  fillEllipse(x + look.x * 2.8, y + 0.4 + look.y * 2.8, 3.3, 4, PUPIL);
  ctx.restore();
  fillEllipse(x - 2.2 + look.x * 0.5, y - 2.8 + look.y * 0.5, 2.6, 2.6, '#ffffff');
  fillEllipse(x + 2.3 + look.x * 0.5, y + 2.6 + look.y * 0.5, 1.1, 1.1, 'rgba(255,255,255,0.85)');
}

function drawBlinkEye(x, y) {
  strokeLine(`M${x - 6},${y + 1} Q${x},${y + 5} ${x + 6},${y + 1}`, EYE, 2.4);
}

// Upside-down "^" arcs: the content, eyes-closed smile used for LUNCH and
// while being petted.
function drawHappyEyes() {
  strokeLine('M126.5,55 Q133,46.5 139.5,55', EYE, 2.4);
  strokeLine('M160.5,55 Q167,46.5 173.5,55', EYE, 2.4);
}

function drawOpenSmile() {
  strokeLine('M150,75.5 L150,79', OUTLINE, 1.6);
  ctx.fillStyle = MOUTH;
  ctx.fill(OPEN_MOUTH_PATH);
  strokeLine(OPEN_MOUTH_PATH, OUTLINE, 1.6);
  ctx.fillStyle = TONGUE;
  ctx.fill(TONGUE_PATH);
}

// Overheated: mouth open with a long tongue lolling out, bobbing as Cookie
// pants.
function drawPant(t) {
  strokeLine('M150,75.5 L150,79', OUTLINE, 1.6);
  ctx.fillStyle = MOUTH;
  ctx.fill(OPEN_MOUTH_PATH);
  ctx.save();
  ctx.translate(0, Math.max(0, Math.sin(t / 110)) * 1.4);
  ctx.fillStyle = TONGUE;
  ctx.fill(PANT_TONGUE_PATH);
  strokeLine(PANT_TONGUE_PATH, OUTLINE, 1.2);
  strokeLine('M150,85 L150,89', 'rgba(91, 42, 26, 0.45)', 0.9);
  ctx.restore();
  strokeLine(OPEN_MOUTH_PATH, OUTLINE, 1.6);
}

function drawSweat(t) {
  const slide = ((t % 1800) / 1800) * 3;
  ctx.save();
  ctx.translate(0, slide);
  ctx.fillStyle = '#8fd3f4';
  ctx.fill(SWEAT_PATH);
  strokeLine(SWEAT_PATH, '#3b7ea1', 1.2);
  fillEllipse(187.3, 36.5, 1.1, 1.8, 'rgba(255,255,255,0.85)');
  ctx.restore();
}

// A chocolate-chip cookie held up to the mouth, with a bite taken out of
// it and a few crumbs, bobbing slightly as Cookie chews.
function drawLunchCookie(t) {
  const chew = Math.sin(t / 160) * 0.8;
  ctx.save();
  ctx.translate(0, chew);

  ctx.save();
  ctx.clip(BITE_PATH, 'evenodd');
  ctx.beginPath();
  ctx.arc(180, 90, 11, 0, Math.PI * 2);
  ctx.fillStyle = TAG;
  ctx.fill();
  ctx.strokeStyle = TAG_EDGE;
  ctx.lineWidth = 1.4;
  ctx.stroke();
  for (const [x, y, r] of [[176.5, 91, 1.6], [183.5, 86, 1.4], [184, 94.5, 1.5], [179, 96.5, 1.1]]) {
    fillEllipse(x, y, r, r, CHIP);
  }
  ctx.restore();

  for (const [x, y, r] of [[166, 90, 1.1], [163, 95, 0.9], [168.5, 97, 0.8]]) {
    fillEllipse(x, y, r, r, TAG);
  }
  ctx.restore();
}

// Three Z's drifting up past the right ear, fading in and out. Light with
// a dark outline so they read on any desktop behind the transparent window.
function drawSleepZs(t) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(10, 10, 11, 0.85)';
  ctx.fillStyle = NOCTIS_INK;
  for (let i = 0; i < 3; i++) {
    const p = (t / 2400 + i / 3) % 1;
    ctx.globalAlpha = Math.sin(p * Math.PI);
    ctx.font = `bold ${7 + p * 5}px ${TECH_FONT}`;
    const x = 201 + p * 10;
    const y = 14 - p * 24;
    ctx.strokeText('z', x, y);
    ctx.fillText('z', x, y);
  }
  ctx.restore();
}

// One heart floating up from between the ears while Cookie is petted.
function drawPetHeart(t) {
  const p = (t / 1600) % 1;
  ctx.save();
  ctx.globalAlpha = Math.sin(p * Math.PI);
  ctx.translate(150 + Math.sin(p * Math.PI * 2) * 3, 10 - p * 16);
  ctx.scale(1.4, 1.4);
  ctx.fillStyle = '#ff6f91';
  ctx.fill(HEART_PATH);
  ctx.strokeStyle = 'rgba(91, 42, 26, 0.6)';
  ctx.lineWidth = 0.6;
  ctx.stroke(HEART_PATH);
  ctx.restore();
}

// The face follows the status board - ONLINE is the default happy face,
// LUNCH munches a cookie, AFK dozes and BUSY concentrates - with a few
// reactions layered on top (see drawMascotBody):
//   face.petting - cursor resting on Cookie's head: happy eyes, extra blush
//   face.peeking - a key pressed while AFK or at LUNCH: one eye pops open
//   face.panting / face.sweating - the PC (and Cookie) running hot
function drawFace(mood, face, t, look) {
  if (mood !== 'BUSY' || face.petting) {
    fillEllipse(131, 41, 4.6, 2.2, BROW, (-12 * Math.PI) / 180);
    fillEllipse(169, 41, 4.6, 2.2, BROW, (12 * Math.PI) / 180);
  }
  const blush = face.petting ? BLUSH_PETTED : BLUSH;
  fillEllipse(121, 68, 6.5, 3.6, blush);
  fillEllipse(179, 68, 6.5, 3.6, blush);
  for (const [x, y] of [[138.5, 72], [136, 75], [161.5, 72], [164, 75]]) {
    fillEllipse(x, y, 0.9, 0.9, WHISKER_DOT);
  }

  ctx.fillStyle = NOSE;
  ctx.fill(NOSE_PATH);
  fillEllipse(146.5, 65.6, 2.4, 1.3, 'rgba(255,255,255,0.8)');

  if (face.petting) {
    drawHappyEyes();
    drawOpenSmile();
    drawPetHeart(t);
  } else if (mood === 'LUNCH') {
    if (face.peeking) {
      strokeLine('M126.5,55 Q133,46.5 139.5,55', EYE, 2.4);
      drawOpenEye(EYE_RIGHT_X, EYE_Y, look);
    } else {
      drawHappyEyes();
    }
    strokeLine('M150,75.5 L150,78.5 M141,80 C144,84 148,83.5 150,78.5 C152,83.5 156,84 159,80', OUTLINE, 1.6);
    drawLunchCookie(t);
  } else if (mood === 'AFK') {
    strokeLine('M127,53 Q133,58 139,53', EYE, 2.4);
    if (face.peeking) drawOpenEye(EYE_RIGHT_X, EYE_Y, look);
    else strokeLine('M161,53 Q167,58 173,53', EYE, 2.4);
    strokeLine('M150,75.5 L150,78.5 M146,80.5 Q150,83 154,80.5', OUTLINE, 1.6);
    drawSleepZs(t);
  } else if (mood === 'BUSY') {
    // Gently lowered brows and a tongue-tip "blep" of concentration.
    strokeLine('M125.5,44 L139,45.8 M174.5,44 L161,45.8', OUTLINE, 2.4);
    if (face.blinking) {
      drawBlinkEye(EYE_LEFT_X, EYE_Y + 1.5);
      drawBlinkEye(EYE_RIGHT_X, EYE_Y + 1.5);
    } else {
      for (const x of [EYE_LEFT_X, EYE_RIGHT_X]) {
        fillEllipse(x + look.x * 1.2, EYE_Y + 1.5 + look.y * 1.2, 6, 6, EYE);
        fillEllipse(x - 1.8 + look.x * 1.2, EYE_Y - 0.6 + look.y * 1.2, 2, 2, '#ffffff');
      }
    }
    strokeLine('M150,75.5 L150,79 M143.5,81 Q150,79.6 156.5,81', OUTLINE, 1.6);
    ctx.fillStyle = TONGUE;
    ctx.fill(BLEP_PATH);
    strokeLine(BLEP_PATH, OUTLINE, 1.1);
    drawSweat(t);
  } else {
    if (face.blinking) {
      drawBlinkEye(EYE_LEFT_X, EYE_Y);
      drawBlinkEye(EYE_RIGHT_X, EYE_Y);
    } else {
      drawOpenEye(EYE_LEFT_X, EYE_Y, look);
      drawOpenEye(EYE_RIGHT_X, EYE_Y, look);
    }
    if (face.panting) drawPant(t);
    else drawOpenSmile();
  }

  if (face.sweating && mood !== 'BUSY' && mood !== 'AFK' && !face.petting) drawSweat(t);
}

// ---------- Keyboard layout: standard 60% ANSI. No arrow or nav cluster, ----------
// ---------- and every row adds up to exactly 15 units so the board is a  ----------
// ---------- clean rectangle with flush left and right edges.             ----------

// Each entry is [keyName, label, widthInUnits].
//
// keyName must match the name uiohook-napi (see main.js) reports for that
// physical key - e.g. the Windows key comes through as "Meta", not "Win"
// (the label is still "Win" for display). Wide modifiers are labelled with
// symbols (drawn larger) since 6px words blur at widget size. The Fn key is drawn for realism
// but can never light up: on virtually all keyboards Fn is handled purely
// inside the keyboard's own firmware to remap other keys' output, and it
// never generates a scancode the OS (and therefore uiohook) can see.
const ROWS = [
  [['Escape', 'Esc', 1],
   ['1', '1', 1], ['2', '2', 1], ['3', '3', 1], ['4', '4', 1], ['5', '5', 1],
   ['6', '6', 1], ['7', '7', 1], ['8', '8', 1], ['9', '9', 1], ['0', '0', 1], ['Minus', '-', 1],
   ['Equal', '=', 1], ['Backspace', '⌫', 2]],
  [['Tab', '⇥', 1.5], ['Q', 'Q', 1], ['W', 'W', 1], ['E', 'E', 1], ['R', 'R', 1], ['T', 'T', 1],
   ['Y', 'Y', 1], ['U', 'U', 1], ['I', 'I', 1], ['O', 'O', 1], ['P', 'P', 1],
   ['BracketLeft', '[', 1], ['BracketRight', ']', 1], ['Backslash', '\\', 1.5]],
  [['CapsLock', '⇪', 1.75], ['A', 'A', 1], ['S', 'S', 1], ['D', 'D', 1], ['F', 'F', 1], ['G', 'G', 1],
   ['H', 'H', 1], ['J', 'J', 1], ['K', 'K', 1], ['L', 'L', 1], ['Semicolon', ';', 1],
   ['Quote', "'", 1], ['Enter', '⏎', 2.25]],
  [['Shift', '⇧', 2.25], ['Z', 'Z', 1], ['X', 'X', 1], ['C', 'C', 1], ['V', 'V', 1], ['B', 'B', 1],
   ['N', 'N', 1], ['M', 'M', 1], ['Comma', ',', 1], ['Period', '.', 1], ['Slash', '/', 1],
   ['ShiftRight', '⇧', 2.75]],
  [['Ctrl', 'Ctrl', 1.25], ['Meta', 'Win', 1.25], ['Alt', 'Alt', 1.25], ['Space', '', 6.25],
   ['AltRight', 'Alt', 1.25], ['MetaRight', 'Win', 1.25], ['Fn', 'Fn', 1.25], ['CtrlRight', 'Ctrl', 1.25]],
];

// Keys are a touch wider than tall (16 px per unit across, 15 px per row)
// so the 15-unit board spans the scene without running off the canvas.
const UNIT = 16;
const ROW_PITCH = 15;
const GAP = 2;
const ROW_UNITS = Math.max(...ROWS.map((row) => row.reduce((sum, [, , w]) => sum + w, 0)));
const KEYBOARD_WIDTH = ROW_UNITS * UNIT;
const KEYBOARD_TOP = 140;

// The desk the keyboard sits on. Its top edge is just under Cookie's
// chest, so the chair base is hidden behind it and Cookie reads as
// sitting at the desk rather than floating above the keyboard.
const DESK_TOP = KEYBOARD_TOP - 12;

const canvas = document.getElementById('sprite');
const ctx = canvas.getContext('2d');

// The scene is laid out in CSS pixels (the canvas's width/height attributes).
// The backing store is scaled by the display's pixel ratio so outlines and
// small text stay crisp on high-DPI screens; re-checked every frame because
// the widget can be dragged to a monitor with a different scale.
const SCENE_W = canvas.width;
const SCENE_H = canvas.height;
canvas.style.width = `${SCENE_W}px`;
canvas.style.height = `${SCENE_H}px`;
let pixelRatio = 0;

function syncPixelRatio() {
  const dpr = window.devicePixelRatio || 1;
  if (dpr === pixelRatio) return;
  pixelRatio = dpr;
  canvas.width = Math.round(SCENE_W * dpr);
  canvas.height = Math.round(SCENE_H * dpr);
}

const keyboardLeft = (SCENE_W - KEYBOARD_WIDTH) / 2;
const allKeys = [];
ROWS.forEach((row, rowIndex) => {
  let cursor = 0;
  row.forEach(([keyName, label, w]) => {
    allKeys.push({
      keyName,
      label,
      x: keyboardLeft + cursor * UNIT,
      y: KEYBOARD_TOP + rowIndex * ROW_PITCH,
      w: w * UNIT - GAP,
      h: ROW_PITCH - GAP,
    });
    cursor += w;
  });
});
const keyByName = new Map(allKeys.map((k) => [k.keyName, k]));

// ---------- Hands: rest on the home row (F / J), like real touch-typing ----------

const MASCOT_CENTER_X = SCENE_W / 2;
const MASCOT_BODY_BOTTOM = MASCOT_TOP + HEAD_RY * 2;

const leftShoulder = { x: MASCOT_CENTER_X - 26, y: MASCOT_BODY_BOTTOM + 4 };
const rightShoulder = { x: MASCOT_CENTER_X + 26, y: MASCOT_BODY_BOTTOM + 4 };

// Paws rest on the keyboard's top edge, above F and J.
const HOME_Y = KEYBOARD_TOP + 2;
const fKey = keyByName.get('F');
const jKey = keyByName.get('J');
const homeLeft = { x: fKey.x + fKey.w / 2, y: HOME_Y };
const homeRight = { x: jKey.x + jKey.w / 2, y: HOME_Y };

const leftHand = { x: homeLeft.x, y: homeLeft.y, targetKey: null, pressTime: -1000 };
const rightHand = { x: homeRight.x, y: homeRight.y, targetKey: null, pressTime: -1000 };

let lastPulseTime = 0;
let lastKeyName = null;
let lastKeyTime = -1000;

// CPU "heat" in [0, 1]: every keystroke warms the PC tower up a little and
// it cools back down while idle. Drives the temp readout and fan speed.
const HEAT_PER_KEY = 0.035;
const HEAT_COOL_MS = 6000;
let heat = 0;

function onKeyPulse(label) {
  const now = performance.now();
  lastPulseTime = now;
  heat = Math.min(1, heat + HEAT_PER_KEY);
  if (!label || !keyByName.has(label)) return;

  lastKeyName = label;
  lastKeyTime = now;

  const key = keyByName.get(label);
  const keyCenterX = key.x + key.w / 2;
  const hand = keyCenterX < SCENE_W / 2 ? leftHand : rightHand;
  hand.targetKey = key;
  hand.pressTime = now;
}

if (window.widgetAPI && window.widgetAPI.onKeyPulse) {
  window.widgetAPI.onKeyPulse(onKeyPulse);
}

// ---------- Eyes follow the mouse ----------

// Mouse position in canvas pixels (it can be anywhere on screen, so often
// outside the canvas), and the eased direction the eyes currently look in.
let cursorPos = null;
const look = { x: 0, y: 0 };
// Beyond this distance from the eyes, the pupils sit at full reach.
const LOOK_FULL_REACH_PX = 70;

if (window.widgetAPI && window.widgetAPI.onCursorPos) {
  window.widgetAPI.onCursorPos(({ x, y }) => {
    const rect = canvas.getBoundingClientRect();
    cursorPos = { x: x - rect.left, y: y - rect.top };
  });
} else {
  // Plain-browser preview: follow the mouse while it is over the page.
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    cursorPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  });
}

// Easing below is written as "fraction of the remaining distance per 60 Hz
// frame"; this converts it for the actual frame time so motion feels the
// same whether frames come at 30, 60 or 144 Hz.
function easeFactor(perFrame, dt) {
  return 1 - Math.pow(1 - perFrame, dt / (1000 / 60));
}

// Resting the cursor on Cookie's head for a moment counts as petting.
const PET_RADIUS_PX = 40;
const PET_DELAY_MS = 500;
let hoverSince = null;

function isBeingPetted(t, headCenterY) {
  const onHead = cursorPos && Math.hypot(cursorPos.x - MASCOT_CENTER_X, cursorPos.y - headCenterY) < PET_RADIUS_PX;
  if (!onHead) {
    hoverSince = null;
    return false;
  }
  if (hoverSince === null) hoverSince = t;
  return t - hoverSince > PET_DELAY_MS;
}

function updateLook(eyesCenterY, dt) {
  let targetX = 0;
  let targetY = 0;
  if (cursorPos) {
    const dx = cursorPos.x - MASCOT_CENTER_X;
    const dy = cursorPos.y - eyesCenterY;
    const dist = Math.hypot(dx, dy);
    if (dist > 0.5) {
      const reach = Math.min(1, dist / LOOK_FULL_REACH_PX);
      targetX = (dx / dist) * reach;
      targetY = (dy / dist) * reach;
    }
  }
  const k = easeFactor(0.2, dt);
  look.x += (targetX - look.x) * k;
  look.y += (targetY - look.y) * k;
}

function roundRectPath(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// RGB backlight: a Noctis red <-> bright red <-> pink gradient (not the full
// spectrum) sweeping slowly across the keyboard. Interpolated directly
// between three named colors (rather than one HSL formula) so the pink stop
// can be an exact requested hex.
const RGB_DEEP = [0xd1, 0x0a, 0x12]; // NOCTIS_RED
const RGB_RED = [0xff, 0x4d, 0x55]; // NOCTIS_GLOW
const RGB_PINK = [0xff, 0x8d, 0xa1]; // #FF8DA1
const RGB_CYCLE_MS = 5200;

function lerpRgb(a, b, t) {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

// The colour wave runs 3x slower for AFK (the rig "sleeps") and when the
// system asks for reduced motion.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function waveCycleMs() {
  return reducedMotion.matches || currentMood() === 'AFK' ? RGB_CYCLE_MS * 3 : RGB_CYCLE_MS;
}

function rgbWaveColor(t, positionPhase) {
  const swing = Math.sin((t / waveCycleMs() + positionPhase) * Math.PI * 2);
  return swing >= 0 ? lerpRgb(RGB_RED, RGB_DEEP, swing) : lerpRgb(RGB_RED, RGB_PINK, -swing);
}

function keyGlow(key, t) {
  const positionPhase = ((key.x - keyboardLeft) * 0.0035 + key.y * 0.003);
  return rgbWaveColor(t, positionPhase);
}

// Labels stay one steady light tint (not the moving backlight colour) so
// they're readable at the wave's darkest red.
const KEY_LABEL = 'rgba(242, 242, 244, 0.8)';
const isSymbolLabel = (label) => label.codePointAt(0) > 0x2000;

function drawKeyboard(t) {
  // While AFK the backlight dims along with the slower wave.
  const asleep = currentMood() === 'AFK';
  for (const key of allKeys) {
    const isHit = key.keyName === lastKeyName && t - lastKeyTime < 180;
    const glow = keyGlow(key, t);

    roundRectPath(key.x, key.y + (isHit ? 1 : 0), key.w, key.h, 3);
    ctx.fillStyle = isHit ? NOCTIS_INK : '#18181B';
    ctx.fill();
    ctx.save();
    if (!isHit && asleep) ctx.globalAlpha = 0.4;
    ctx.strokeStyle = isHit ? NOCTIS_GLOW : glow;
    ctx.lineWidth = isHit ? 1 : 1.3;
    ctx.stroke();

    if (!isHit) {
      // Soft RGB underglow bleeding out from beneath the keycap.
      ctx.globalAlpha *= 0.4;
      ctx.fillStyle = glow;
      roundRectPath(key.x + 1, key.y + key.h - 3, key.w - 2, 3.5, 1.5);
      ctx.fill();
    }
    ctx.restore();

    if (key.label) {
      ctx.fillStyle = isHit ? NOCTIS_RED : KEY_LABEL;
      if (isSymbolLabel(key.label)) {
        ctx.font = '9px "Segoe UI Symbol", "Segoe UI", sans-serif';
      } else {
        const fontSize = key.label.length > 3 ? 6.5 : key.label.length > 1 ? 7 : 9;
        ctx.font = `${fontSize}px "Segoe UI", Arial, sans-serif`;
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(key.label, key.x + key.w / 2, key.y + key.h / 2 + (isHit ? 1 : 0) + 1);
    }
  }
}

// Eases a hand from wherever it is toward its target key (if actively
// pressing one) or back to its home-row resting spot otherwise.
function updateHand(hand, home, t, dt) {
  let targetX = home.x;
  let targetY = home.y;

  if (hand.targetKey) {
    const dt = t - hand.pressTime;
    if (dt < 420) {
      const key = hand.targetKey;
      let pressAmount;
      if (dt < 50) pressAmount = dt / 50;
      else if (dt < 150) pressAmount = 1;
      else pressAmount = Math.max(0, 1 - (dt - 150) / 270);

      targetX = key.x + key.w / 2;
      targetY = home.y + pressAmount * (key.y - home.y + 4);
    } else {
      hand.targetKey = null;
    }
  }

  const k = easeFactor(0.35, dt);
  hand.x += (targetX - hand.x) * k;
  hand.y += (targetY - hand.y) * k;
}

function drawArm(shoulder, hand) {
  const bendDir = shoulder.x < SCENE_W / 2 ? -1 : 1;
  const elbowX = (shoulder.x + hand.x) / 2 + bendDir * 6;
  const elbowY = (shoulder.y + hand.y) / 2 + 4;

  // A chunky outlined leg: a thick outline pass with the fur stroke on top.
  const limb = new Path2D();
  limb.moveTo(shoulder.x, shoulder.y);
  limb.quadraticCurveTo(elbowX, elbowY, hand.x, hand.y);
  strokeLine(limb, OUTLINE, 11);
  strokeLine(limb, ARM_FUR, 7.6);

  // Paw: a round cream mitt with three toe creases, drawn around the
  // origin so its gradient and crease paths can be built once.
  ctx.save();
  ctx.translate(hand.x, hand.y);
  ctx.beginPath();
  ctx.ellipse(0, -1, 7, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = cachedGradient('paw', () => {
    const gradient = ctx.createRadialGradient(-2, -3, 1, 0, -1, 7);
    gradient.addColorStop(0, WHITE);
    gradient.addColorStop(1, '#f1dfcb');
    return gradient;
  });
  ctx.fill();
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 1.6;
  ctx.stroke();
  strokeLine('M-2.6,-3.4 L-2.6,-0.6 M0,-3.8 L0,-1 M2.6,-3.4 L2.6,-0.6', 'rgba(91, 52, 24, 0.45)', 1.1);
  ctx.restore();
}

// A racing-style gaming chair: one wide high-back panel (with bolster
// bumps and a racing stripe) behind the mascot, a cushioned seat, a thick
// gas-lift pole, and a 5-star base on casters. Drawn before the mascot so
// the head/arms sit in front of (and mostly hide) the panel directly
// behind them - only its edges and the stripe below the chin peek through.
function drawChair() {
  const cx = SCENE_W / 2;
  const backTop = MASCOT_TOP + 20;
  const backBottom = MASCOT_BODY_BOTTOM + 4;
  const backW = 104;
  const seatY = backBottom;
  const seatW = 88;
  const seatH = 12;
  const poleW = 8;
  const poleH = 16;
  const hubY = seatY + seatH + poleH;
  const legLen = 24;
  const legCount = 5;

  const BODY = '#28282d';
  const BODY_DARK = '#1a1a1e';
  const ACCENT = NOCTIS_RED;

  // High-back panel, with rounded bolster bumps bulging out at shoulder
  // height for a racing-seat silhouette.
  roundRectPath(cx - backW / 2, backTop, backW, backBottom - backTop, 16);
  ctx.fillStyle = BODY;
  ctx.fill();
  ctx.strokeStyle = BODY_DARK;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const bolsterY = backTop + (backBottom - backTop) * 0.55;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(cx + side * (backW / 2 - 2), bolsterY, 9, 20, 0, 0, Math.PI * 2);
    ctx.fillStyle = BODY;
    ctx.fill();
    ctx.strokeStyle = BODY_DARK;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Racing stripe down the middle of the backrest.
  ctx.fillStyle = ACCENT;
  roundRectPath(cx - 4, backTop + 8, 8, backBottom - backTop - 16, 3);
  ctx.fill();

  // Seat cushion.
  roundRectPath(cx - seatW / 2, seatY, seatW, seatH, 5);
  ctx.fillStyle = BODY;
  ctx.fill();
  ctx.strokeStyle = BODY_DARK;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = ACCENT;
  roundRectPath(cx - seatW / 2 + 8, seatY + seatH - 4.5, seatW - 16, 2.5, 1.2);
  ctx.fill();

  // Gas-lift pole.
  roundRectPath(cx - poleW / 2, seatY + seatH, poleW, poleH, 3);
  ctx.fillStyle = BODY;
  ctx.fill();
  ctx.strokeStyle = BODY_DARK;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 5-star base with caster wheels.
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  for (let i = 0; i < legCount; i++) {
    const angle = (20 + i * (140 / (legCount - 1))) * (Math.PI / 180);
    const legEndX = cx + Math.cos(angle) * legLen;
    const legEndY = hubY + Math.sin(angle) * legLen * 0.4;

    ctx.strokeStyle = BODY;
    ctx.beginPath();
    ctx.moveTo(cx, hubY);
    ctx.lineTo(legEndX, legEndY);
    ctx.stroke();

    ctx.fillStyle = BODY_DARK;
    ctx.beginPath();
    ctx.arc(legEndX, legEndY, 3.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function currentMood() {
  return STATUSES[statusIndex].label;
}

// Blinks come at irregular 2.5-6 s gaps, now and then as a quick double.
const BLINK_MS = 150;
let blinkStarts = [1500];

function isBlinking(t) {
  if (t > blinkStarts[blinkStarts.length - 1] + BLINK_MS) {
    const next = t + 2500 + Math.random() * 3500;
    blinkStarts = Math.random() < 0.2 ? [next, next + 280] : [next];
  }
  return blinkStarts.some((start) => t >= start && t < start + BLINK_MS);
}

// A keystroke while AFK or at LUNCH makes Cookie peek with one eye.
const PEEK_MS = 800;

function drawMascotBody(t, dt) {
  const mood = currentMood();
  const bob = reducedMotion.matches ? 0 : Math.sin(t / 600) * 1.5;
  const petting = isBeingPetted(t, DESIGN_CY + MASCOT_SHIFT_Y + bob);
  const face = {
    blinking: isBlinking(t),
    petting,
    peeking: (mood === 'AFK' || mood === 'LUNCH') && t - lastPulseTime < PEEK_MS,
    panting: mood === 'ONLINE' && heat > 0.75,
    sweating: heat > 0.85,
  };

  ctx.save();
  ctx.translate(MASCOT_CENTER_X - DESIGN_CX, MASCOT_SHIFT_Y + bob);

  // Ears drawn first so the head fill covers each ear's base.
  drawEars(petting ? (6 * Math.PI) / 180 : 0);

  // Fur lit from the upper-left for a soft cel-shaded roundness.
  ctx.fillStyle = cachedGradient('head', () => {
    const gradient = ctx.createRadialGradient(138, 37, 4, 138, 37, 70);
    gradient.addColorStop(0, FUR_LIGHT);
    gradient.addColorStop(0.55, FUR);
    gradient.addColorStop(1, FUR_SHADE);
    return gradient;
  });
  ctx.fill(HEAD_PATH);
  fillEllipse(137, 27, 13, 6, 'rgba(255,255,255,0.18)', (-18 * Math.PI) / 180);

  // Blaze clipped to the head, then the outline redrawn over its edge.
  ctx.save();
  ctx.clip(HEAD_PATH);
  ctx.fillStyle = cachedGradient('blaze', () => linearGradient(0, 28, 0, 94, [[0, WHITE], [1, WHITE_SHADE]]));
  ctx.fill(BLAZE_PATH);
  ctx.restore();
  strokeLine(HEAD_PATH, OUTLINE, 2.2);

  updateLook(EYE_Y + MASCOT_SHIFT_Y + bob, dt);
  drawFace(mood, face, t, look);
  ctx.restore();
}

// ---------- Clock: a little gaming-peripheral-style OLED readout ----------
// ---------- next to the corgi, in the free space beside the chair. ----------

function formatClock12h(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return { time: `${hours}:${mm}`, ampm };
}

const CLOCK_X = 12;
const CLOCK_Y = 14;
const CLOCK_W = 74;
const CLOCK_H = 34;

function drawClock(t) {
  // Thin RGB ring, matching the keyboard's backlight, framing the screen.
  roundRectPath(CLOCK_X - 2, CLOCK_Y - 2, CLOCK_W + 4, CLOCK_H + 4, 10);
  ctx.strokeStyle = rgbWaveColor(t, 0);
  ctx.lineWidth = 2;
  ctx.stroke();

  // Dark OLED-style screen.
  roundRectPath(CLOCK_X, CLOCK_Y, CLOCK_W, CLOCK_H, 8);
  ctx.fillStyle = '#0A0A0B';
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.stroke();

  const { time, ampm } = formatClock12h(new Date());

  ctx.save();
  ctx.shadowColor = NOCTIS_GLOW;
  ctx.shadowBlur = 6;
  ctx.fillStyle = NOCTIS_INK;
  ctx.font = `bold 15px ${TECH_FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(time, CLOCK_X + CLOCK_W / 2, CLOCK_Y + 14);
  ctx.restore();

  ctx.fillStyle = NOCTIS_SOFT;
  ctx.font = `bold 8px ${TECH_FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(ampm, CLOCK_X + CLOCK_W / 2, CLOCK_Y + 27);
}

// ---------- Status board: mirrors the clock on the right, click to cycle ----------
// ---------- through ONLINE / LUNCH / AFK / BUSY.                          ----------

const STATUSES = [
  { label: 'ONLINE', color: '#5be07a' },
  { label: 'LUNCH', color: '#ffb454' },
  { label: 'AFK', color: '#9aa5b1' },
  { label: 'BUSY', color: '#ff5468' },
];

let statusIndex = 0;

function cycleStatus() {
  statusIndex = (statusIndex + 1) % STATUSES.length;
}

const STATUS_W = 74;
const STATUS_H = 34;
const STATUS_X = SCENE_W - CLOCK_X - STATUS_W;
const STATUS_Y = CLOCK_Y;

const statusHitEl = document.getElementById('statusHit');
statusHitEl.style.left = `${STATUS_X - 2}px`;
statusHitEl.style.top = `${STATUS_Y - 2}px`;
statusHitEl.style.width = `${STATUS_W + 4}px`;
statusHitEl.style.height = `${STATUS_H + 4}px`;
statusHitEl.addEventListener('click', cycleStatus);

function drawStatusBoard(t) {
  // Thin RGB ring, matching the clock's frame.
  roundRectPath(STATUS_X - 2, STATUS_Y - 2, STATUS_W + 4, STATUS_H + 4, 10);
  ctx.strokeStyle = rgbWaveColor(t, 0.5);
  ctx.lineWidth = 2;
  ctx.stroke();

  // Dark OLED-style screen.
  roundRectPath(STATUS_X, STATUS_Y, STATUS_W, STATUS_H, 8);
  ctx.fillStyle = '#0A0A0B';
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.stroke();

  const status = STATUSES[statusIndex];
  const centerX = STATUS_X + STATUS_W / 2;
  const midY = STATUS_Y + 15;
  const dotR = 3.5;
  const gap = 5;

  ctx.font = `bold 13px ${TECH_FONT}`;
  const textWidth = ctx.measureText(status.label).width;
  const groupWidth = dotR * 2 + gap + textWidth;
  const groupLeft = centerX - groupWidth / 2;
  const dotCx = groupLeft + dotR;
  const textLeft = groupLeft + dotR * 2 + gap;

  ctx.save();
  ctx.shadowColor = status.color;
  ctx.shadowBlur = 6;

  ctx.fillStyle = status.color;
  ctx.beginPath();
  ctx.arc(dotCx, midY, dotR, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(status.label, textLeft, midY);
  ctx.restore();

  ctx.fillStyle = '#8E8E96';
  ctx.font = `bold 7px ${TECH_FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('STATUS · CLICK', centerX, STATUS_Y + 27);
}

// ---------- Desk: a wooden desktop with a dark desk mat under the keyboard ----------

function drawDesk() {
  const deskLeft = 4;
  const deskW = SCENE_W - deskLeft * 2;

  const wood = cachedGradient('wood', () =>
    linearGradient(0, DESK_TOP, 0, SCENE_H, [[0, '#6a4a34'], [0.15, '#553b2a'], [1, '#3d2a1e']])
  );
  ctx.beginPath();
  ctx.moveTo(deskLeft, SCENE_H);
  ctx.lineTo(deskLeft, DESK_TOP + 6);
  ctx.arcTo(deskLeft, DESK_TOP, deskLeft + 6, DESK_TOP, 6);
  ctx.lineTo(deskLeft + deskW - 6, DESK_TOP);
  ctx.arcTo(deskLeft + deskW, DESK_TOP, deskLeft + deskW, DESK_TOP + 6, 6);
  ctx.lineTo(deskLeft + deskW, SCENE_H);
  ctx.closePath();
  ctx.fillStyle = wood;
  ctx.fill();

  // Lit front edge of the desktop.
  ctx.strokeStyle = '#8a6448';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(deskLeft + 6, DESK_TOP + 0.75);
  ctx.lineTo(deskLeft + deskW - 6, DESK_TOP + 0.75);
  ctx.stroke();

  // Faint wood grain.
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
  ctx.lineWidth = 1;
  for (const y of [DESK_TOP + 14, DESK_TOP + 37, DESK_TOP + 61, DESK_TOP + 82]) {
    ctx.beginPath();
    ctx.moveTo(deskLeft + 4, y);
    ctx.bezierCurveTo(80, y - 3, 200, y + 3, deskLeft + deskW - 4, y);
    ctx.stroke();
  }

  // Desk mat under the keyboard.
  const keyboardH = ROWS.length * ROW_PITCH - GAP;
  roundRectPath(keyboardLeft - 7, KEYBOARD_TOP - 6, KEYBOARD_WIDTH + 12, keyboardH + 11, 6);
  ctx.fillStyle = '#141416';
  ctx.fill();
  ctx.strokeStyle = '#0e0e11';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Red stitched edge, like a gaming mat.
  roundRectPath(keyboardLeft - 5, KEYBOARD_TOP - 4, KEYBOARD_WIDTH + 8, keyboardH + 7, 5);
  ctx.strokeStyle = 'rgba(209, 10, 18, 0.55)';
  ctx.setLineDash([2, 1.5]);
  ctx.stroke();
  ctx.setLineDash([]);
}

// ---------- PC tower: a pocket-sized Noctis N-9 on the desk, mirroring the ----------
// ---------- name tag on the other side. Typing heats the CPU, the temp     ----------
// ---------- readout climbs and the fans spin up; idle, it all cools down.  ----------

const TOWER_W = 60;
const TOWER_H = 74;
const TOWER_LEFT = keyboardLeft;
const TOWER_BOTTOM = DESK_TOP + 4;
const TOWER_TOP = TOWER_BOTTOM - 2 - TOWER_H;

// One fan blade in unit space (hub at the origin, tip about 1 out),
// rescaled from the design's 100x100 fan.
const FAN_BLADE = new Path2D('M0,0 C0.05,-0.4 0.325,-0.75 0.75,-0.775 C0.6,-0.425 0.35,-0.15 0,0 Z');
// Fan speed in radians per ms, idle to flat out.
const FAN_IDLE_SPEED = 0.005;
const FAN_MAX_SPEED = 0.03;
let fanAngle = 0;

function drawFan(x, y, r, blades) {
  ctx.save();
  ctx.translate(x, y);
  fillEllipse(0, 0, r, r, '#0A0A0B');

  ctx.save();
  ctx.rotate(fanAngle);
  ctx.scale(r * 0.85, r * 0.85);
  ctx.fillStyle = '#3A3A42';
  for (let i = 0; i < blades; i++) {
    ctx.rotate((Math.PI * 2) / blades);
    ctx.fill(FAN_BLADE);
  }
  ctx.restore();
  fillEllipse(0, 0, r * 0.3, r * 0.3, '#141416');

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.strokeStyle = NOCTIS_RED;
  ctx.lineWidth = Math.max(0.9, r * 0.2);
  ctx.shadowColor = NOCTIS_GLOW;
  ctx.shadowBlur = 2 + heat * 5;
  ctx.stroke();
  ctx.restore();
}

// AIO tubes from the pump to the front radiator (constant, so built once).
const TUBE_PATHS = [[13, 7], [19, 16]].map(([fromY, toY]) => {
  const gx = TOWER_LEFT + 3;
  const gy = TOWER_TOP + 3;
  const tube = new Path2D();
  tube.moveTo(gx + 27, gy + fromY);
  tube.bezierCurveTo(gx + 36, gy + fromY, gx + 34, gy + toY, gx + 41, gy + toY);
  return tube;
});

// Above this heat the rig is "overclocked": the power LED flickers and the
// readout reads OC.
const OVERCLOCK_HEAT = 0.95;

function drawPcTower(t) {
  const overclocked = heat > OVERCLOCK_HEAT;
  const x = TOWER_LEFT;
  const y = TOWER_TOP;

  // Red light spilling onto the desk under the case.
  const spillX = x + TOWER_W / 2;
  const spill = ctx.createRadialGradient(spillX, TOWER_BOTTOM, 2, spillX, TOWER_BOTTOM, 44);
  spill.addColorStop(0, `rgba(209, 10, 18, ${0.3 + heat * 0.25})`);
  spill.addColorStop(1, 'rgba(209, 10, 18, 0)');
  fillEllipse(spillX, TOWER_BOTTOM, 44, 7, spill);

  // Feet, case and the little red power button on top.
  ctx.fillStyle = '#18181B';
  ctx.fillRect(x + 5, TOWER_BOTTOM - 2, 12, 2);
  ctx.fillRect(x + TOWER_W - 17, TOWER_BOTTOM - 2, 12, 2);
  ctx.fillStyle = overclocked && Math.floor(t / 120) % 2 ? '#5A0006' : NOCTIS_RED;
  ctx.fillRect(x + TOWER_W - 11, y - 1.5, 5, 1.5);

  roundRectPath(x, y, TOWER_W, TOWER_H, 3);
  ctx.fillStyle = '#0D0D0F';
  ctx.fill();
  ctx.strokeStyle = NOCTIS_EDGE;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Everything below is seen through the tempered-glass side panel.
  const gx = x + 3;
  const gy = y + 3;
  const gw = TOWER_W - 6;
  const gh = TOWER_H - 6;
  ctx.save();
  roundRectPath(gx, gy, gw, gh, 2);
  ctx.clip();

  const inner = ctx.createRadialGradient(gx + gw / 2, gy + gh / 2, 8, gx + gw / 2, gy + gh / 2, 44);
  inner.addColorStop(0, '#08080A');
  inner.addColorStop(1, `rgba(209, 10, 18, ${0.18 + heat * 0.2})`);
  ctx.fillStyle = '#08080A';
  ctx.fillRect(gx, gy, gw, gh);
  ctx.fillStyle = inner;
  ctx.fillRect(gx, gy, gw, gh);

  // Rear exhaust fan.
  drawFan(gx + 7, gy + 9, 5, 7);

  // Motherboard with a red-capped VRM heatsink.
  ctx.fillStyle = '#121214';
  ctx.fillRect(gx + 14, gy + 3, 24, 40);
  ctx.strokeStyle = '#26262A';
  ctx.lineWidth = 0.6;
  ctx.strokeRect(gx + 14, gy + 3, 24, 40);
  ctx.fillStyle = NOCTIS_PART;
  ctx.fillRect(gx + 15.5, gy + 5, 4, 15);
  ctx.fillRect(gx + 18, gy + 33, 16, 2.5);
  ctx.fillStyle = NOCTIS_RED;
  ctx.fillRect(gx + 15.5, gy + 5, 4, 1);
  ctx.fillRect(gx + 19, gy + 33.7, 6, 1);

  // RAM sticks with glowing red tops.
  ctx.save();
  ctx.shadowColor = NOCTIS_GLOW;
  ctx.shadowBlur = 3 + heat * 4;
  for (const sx of [31, 33.4, 35.8]) {
    ctx.fillStyle = '#1A1A1D';
    ctx.fillRect(gx + sx, gy + 5, 1.5, 14);
    ctx.fillStyle = NOCTIS_RED;
    ctx.fillRect(gx + sx, gy + 5, 1.5, 2);
  }
  ctx.restore();

  for (const tube of TUBE_PATHS) {
    strokeLine(tube, NOCTIS_EDGE, 2.4);
    strokeLine(tube, '#141416', 1.4);
  }

  // CPU pump: a red ring that glows hotter as the CPU warms up.
  roundRectPath(gx + 17, gy + 10, 13, 13, 2.5);
  ctx.fillStyle = '#151517';
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(gx + 23.5, gy + 16.5, 4.6, 0, Math.PI * 2);
  ctx.fillStyle = '#0A0A0B';
  ctx.fill();
  ctx.strokeStyle = NOCTIS_RED;
  ctx.lineWidth = 1.4;
  ctx.shadowColor = NOCTIS_GLOW;
  ctx.shadowBlur = 4 + heat * 8;
  ctx.stroke();
  ctx.restore();

  // Front radiator with three intake fans.
  ctx.fillStyle = '#151517';
  ctx.fillRect(gx + 40, gy + 2, 13, 44);
  for (const fy of [9, 23, 37]) drawFan(gx + 46.5, gy + fy, 5.6, 7);

  // Triple-fan graphics card.
  roundRectPath(gx + 2, gy + 46, 38, 10, 1.5);
  ctx.fillStyle = '#121214';
  ctx.fill();
  ctx.fillStyle = NOCTIS_RED;
  ctx.fillRect(gx + 3, gy + 46, 36, 1);
  for (const fx of [8, 17, 26]) drawFan(gx + fx, gy + 51.5, 3.8, 9);
  ctx.fillStyle = '#0A0A0B';
  ctx.fillRect(gx + 32.5, gy + 48.5, 5.5, 6);

  // PSU shroud doubling as the CPU temperature readout.
  ctx.fillStyle = '#111113';
  ctx.fillRect(gx, gy + gh - 11, gw, 11);
  ctx.fillStyle = 'rgba(209, 10, 18, 0.8)';
  ctx.fillRect(gx, gy + gh - 11, gw, 0.8);
  ctx.fillStyle = NOCTIS_RED;
  ctx.fillRect(gx + 4, gy + gh - 8, 1.5, 6);

  const temp = Math.round(36 + heat * 48);
  ctx.save();
  ctx.shadowColor = NOCTIS_GLOW;
  ctx.shadowBlur = 3 + heat * 5;
  ctx.fillStyle = heat > 0.7 ? NOCTIS_SOFT : NOCTIS_INK;
  ctx.font = `bold 8px ${TECH_FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(overclocked ? `OC ${temp}°` : `${temp}°C`, gx + 8, gy + gh - 4.6);
  ctx.restore();
  for (let dx = 0; dx < 3; dx++) {
    for (let dy = 0; dy < 2; dy++) {
      fillEllipse(gx + gw - 10 + dx * 3, gy + gh - 7 + dy * 3, 0.7, 0.7, '#2A2A2E');
    }
  }

  // Glass reflections.
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.beginPath();
  ctx.moveTo(gx + 26, gy);
  ctx.lineTo(gx + 33, gy);
  ctx.lineTo(gx + 10, gy + gh);
  ctx.lineTo(gx + 3, gy + gh);
  ctx.fill();
  ctx.restore();

  roundRectPath(gx, gy, gw, gh, 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 0.8;
  ctx.stroke();
}

// ---------- Name tag: a dark anodised desk plate reading "COOKIE", ----------
// ---------- mirroring the PC tower on the other side of the desk.  ----------

const TAG_W = 76;
const TAG_H = 34;
const TAG_RIGHT = keyboardLeft + KEYBOARD_WIDTH;
const TAG_LEFT = TAG_RIGHT - TAG_W;
const TAG_BOTTOM = DESK_TOP + 4;
const TAG_TOP = TAG_BOTTOM - TAG_H;

function drawNameTag() {
  const cx = TAG_LEFT + TAG_W / 2;

  // Dark anodised plate with faint brushed streaks.
  roundRectPath(TAG_LEFT, TAG_TOP, TAG_W, TAG_H, 3);
  ctx.fillStyle = cachedGradient('plate', () =>
    linearGradient(0, TAG_TOP, 0, TAG_BOTTOM, [[0, '#1E1E22'], [0.5, '#141416'], [1, '#0A0A0B']])
  );
  ctx.fill();
  ctx.strokeStyle = NOCTIS_EDGE;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.save();
  roundRectPath(TAG_LEFT, TAG_TOP, TAG_W, TAG_H, 3);
  ctx.clip();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  for (let y = TAG_TOP + 2; y < TAG_BOTTOM; y += 2.5) {
    ctx.beginPath();
    ctx.moveTo(TAG_LEFT, y);
    ctx.lineTo(TAG_RIGHT, y);
    ctx.stroke();
  }
  ctx.restore();

  // Inner frame with red corner ticks, echoing an engraved plate's border.
  const inset = 4;
  roundRectPath(TAG_LEFT + inset, TAG_TOP + inset, TAG_W - inset * 2, TAG_H - inset * 2, 1);
  ctx.strokeStyle = '#3A3A40';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.strokeStyle = NOCTIS_RED;
  const tick = 3;
  for (const [cxSign, cySign] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
    const cornerX = cxSign > 0 ? TAG_RIGHT - inset : TAG_LEFT + inset;
    const cornerY = cySign > 0 ? TAG_BOTTOM - inset : TAG_TOP + inset;
    ctx.beginPath();
    ctx.moveTo(cornerX - cxSign * tick, cornerY);
    ctx.lineTo(cornerX, cornerY);
    ctx.lineTo(cornerX, cornerY - cySign * tick);
    ctx.stroke();
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.save();
  ctx.shadowColor = NOCTIS_GLOW;
  ctx.shadowBlur = 4;
  ctx.fillStyle = NOCTIS_INK;
  ctx.font = `bold 13px ${TECH_FONT}`;
  ctx.letterSpacing = '1px';
  ctx.fillText('COOKIE', cx, TAG_TOP + 14);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = NOCTIS_SOFT;
  ctx.font = `bold 6.5px ${TECH_FONT}`;
  ctx.letterSpacing = '1.5px';
  ctx.fillText('GOOD BOY', cx, TAG_TOP + 25);
  ctx.restore();
}

// Frames are capped at ~30 fps while nothing fast is happening (the idle
// bob, fans and colour wave look the same) and run at the display's full
// rate for a couple of seconds after each keystroke so typing stays smooth.
const IDLE_FRAME_MS = 1000 / 30;
const ACTIVE_AFTER_KEY_MS = 2000;
let lastFrameTime = null;

function frame(t) {
  requestAnimationFrame(frame);
  const typing = t - lastPulseTime < ACTIVE_AFTER_KEY_MS;
  if (!typing && lastFrameTime !== null && t - lastFrameTime < IDLE_FRAME_MS - 2) return;

  // Cooling uses the real time since the last frame, so heat built up while
  // frames were paused (window hidden) has cooled by the time it's shown.
  // Animation steps are clamped so nothing jumps after a pause.
  const elapsed = lastFrameTime === null ? 0 : t - lastFrameTime;
  const dt = Math.min(100, elapsed);
  lastFrameTime = t;
  heat *= Math.exp(-elapsed / HEAT_COOL_MS);
  // While AFK the rig idles: fans stay at their slowest.
  const fanHeat = currentMood() === 'AFK' ? 0 : heat;
  fanAngle = (fanAngle + dt * (FAN_IDLE_SPEED + fanHeat * (FAN_MAX_SPEED - FAN_IDLE_SPEED))) % (Math.PI * 2);

  syncPixelRatio();
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.clearRect(0, 0, SCENE_W, SCENE_H);

  drawClock(t);
  drawStatusBoard(t);
  drawChair();
  drawTorso();
  drawDesk();
  drawPcTower(t);
  drawNameTag();
  drawKeyboard(t);

  updateHand(leftHand, homeLeft, t, dt);
  updateHand(rightHand, homeRight, t, dt);
  drawArm(leftShoulder, leftHand);
  drawArm(rightShoulder, rightHand);

  drawMascotBody(t, dt);
}

requestAnimationFrame(frame);
