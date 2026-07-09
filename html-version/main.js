const cameraLayer = document.getElementById("cameraLayer");
const cameraCanvas = document.getElementById("cameraCanvas");
const cameraHud = document.getElementById("cameraHud");
const cctvButton = document.getElementById("cctvButton");
const cameraState = document.getElementById("cameraState");
const cameraStatic = document.getElementById("cameraStatic");
const cameraBlipFlash = document.getElementById("cameraBlipFlash");
const cam4FeedImage = document.getElementById("cam4FeedImage");
const feedButton = document.getElementById("feedButton");
const musicBoxMeter = document.getElementById("musicBoxMeter");
const musicBoxFill = document.getElementById("musicBoxFill");
const feedCooldownLabel = document.getElementById("feedCooldownLabel");
const powerValue = document.getElementById("powerValue");
const usageBars = [...document.querySelectorAll("[data-usage-bar]")];
const context = cameraCanvas.getContext("2d", { alpha: false });
const leftPanelImage = document.getElementById("leftPanelImage");
const rightPanelImage = document.getElementById("rightPanelImage");
const leftDoorOverlay = document.getElementById("leftDoorOverlay");
const rightDoorOverlay = document.getElementById("rightDoorOverlay");
const leftDoorVisitor = document.getElementById("leftDoorVisitor");
const rightDoorVisitor = document.getElementById("rightDoorVisitor");
const leftLightBeam = document.getElementById("leftLightBeam");
const rightLightBeam = document.getElementById("rightLightBeam");
const officeControlButtons = [...document.querySelectorAll("[data-side][data-action]")];
const cameraMapButtons = [...document.querySelectorAll("[data-camera-id]")];
const timeValue = document.getElementById("timeValue");
const timeDisplayEl = document.querySelector(".time-display");
const timeNight = document.querySelector(".time-night");
const jumpscareOverlay = document.getElementById("jumpscareOverlay");
const jumpscareSprite = document.getElementById("jumpscareSprite");
const deathStaticScreen = document.getElementById("deathStaticScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const victoryScreen = document.getElementById("victoryScreen");
const mainMenu = document.getElementById("mainMenu");
const menuNightLabel = document.getElementById("menuNightLabel");
const startGameButton = document.getElementById("startGameButton");
const quitGameButton = document.getElementById("quitGameButton");
const nightIntro = document.getElementById("nightIntro");
const nightIntroText = document.getElementById("nightIntroText");
const nightIntroBlip = document.getElementById("nightIntroBlip");

const cameraSprite = new Image();
cameraSprite.src = "./assets/sprites/office-camera.png";

const cameraLoadSound = new Audio("./assets/audio/camera-video-load.mp3");
cameraLoadSound.preload = "auto";

const cameraPutDownSound = new Audio("./assets/audio/put-down.mp3");
cameraPutDownSound.preload = "auto";

const cameraSwitchSound = new Audio("./assets/audio/blip3.mp3");
cameraSwitchSound.preload = "auto";

const doorToggleSound = new Audio("./assets/audio/door-toggle.mp3");
doorToggleSound.preload = "auto";

const lightHumSound = new Audio("./assets/audio/light-hum.mp3");
lightHumSound.preload = "auto";
lightHumSound.loop = true;

const doorRevealSound = new Audio("./assets/audio/windowscare.mp3");
doorRevealSound.preload = "auto";

const errorSound = new Audio("./assets/audio/Error.mp3");
errorSound.preload = "auto";

const xscreamSound = new Audio("./assets/audio/Xscream.mp3");
xscreamSound.preload = "auto";

const deathStaticSound = new Audio("./assets/audio/death-static.mp3");
deathStaticSound.preload = "auto";
deathStaticSound.loop = true;

const chimesSound = new Audio("./assets/audio/chimes-2.mp3");
chimesSound.preload = "auto";

const menuMusic = new Audio("./assets/audio/darkness-music.mp3");
menuMusic.preload = "auto";
menuMusic.loop = true;
menuMusic.volume = 0.55;

function preventDefaultInteraction(event) {
  event.preventDefault();
}

document.addEventListener("dragstart", preventDefaultInteraction);
document.addEventListener("selectstart", preventDefaultInteraction);
document.addEventListener("contextmenu", preventDefaultInteraction);
for (const image of document.querySelectorAll("img")) {
  image.draggable = false;
}

const frame = {
  width: 1280,
  height: 720,
  stepX: 1282,
  stepY: 722,
  offsetX: 2,
  offsetY: 2,
  count: 11,
  columns: 4
};

const cam4FeedFrames = [
  "./assets/sprites/cctv-cam-4-feed-0.png",
  "./assets/sprites/cctv-cam-4-feed-1.png",
  "./assets/sprites/cctv-cam-4-feed-2.png",
  "./assets/sprites/cctv-cam-4-feed-3.png"
];
const musicBoxJumpscareSprite = "./assets/sprites/music-box-kim.png";
const musicBoxMax = 100;
let musicBoxDrainPerSecond = 2.8;
const musicBoxWindPerSecond = 20;
const musicBoxSaveThreshold = 25;
const musicBoxWarningThreshold = 35;
const musicBoxCriticalThreshold = 15;
let musicBoxEscapeDelayMs = 10000;
let doorAttackGraceMs = 10000;
const doorHoldToRepelMs = 2500;
const doorLockoutJumpscareDelayMs = 10000;
const batteryDrainTickMs = 1000;
let secondsPerPercentAtOneBar = 12;
const doorStage = 4;
const maxNight = 5;
const nightDifficulties = {
  1: {
    musicBoxDrainPerSecond: 0.75,
    musicBoxEscapeDelayMs: 18000,
    doorAttackGraceMs: 18000,
    secondsPerPercentAtOneBar: 28,
    leftStartDelayMs: 45000,
    leftIntervalMs: 65000,
    leftReturnDelayMs: 52000,
    rightStartDelayMs: 60000,
    rightIntervalMs: 76000,
    rightReturnDelayMs: 62000
  },
  2: {
    musicBoxDrainPerSecond: 1.15,
    musicBoxEscapeDelayMs: 16000,
    doorAttackGraceMs: 16000,
    secondsPerPercentAtOneBar: 23,
    leftStartDelayMs: 34000,
    leftIntervalMs: 50000,
    leftReturnDelayMs: 42000,
    rightStartDelayMs: 46000,
    rightIntervalMs: 60000,
    rightReturnDelayMs: 50000
  },
  3: {
    musicBoxDrainPerSecond: 1.75,
    musicBoxEscapeDelayMs: 14000,
    doorAttackGraceMs: 14000,
    secondsPerPercentAtOneBar: 18,
    leftStartDelayMs: 24000,
    leftIntervalMs: 36000,
    leftReturnDelayMs: 33000,
    rightStartDelayMs: 33000,
    rightIntervalMs: 45000,
    rightReturnDelayMs: 39000
  },
  4: {
    musicBoxDrainPerSecond: 2.25,
    musicBoxEscapeDelayMs: 12000,
    doorAttackGraceMs: 12000,
    secondsPerPercentAtOneBar: 15,
    leftStartDelayMs: 15000,
    leftIntervalMs: 25000,
    leftReturnDelayMs: 26000,
    rightStartDelayMs: 22000,
    rightIntervalMs: 31000,
    rightReturnDelayMs: 31000
  },
  5: {
    musicBoxDrainPerSecond: 2.8,
    musicBoxEscapeDelayMs: 10000,
    doorAttackGraceMs: 10000,
    secondsPerPercentAtOneBar: 12,
    leftStartDelayMs: 9000,
    leftIntervalMs: 17000,
    leftReturnDelayMs: 22000,
    rightStartDelayMs: 13000,
    rightIntervalMs: 21000,
    rightReturnDelayMs: 26000
  }
};

let cameraOpen = false;
let animating = false;
let currentFrame = 0;
let animationId = 0;
let selectedCameraId = "3";
let staticFadeTimeout = 0;
let blipFlashTimeout = 0;
let musicBoxLevel = musicBoxMax;
let musicBoxEscapeAt = 0;
let musicBoxEscapeStartedAt = 0;
let musicBoxRoamStage = 0;
let musicBoxLastTickAt = Date.now();
let isMusicBoxWinding = false;
let currentCam4FeedFrame = -1;
let deathStaticTimeout = 0;
let batteryPercent = 100;
let batteryDrainRemainder = 0;
let gameStarted = false;
let introRunning = false;
let powerOut = false;
let gameOver = false;
let gameWon = false;
let currentNight = 1;
let nightIntroFadeTimeout = 0;
let nightIntroStartTimeout = 0;
let victoryReturnTimeout = 0;

// 시간 시스템 (AM 12:00 ~ PM 6:00 = 18시간)
const secondsPerGameHour = 90;
const totalGameHours = 6;
let currentGameHour = 0;
let gameStartTime = Date.now();

// 문 잠금 상태
const doorLockState = {
  left:  { lockedOut: false, lockoutTimerId: null, closedAt: null },
  right: { lockedOut: false, lockoutTimerId: null, closedAt: null }
};
const officeState = {
  left: {
    door: false,
    light: false
  },
  right: {
    door: false,
    light: false
  }
};
const doorThreats = {
  left: {
    stage: 0,
    startDelayMs: 9000,
    intervalMs: 17000,
    returnDelayMs: 22000,
    nextMoveAt: Date.now() + 9000,
    doorArrivedAt: null,
    doorCloseStartedAt: null,
    doorReturnTimerId: null,
    visitor: leftDoorVisitor,
    revealSoundPlayed: false
  },
  right: {
    stage: 0,
    startDelayMs: 13000,
    intervalMs: 21000,
    returnDelayMs: 26000,
    nextMoveAt: Date.now() + 13000,
    doorArrivedAt: null,
    doorCloseStartedAt: null,
    doorReturnTimerId: null,
    visitor: rightDoorVisitor,
    revealSoundPlayed: false
  }
};

function getNightDifficulty() {
  const night = Math.max(1, Math.min(maxNight, currentNight));
  return nightDifficulties[night] || nightDifficulties[maxNight];
}

function applyNightDifficulty() {
  const difficulty = getNightDifficulty();
  musicBoxDrainPerSecond = difficulty.musicBoxDrainPerSecond;
  musicBoxEscapeDelayMs = difficulty.musicBoxEscapeDelayMs;
  doorAttackGraceMs = difficulty.doorAttackGraceMs;
  secondsPerPercentAtOneBar = difficulty.secondsPerPercentAtOneBar;

  doorThreats.left.startDelayMs = difficulty.leftStartDelayMs;
  doorThreats.left.intervalMs = difficulty.leftIntervalMs;
  doorThreats.left.returnDelayMs = difficulty.leftReturnDelayMs;
  doorThreats.right.startDelayMs = difficulty.rightStartDelayMs;
  doorThreats.right.intervalMs = difficulty.rightIntervalMs;
  doorThreats.right.returnDelayMs = difficulty.rightReturnDelayMs;
}

function updateNightLabels() {
  const label = `Night ${currentNight}`;
  if (timeNight) {
    timeNight.textContent = label;
  }
  if (menuNightLabel) {
    menuNightLabel.textContent = label.toUpperCase();
  }
  if (nightIntroText) {
    nightIntroText.textContent = label.toUpperCase();
  }
}

resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
  if (cameraLayer.classList.contains("active")) {
    drawFrame(currentFrame);
  }
});

cameraSprite.addEventListener("load", () => {
  drawFrame(0);
});

startGameButton.addEventListener("click", startGame);
quitGameButton.addEventListener("click", () => {
  if (window.freddyDesktop?.quit) {
    window.freddyDesktop.quit();
    return;
  }

  window.close();
});
mainMenu.addEventListener("pointerdown", () => {
  if (!gameStarted && !introRunning) {
    playMenuMusic();
  }
});
deathStaticScreen.addEventListener("click", returnToMainMenu);

cctvButton.addEventListener("click", toggleCamera);
for (const button of officeControlButtons) {
  button.addEventListener("click", () => {
    toggleOfficeControl(button.dataset.side, button.dataset.action);
  });
}
for (const button of cameraMapButtons) {
  button.addEventListener("click", () => {
    selectCamera(button.dataset.cameraId);
  });
}
feedButton.addEventListener("pointerdown", startMusicBoxWind);
feedButton.addEventListener("pointerup", stopMusicBoxWind);
feedButton.addEventListener("pointercancel", stopMusicBoxWind);
feedButton.addEventListener("lostpointercapture", stopMusicBoxWind);
feedButton.addEventListener("click", (event) => event.preventDefault());
feedButton.addEventListener("keydown", (event) => {
  if (event.code !== "Space" && event.code !== "Enter") {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  setMusicBoxWinding(true);
});
feedButton.addEventListener("keyup", (event) => {
  if (event.code !== "Space" && event.code !== "Enter") {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  setMusicBoxWinding(false);
});
window.addEventListener("blur", () => setMusicBoxWinding(false));
applyNightDifficulty();
updateNightLabels();
updateOfficeImages();
updateCameraMapButtons();
updateCam4Feed();
updateMusicBoxUI();
updateThreatVisuals();
updateFeedControls();
updatePowerHud();
updateTimeHud();
playMenuMusic();
window.setInterval(updateBatteryDrain, batteryDrainTickMs);
window.setInterval(updateMusicBox, 100);
window.setInterval(advanceDoorThreats, 1000);
window.setInterval(updateFeedControls, 250);
window.setInterval(updateGameTime, 1000);

window.addEventListener("keydown", (event) => {
  if (event.target === feedButton && (event.code === "Space" || event.code === "Enter")) {
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    toggleCamera();
  }

  if (event.code === "Escape" && cameraOpen) {
    toggleCamera();
  }
});

function resetNightState(now) {
  animationId += 1;
  window.clearTimeout(staticFadeTimeout);
  window.clearTimeout(blipFlashTimeout);
  window.clearTimeout(deathStaticTimeout);
  window.clearTimeout(nightIntroFadeTimeout);
  window.clearTimeout(nightIntroStartTimeout);
  window.clearTimeout(victoryReturnTimeout);
  staticFadeTimeout = 0;
  blipFlashTimeout = 0;
  deathStaticTimeout = 0;
  nightIntroFadeTimeout = 0;
  nightIntroStartTimeout = 0;
  victoryReturnTimeout = 0;

  cameraOpen = false;
  animating = false;
  currentFrame = 0;
  selectedCameraId = "3";
  currentCam4FeedFrame = -1;
  batteryPercent = 100;
  batteryDrainRemainder = 0;
  powerOut = false;
  gameOver = false;
  gameWon = false;
  introRunning = false;
  currentGameHour = 0;
  gameStartTime = now;
  musicBoxLevel = musicBoxMax;
  musicBoxEscapeAt = 0;
  musicBoxEscapeStartedAt = 0;
  musicBoxRoamStage = 0;
  musicBoxLastTickAt = now;
  isMusicBoxWinding = false;

  officeState.left.door = false;
  officeState.left.light = false;
  officeState.right.door = false;
  officeState.right.light = false;

  for (const side of ["left", "right"]) {
    doorLockState[side].lockedOut = false;
    doorLockState[side].closedAt = null;
    if (doorLockState[side].lockoutTimerId !== null) {
      window.clearTimeout(doorLockState[side].lockoutTimerId);
      doorLockState[side].lockoutTimerId = null;
    }
  }
  clearAllDoorThreatReturnTimers();
  applyNightDifficulty();
  resetDoorThreatTimers(now);

  cctvButton.disabled = false;
  cctvButton.setAttribute("aria-pressed", "false");
  for (const button of officeControlButtons) {
    button.disabled = false;
  }
  for (const button of cameraMapButtons) {
    button.disabled = false;
  }

  stopSound(cameraLoadSound);
  stopSound(cameraPutDownSound);
  stopSound(lightHumSound);
  stopSound(doorRevealSound);
  stopSound(xscreamSound);
  stopSound(deathStaticSound);
  stopSound(chimesSound);
  stopSound(menuMusic);

  cameraLayer.classList.remove("active", "feed-visible", "static-switching", "blip-flashing");
  cameraHud.classList.remove("visible");
  if (nightIntro) {
    nightIntro.classList.remove("active", "fade-out");
    nightIntro.setAttribute("aria-hidden", "true");
  }
  if (nightIntroBlip) {
    nightIntroBlip.classList.remove("playing");
  }
  jumpscareOverlay.classList.remove("active");
  jumpscareOverlay.setAttribute("aria-hidden", "true");
  deathStaticScreen.classList.remove("active");
  deathStaticScreen.setAttribute("aria-hidden", "true");
  gameOverScreen.classList.remove("active");
  gameOverScreen.setAttribute("aria-hidden", "true");
  victoryScreen.classList.remove("active");
  victoryScreen.setAttribute("aria-hidden", "true");
  cameraState.textContent = "OFFLINE";
  drawFrame(0);
  updateCameraMapButtons();
  updateCam4Feed();
  updateMusicBoxUI();
  updateOfficeImages();
  updateDoorLockoutUI();
  updateFeedControls();
  updatePowerHud();
  updateNightLabels();
  updateTimeHud();
}

function startGame() {
  if (gameStarted || introRunning) {
    return;
  }

  const now = Date.now();
  resetNightState(now);
  stopSound(menuMusic);
  playSoundFromStart(cameraSwitchSound);
  introRunning = true;
  mainMenu.classList.remove("active");
  mainMenu.setAttribute("aria-hidden", "true");
  showNightIntro();
}

function showNightIntro() {
  updateNightLabels();

  if (!nightIntro) {
    beginNight();
    return;
  }

  nightIntro.classList.remove("fade-out");
  nightIntro.classList.add("active");
  nightIntro.setAttribute("aria-hidden", "false");

  if (nightIntroBlip) {
    nightIntroBlip.classList.remove("playing");
    void nightIntroBlip.offsetHeight;
    nightIntroBlip.classList.add("playing");
  }

  nightIntroFadeTimeout = window.setTimeout(() => {
    nightIntro.classList.add("fade-out");
  }, 1000);

  nightIntroStartTimeout = window.setTimeout(beginNight, 1700);
}

function beginNight() {
  if (!introRunning || gameStarted) {
    return;
  }

  const now = Date.now();
  gameStarted = true;
  introRunning = false;
  gameStartTime = now;
  musicBoxLastTickAt = now;
  resetDoorThreatTimers(now);

  if (nightIntro) {
    nightIntro.classList.remove("active", "fade-out");
    nightIntro.setAttribute("aria-hidden", "true");
  }
  if (nightIntroBlip) {
    nightIntroBlip.classList.remove("playing");
  }

  updateFeedControls();
  updatePowerHud();
  updateNightLabels();
  updateTimeHud();
}

function returnToMainMenu() {
  const now = Date.now();
  gameStarted = false;
  resetNightState(now);
  mainMenu.classList.add("active");
  mainMenu.setAttribute("aria-hidden", "false");
  playMenuMusic();
}

function resetDoorThreatTimers(now) {
  for (const threat of Object.values(doorThreats)) {
    threat.stage = 0;
    threat.revealSoundPlayed = false;
    threat.nextMoveAt = now + threat.startDelayMs;
    threat.doorArrivedAt = null;
    threat.doorCloseStartedAt = null;
    clearDoorThreatReturnTimer(threat);
  }
  updateThreatVisuals();
}

function toggleCamera() {
  if (!gameStarted || powerOut || gameOver || gameWon || !cameraSprite.complete) {
    return;
  }

  // lockout 상태에서 CCTV 켜기 시도 → 즉시 점프스케어
  if (!cameraOpen && (doorLockState.left.lockedOut || doorLockState.right.lockedOut)) {
    const lockoutSide = doorLockState.left.lockedOut ? "left" : "right";
    triggerCCTVLockoutJumpscare(lockoutSide);
    return;
  }

  if (cameraOpen) {
    closeCamera();
  } else {
    openCamera();
  }
}

function toggleOfficeControl(side, action) {
  if (!gameStarted || powerOut || gameOver || gameWon) {
    return;
  }

  // lockout 상태에서 해당 side 문/빛 버튼 사용 불가
  if (doorLockState[side].lockedOut) {
    playSoundFromStart(errorSound);
    return;
  }

  if (action === "door" && isDoorThreatAtOffice(side)) {
    toggleDoorWithThreatAtOffice(side);
    return;
  }

  if (action === "door") {
    playSoundFromStart(doorToggleSound);
  }

  officeState[side][action] = !officeState[side][action];
  if (action === "door") {
    doorLockState[side].closedAt = officeState[side].door ? Date.now() : null;
  }
  updateOfficeImages();
}

function selectCamera(cameraId) {
  if (!gameStarted || powerOut) {
    return;
  }

  if (cameraId !== "4") {
    setMusicBoxWinding(false);
  }
  selectedCameraId = cameraId;
  playSoundFromStart(cameraSwitchSound);
  pulseCameraStatic();
  playCameraBlipFlash();
  updateCameraMapButtons();
  updateFeedControls();
}

function toggleDoorWithThreatAtOffice(side) {
  const threat = doorThreats[side];
  const now = Date.now();

  if (officeState[side].door) {
    const closedFor = threat.doorCloseStartedAt === null ? 0 : now - threat.doorCloseStartedAt;
    clearDoorThreatReturnTimer(threat);
    officeState[side].door = false;
    doorLockState[side].closedAt = null;
    playSoundFromStart(doorToggleSound);
    updateOfficeImages();

    if (closedFor < doorHoldToRepelMs) {
      beginDoorControlLockout(side);
      return;
    }

    resetDoorThreat(side);
    return;
  }

  officeState[side].door = true;
  doorLockState[side].closedAt = now;
  scheduleDoorThreatReturn(side, now);
  playSoundFromStart(doorToggleSound);
  updateOfficeImages();
}

function updateCameraMapButtons() {
  cameraLayer.dataset.selectedCamera = selectedCameraId;
  updateThreatVisuals();
  for (const button of cameraMapButtons) {
    button.setAttribute("aria-pressed", button.dataset.cameraId === selectedCameraId ? "true" : "false");
  }
}

function startMusicBoxWind(event) {
  event.preventDefault();
  if (typeof feedButton.setPointerCapture === "function") {
    feedButton.setPointerCapture(event.pointerId);
  }
  setMusicBoxWinding(true);
}

function stopMusicBoxWind(event) {
  event?.preventDefault();
  setMusicBoxWinding(false);
}

function setMusicBoxWinding(winding) {
  const nextWinding = winding && canWindMusicBox();
  if (isMusicBoxWinding === nextWinding) {
    return;
  }

  isMusicBoxWinding = nextWinding;
  updateFeedControls();
  updatePowerHud();
}

function canWindMusicBox() {
  return gameStarted
    && !powerOut
    && !gameOver
    && !gameWon
    && musicBoxLevel > 0
    && cameraOpen
    && cameraLayer.classList.contains("feed-visible")
    && selectedCameraId === "4";
}

function updateMusicBox() {
  const now = Date.now();
  const elapsedSeconds = Math.min(0.5, Math.max(0, (now - musicBoxLastTickAt) / 1000));
  musicBoxLastTickAt = now;

  if (!gameStarted || powerOut || gameOver || gameWon) {
    if (isMusicBoxWinding) {
      isMusicBoxWinding = false;
      updatePowerHud();
    }
    updateMusicBoxUI();
    updateFeedControls();
    return;
  }

  if (isMusicBoxWinding && !canWindMusicBox()) {
    isMusicBoxWinding = false;
    updatePowerHud();
  }

  const delta = (isMusicBoxWinding ? musicBoxWindPerSecond : -musicBoxDrainPerSecond) * elapsedSeconds;
  musicBoxLevel = Math.max(0, Math.min(musicBoxMax, musicBoxLevel + delta));

  if (musicBoxLevel <= 0) {
    musicBoxLevel = 0;
    if (isMusicBoxWinding) {
      isMusicBoxWinding = false;
      updatePowerHud();
    }
    if (musicBoxEscapeAt === 0) {
      musicBoxEscapeStartedAt = now;
      musicBoxEscapeAt = now + musicBoxEscapeDelayMs;
    }
  } else if (musicBoxLevel >= musicBoxSaveThreshold) {
    musicBoxEscapeAt = 0;
    musicBoxEscapeStartedAt = 0;
    musicBoxRoamStage = 0;
  }

  if (musicBoxEscapeAt !== 0) {
    updateMusicBoxRoamStage(now);
  }

  if (musicBoxEscapeAt !== 0 && now >= musicBoxEscapeAt) {
    triggerMusicBoxJumpscare();
    return;
  }

  updateCam4Feed();
  updateMusicBoxUI();
  updateFeedControls();
}

function getCam4FeedFrame() {
  const percent = musicBoxLevel / musicBoxMax;
  if (percent <= 0) return 3;
  if (percent <= 0.25) return 2;
  if (percent <= 0.55) return 1;
  return 0;
}

function updateCam4Feed() {
  const frameIndex = getCam4FeedFrame();
  if (frameIndex !== currentCam4FeedFrame) {
    cam4FeedImage.src = cam4FeedFrames[frameIndex];
    currentCam4FeedFrame = frameIndex;
  }
  cameraLayer.dataset.cam4Anger = String(frameIndex);
}

function updateMusicBoxRoamStage(now) {
  if (musicBoxEscapeStartedAt === 0) {
    musicBoxRoamStage = 0;
    return;
  }

  const progress = Math.max(0, Math.min(0.999, (now - musicBoxEscapeStartedAt) / musicBoxEscapeDelayMs));
  musicBoxRoamStage = Math.floor(progress * 4) + 1;
}

function updateMusicBoxUI() {
  const percent = Math.max(0, Math.min(100, Math.round(musicBoxLevel)));
  if (musicBoxMeter) {
    musicBoxMeter.setAttribute("aria-valuenow", String(percent));
  }
  if (musicBoxFill) {
    musicBoxFill.style.transform = `scaleX(${musicBoxLevel / musicBoxMax})`;
  }

  cameraLayer.classList.toggle("music-box-winding", isMusicBoxWinding);
  cameraLayer.classList.toggle("music-box-low", musicBoxLevel > musicBoxCriticalThreshold && musicBoxLevel <= musicBoxWarningThreshold);
  cameraLayer.classList.toggle("music-box-critical", musicBoxLevel > 0 && musicBoxLevel <= musicBoxCriticalThreshold);
  cameraLayer.classList.toggle("music-box-empty", musicBoxLevel <= 0);
  cameraLayer.classList.toggle("music-box-escaped", musicBoxEscapeAt !== 0);
  cameraLayer.dataset.musicBoxRoamStage = String(musicBoxRoamStage);
}

function triggerMusicBoxJumpscare() {
  if (gameOver || gameWon) {
    return;
  }

  musicBoxEscapeAt = 0;
  musicBoxEscapeStartedAt = 0;
  musicBoxRoamStage = 0;
  setMusicBoxWinding(false);
  updateMusicBoxUI();
  triggerJumpscare("musicbox");
}

function advanceDoorThreats() {
  if (!gameStarted || powerOut || gameOver || gameWon) {
    return;
  }

  const now = Date.now();
  for (const side of Object.keys(doorThreats)) {
    const threat = doorThreats[side];
    if (threat.stage >= doorStage) {
      updateDoorThreatAtOffice(side, now);
      if (gameOver) {
        return;
      }
      continue;
    }

    if (now < threat.nextMoveAt) {
      continue;
    }

    threat.stage += 1;
    threat.revealSoundPlayed = false;

    if (threat.stage >= doorStage) {
      threat.stage = doorStage;
      beginDoorThreatAtOffice(side, now);
      continue;
    }

    threat.nextMoveAt = now + threat.intervalMs;
  }

  updateThreatVisuals();
}

function resetDoorThreat(side) {
  const threat = doorThreats[side];
  threat.stage = 0;
  threat.revealSoundPlayed = false;
  threat.nextMoveAt = Date.now() + threat.returnDelayMs;
  threat.doorArrivedAt = null;
  threat.doorCloseStartedAt = null;
  clearDoorThreatReturnTimer(threat);
  doorLockState[side].closedAt = null;
  updateThreatVisuals();
}

function isDoorThreatAtOffice(side) {
  return doorThreats[side].stage >= doorStage;
}

function beginDoorThreatAtOffice(side, now) {
  const threat = doorThreats[side];
  threat.doorArrivedAt = now;
  if (officeState[side].door) {
    scheduleDoorThreatReturn(side, now);
  } else {
    threat.doorCloseStartedAt = null;
    clearDoorThreatReturnTimer(threat);
  }
}

function clearDoorThreatReturnTimer(threat) {
  if (threat.doorReturnTimerId !== null) {
    window.clearTimeout(threat.doorReturnTimerId);
    threat.doorReturnTimerId = null;
  }
}

function clearAllDoorThreatReturnTimers() {
  for (const threat of Object.values(doorThreats)) {
    clearDoorThreatReturnTimer(threat);
  }
}

function scheduleDoorThreatReturn(side, now) {
  const threat = doorThreats[side];
  threat.doorCloseStartedAt = now;
  clearDoorThreatReturnTimer(threat);
  threat.doorReturnTimerId = window.setTimeout(() => {
    if (!gameOver && !gameWon && threat.stage >= doorStage && officeState[side].door) {
      resetDoorThreat(side);
    }
  }, doorHoldToRepelMs);
}

function updateDoorThreatAtOffice(side, now) {
  const threat = doorThreats[side];

  if (doorLockState[side].lockedOut) {
    return;
  }

  if (officeState[side].door) {
    if (threat.doorCloseStartedAt === null) {
      scheduleDoorThreatReturn(side, now);
    }

    if (now - threat.doorCloseStartedAt >= doorHoldToRepelMs) {
      resetDoorThreat(side);
    }
    return;
  }

  if (threat.doorCloseStartedAt !== null) {
    if (now - threat.doorCloseStartedAt < doorHoldToRepelMs) {
      beginDoorControlLockout(side);
      return;
    }

    resetDoorThreat(side);
    return;
  }

  if (threat.doorArrivedAt === null) {
    threat.doorArrivedAt = now;
  }

  if (now - threat.doorArrivedAt >= doorAttackGraceMs) {
    triggerJumpscare(side);
  }
}

function updateThreatVisuals() {
  cameraLayer.dataset.leftKimStage = String(doorThreats.left.stage);
  cameraLayer.dataset.rightKimStage = String(doorThreats.right.stage);

  updateDoorThreatVisibility("left");
  updateDoorThreatVisibility("right");
}

function updateDoorThreatVisibility(side) {
  const threat = doorThreats[side];
  const shouldReveal = !powerOut
    && threat.stage >= doorStage
    && officeState[side].light
    && !officeState[side].door;
  threat.visitor.classList.toggle("visible", shouldReveal);

  if (shouldReveal && !threat.revealSoundPlayed) {
    playSoundFromStart(doorRevealSound);
    threat.revealSoundPlayed = true;
  }
}

function updateFeedControls() {
  const musicBoxEmpty = musicBoxLevel <= 0;
  const disabled = !gameStarted
    || powerOut
    || gameOver
    || gameWon
    || musicBoxEmpty
    || selectedCameraId !== "4"
    || !cameraOpen
    || !cameraLayer.classList.contains("feed-visible");
  if (disabled && isMusicBoxWinding) {
    isMusicBoxWinding = false;
    updatePowerHud();
  }

  feedButton.disabled = disabled;
  feedButton.classList.toggle("winding", isMusicBoxWinding);

  if (!gameStarted) {
    feedCooldownLabel.textContent = "MENU";
  } else if (powerOut) {
    feedCooldownLabel.textContent = "POWER OUT";
  } else if (gameOver || gameWon) {
    feedCooldownLabel.textContent = "OFFLINE";
  } else if (musicBoxEmpty) {
    feedCooldownLabel.textContent = "TOO LATE";
  } else if (selectedCameraId !== "4") {
    feedCooldownLabel.textContent = "CAM 4 ONLY";
  } else if (!cameraOpen || !cameraLayer.classList.contains("feed-visible")) {
    feedCooldownLabel.textContent = "WAIT CAMERA";
  } else if (musicBoxEscapeAt !== 0) {
    feedCooldownLabel.textContent = "WIND NOW";
  } else if (isMusicBoxWinding) {
    feedCooldownLabel.textContent = "WINDING";
  } else if (musicBoxLevel >= musicBoxMax - 1) {
    feedCooldownLabel.textContent = "FULL";
  } else if (musicBoxLevel <= musicBoxCriticalThreshold) {
    feedCooldownLabel.textContent = "CRITICAL";
  } else if (musicBoxLevel <= musicBoxWarningThreshold) {
    feedCooldownLabel.textContent = "LOW";
  } else {
    feedCooldownLabel.textContent = "HOLD TO WIND";
  }

  updateMusicBoxUI();
}

function pulseCameraStatic() {
  window.clearTimeout(staticFadeTimeout);
  cameraLayer.classList.remove("static-switching");
  cameraStatic.offsetHeight;
  cameraLayer.classList.add("static-switching");
  staticFadeTimeout = window.setTimeout(() => {
    cameraLayer.classList.remove("static-switching");
  }, 90);
}

function playCameraBlipFlash() {
  window.clearTimeout(blipFlashTimeout);
  cameraLayer.classList.remove("blip-flashing");
  cameraBlipFlash.offsetHeight;
  cameraLayer.classList.add("blip-flashing");
  blipFlashTimeout = window.setTimeout(() => {
    cameraLayer.classList.remove("blip-flashing");
  }, 360);
}

function updateOfficeImages() {
  updatePanel("left", leftPanelImage, leftDoorOverlay, leftLightBeam);
  updatePanel("right", rightPanelImage, rightDoorOverlay, rightLightBeam);

  for (const button of officeControlButtons) {
    button.setAttribute("aria-pressed", officeState[button.dataset.side][button.dataset.action] ? "true" : "false");
  }

  updateThreatVisuals();
  updateLightHum();
  updatePowerHud();
}

function updatePanel(side, panelImage, doorOverlay, lightBeam) {
  const state = officeState[side];
  const stateName = state.door && state.light
    ? "door-light"
    : state.door
      ? "door"
      : state.light
        ? "light"
        : "default";
  panelImage.src = `./assets/office/${side}-panel-${stateName}.png`;
  doorOverlay.classList.toggle("visible", state.door);
  lightBeam.classList.toggle("visible", state.light);
}

function openCamera() {
  if (powerOut) {
    return;
  }

  cameraOpen = true;
  animating = true;
  stopSound(cameraPutDownSound);
  playCameraLoadSound();
  cameraLayer.classList.add("active");
  cameraLayer.classList.remove("feed-visible");
  cameraHud.classList.remove("visible");
  cctvButton.setAttribute("aria-pressed", "true");
  cameraState.textContent = "RAISING";
  animateFrames(0, frame.count - 1, 34, () => {
    animating = false;
    currentFrame = frame.count - 1;
    cameraLayer.classList.add("feed-visible");
    cameraHud.classList.add("visible");
    cameraState.textContent = "ONLINE";
    updatePowerHud();
  });
  updatePowerHud();
}

function playCameraLoadSound() {
  playSoundFromStart(cameraLoadSound);
}

function closeCamera() {
  setMusicBoxWinding(false);
  stopSound(cameraLoadSound);
  playSoundFromStart(cameraPutDownSound);
  animating = true;
  window.clearTimeout(staticFadeTimeout);
  window.clearTimeout(blipFlashTimeout);
  cameraLayer.classList.remove("static-switching");
  cameraLayer.classList.remove("blip-flashing");
  cameraLayer.classList.remove("feed-visible");
  cameraHud.classList.remove("visible");
  cameraState.textContent = "LOWERING";
  animateFrames(currentFrame, 0, 28, () => {
    animating = false;
    cameraOpen = false;
    currentFrame = 0;
    cameraLayer.classList.remove("active");
    cctvButton.setAttribute("aria-pressed", "false");
    cameraState.textContent = "OFFLINE";
    updatePowerHud();
  });
}

function playSoundFromStart(sound) {
  sound.pause();
  sound.currentTime = 0;
  sound.play().catch(() => {
    // Browser audio policy can reject if the action was not user-initiated.
  });
}

function playMenuMusic() {
  if (!mainMenu.classList.contains("active") || gameStarted || introRunning) {
    return;
  }

  if (!menuMusic.paused) {
    return;
  }

  menuMusic.play().catch(() => {
    // Browser audio policy can reject autoplay before the first input.
  });
}

function updateLightHum() {
  const anyLightOn = officeState.left.light || officeState.right.light;
  if (anyLightOn && lightHumSound.paused) {
    lightHumSound.currentTime = 0;
    lightHumSound.play().catch(() => {
      // Browser audio policy can reject if the action was not user-initiated.
    });
  }

  if (!anyLightOn && !lightHumSound.paused) {
    stopSound(lightHumSound);
  }
}

function getUsageLevel() {
  if (powerOut) {
    return 0;
  }

  let usage = 1;
  if (cameraOpen) {
    usage += 1;
  }
  if (officeState.left.door) {
    usage += 1;
  }
  if (officeState.right.door) {
    usage += 1;
  }
  if (officeState.left.light) {
    usage += 1;
  }
  if (officeState.right.light) {
    usage += 1;
  }
  if (isMusicBoxWinding) {
    usage += 1;
  }
  return Math.min(5, usage);
}

function updateBatteryDrain() {
  if (!gameStarted || powerOut || gameOver || gameWon) {
    return;
  }

  batteryDrainRemainder += getUsageLevel() / secondsPerPercentAtOneBar;
  const drain = Math.floor(batteryDrainRemainder);
  if (drain <= 0) {
    updatePowerHud();
    return;
  }

  batteryDrainRemainder -= drain;
  batteryPercent = Math.max(0, batteryPercent - drain);
  updatePowerHud();

  if (batteryPercent <= 0) {
    triggerPowerOut();
  }
}

function updatePowerHud() {
  powerValue.textContent = `${Math.ceil(batteryPercent)}%`;
  powerValue.classList.toggle("power-low", batteryPercent <= 20);

  const usage = getUsageLevel();
  usageBars.forEach((bar, index) => {
    bar.classList.toggle("active", index < usage);
  });
}

function triggerPowerOut() {
  if (powerOut) {
    return;
  }

  // lockout 타이머 모두 정리
  for (const s of ["left", "right"]) {
    if (doorLockState[s].lockoutTimerId !== null) {
      window.clearTimeout(doorLockState[s].lockoutTimerId);
      doorLockState[s].lockoutTimerId = null;
    }
  }
  clearAllDoorThreatReturnTimers();

  powerOut = true;
  isMusicBoxWinding = false;
  musicBoxEscapeAt = 0;
  batteryPercent = 0;
  batteryDrainRemainder = 0;
  animationId += 1;
  cameraOpen = false;
  animating = false;
  currentFrame = 0;
  officeState.left.door = false;
  officeState.left.light = false;
  officeState.right.door = false;
  officeState.right.light = false;
  window.clearTimeout(staticFadeTimeout);
  window.clearTimeout(blipFlashTimeout);
  cameraLayer.classList.remove("active", "feed-visible", "static-switching", "blip-flashing");
  cameraHud.classList.remove("visible");
  cctvButton.setAttribute("aria-pressed", "false");
  cctvButton.disabled = true;
  feedButton.disabled = true;
  for (const button of officeControlButtons) {
    button.disabled = true;
  }
  for (const button of cameraMapButtons) {
    button.disabled = true;
  }
  stopSound(cameraLoadSound);
  stopSound(cameraPutDownSound);
  stopSound(lightHumSound);
  stopSound(doorRevealSound);
  cameraState.textContent = "POWER OUT";
  drawFrame(0);
  updateOfficeImages();
  updateFeedControls();
  updatePowerHud();
}

function stopSound(sound) {
  sound.pause();
  sound.currentTime = 0;
}

function animateFrames(from, to, frameMs, done) {
  animationId += 1;
  const runId = animationId;
  const direction = from <= to ? 1 : -1;
  let index = from;
  let lastTime = 0;

  function step(time) {
    if (runId !== animationId) {
      return;
    }

    if (lastTime === 0 || time - lastTime >= frameMs) {
      currentFrame = index;
      drawFrame(index);
      lastTime = time;
      index += direction;
    }

    const finished = direction > 0 ? index > to : index < to;
    if (finished) {
      done();
      return;
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  cameraCanvas.width = Math.max(1, Math.floor(window.innerWidth * ratio));
  cameraCanvas.height = Math.max(1, Math.floor(window.innerHeight * ratio));
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawFrame(index) {
  const source = getFrameSource(index);
  const target = getCoverRect(window.innerWidth, window.innerHeight, frame.width, frame.height);

  context.fillStyle = "#000";
  context.fillRect(0, 0, window.innerWidth, window.innerHeight);
  context.drawImage(
    cameraSprite,
    source.x,
    source.y,
    frame.width,
    frame.height,
    target.x,
    target.y,
    target.width,
    target.height
  );
}

function getFrameSource(index) {
  const safeIndex = Math.max(0, Math.min(frame.count - 1, index));
  const column = safeIndex % frame.columns;
  const row = Math.floor(safeIndex / frame.columns);
  return {
    x: frame.offsetX + column * frame.stepX,
    y: frame.offsetY + row * frame.stepY
  };
}

function getCoverRect(targetWidth, targetHeight, sourceWidth, sourceHeight) {
  const scale = Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  return {
    x: (targetWidth - width) / 2,
    y: (targetHeight - height) / 2,
    width,
    height
  };
}

// ── 시간 시스템 ──────────────────────────────────────────────

function formatHour(hour) {
  if (hour === 0)  return "12 AM";
  if (hour < 12)  return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}

function updateTimeHud() {
  if (timeValue) {
    timeValue.textContent = formatHour(currentGameHour);
  }
}

function updateGameTime() {
  if (!gameStarted || powerOut || gameOver || gameWon) return;

  const elapsed = (Date.now() - gameStartTime) / 1000;
  const newHour = Math.floor(elapsed / secondsPerGameHour);

  if (newHour >= totalGameHours) {
    triggerGameWin();
    return;
  }

  if (newHour !== currentGameHour) {
    currentGameHour = newHour;
    updateTimeHud();
    // 시간 변경 시 깜빡임 효과
    if (timeDisplayEl) {
      timeDisplayEl.classList.remove("time-flash");
      // reflow 강제
      void timeDisplayEl.offsetHeight;
      timeDisplayEl.classList.add("time-flash");
      window.setTimeout(() => timeDisplayEl.classList.remove("time-flash"), 600);
    }
  }
}

function triggerGameWin() {
  if (gameWon) return;
  gameWon = true;
  isMusicBoxWinding = false;
  musicBoxEscapeAt = 0;
  clearAllDoorThreatReturnTimers();
  // 모든 동작 중단
  animationId += 1;
  stopSound(cameraLoadSound);
  stopSound(cameraPutDownSound);
  stopSound(lightHumSound);
  stopSound(doorRevealSound);
  stopSound(deathStaticSound);
  cameraLayer.classList.remove("active", "feed-visible");
  cameraHud.classList.remove("visible");
  if (victoryScreen) {
    victoryScreen.setAttribute("aria-hidden", "false");
    victoryScreen.classList.remove("active");
    void victoryScreen.offsetHeight;
    victoryScreen.classList.add("active");
  }
  playSoundFromStart(chimesSound);
  window.clearTimeout(victoryReturnTimeout);
  victoryReturnTimeout = window.setTimeout(completeNightAndReturnToMenu, 7000);
}

function completeNightAndReturnToMenu() {
  if (!gameWon) {
    return;
  }

  if (currentNight < maxNight) {
    currentNight += 1;
  }
  returnToMainMenu();
}

// ── 문 잠금 시스템 ───────────────────────────────────────────

function beginDoorControlLockout(side) {
  const threat = doorThreats[side];
  clearDoorThreatReturnTimer(threat);
  threat.doorCloseStartedAt = null;
  doorLockState[side].closedAt = null;
  triggerDoorLockout(side);
  playSoundFromStart(errorSound);
  updateOfficeImages();
}

function triggerDoorLockout(side) {
  doorLockState[side].lockedOut = true;
  doorLockState[side].closedAt = null;
  updateDoorLockoutUI();

  if (doorLockState[side].lockoutTimerId !== null) {
    window.clearTimeout(doorLockState[side].lockoutTimerId);
  }
  // Legacy lockout path: keep buttons active so the error sound can restart on every press.
  doorLockState[side].lockoutTimerId = window.setTimeout(() => {
    if (doorLockState[side].lockedOut && !gameOver && !gameWon) {
      triggerJumpscare(side);
    }
  }, doorLockoutJumpscareDelayMs);
}

function updateDoorLockoutUI() {
  for (const button of officeControlButtons) {
    button.disabled = powerOut || gameOver;
  }
}

// CCTV 키면 → 즉시 점프스케어
function triggerCCTVLockoutJumpscare(side) {
  if (doorLockState[side].lockoutTimerId !== null) {
    window.clearTimeout(doorLockState[side].lockoutTimerId);
    doorLockState[side].lockoutTimerId = null;
  }

  stopSound(cameraLoadSound);
  stopSound(cameraPutDownSound);
  animating = false;
  cameraOpen = false;
  currentFrame = 0;
  cameraLayer.classList.remove("active", "feed-visible");
  cameraHud.classList.remove("visible");
  cameraState.textContent = "OFFLINE";
  cctvButton.setAttribute("aria-pressed", "false");
  drawFrame(0);
  triggerJumpscare(side);
}

// X스크림 + 빨간 배경 + 통통김 이미지 0.5초
function triggerJumpscare(side) {
  if (gameOver) return;
  gameOver = true;
  isMusicBoxWinding = false;
  musicBoxEscapeAt = 0;

  // 모든 lockout 타이머 취소
  for (const s of ["left", "right"]) {
    if (doorLockState[s].lockoutTimerId !== null) {
      window.clearTimeout(doorLockState[s].lockoutTimerId);
      doorLockState[s].lockoutTimerId = null;
    }
  }
  clearAllDoorThreatReturnTimers();

  const spriteSrc = side === "left"
    ? "./assets/sprites/tongtong-kim-left.png"
    : side === "musicbox"
      ? musicBoxJumpscareSprite
      : "./assets/sprites/tongtong-kim-right.png";

  jumpscareSprite.src = spriteSrc;
  jumpscareSprite.classList.toggle("music-box-jumpscare", side === "musicbox");
  jumpscareOverlay.setAttribute("aria-hidden", "false");
  jumpscareOverlay.classList.add("active");

  playSoundFromStart(xscreamSound);

  window.setTimeout(() => {
    stopSound(xscreamSound);
    jumpscareOverlay.classList.remove("active");
    jumpscareOverlay.setAttribute("aria-hidden", "true");
    showDeathStatic();
  }, 500);
}

function showDeathStatic() {
  isMusicBoxWinding = false;
  musicBoxEscapeAt = 0;
  musicBoxEscapeStartedAt = 0;
  musicBoxRoamStage = 0;
  stopSound(lightHumSound);
  stopSound(doorRevealSound);
  animationId += 1;
  cameraLayer.classList.remove("active", "feed-visible");
  cameraHud.classList.remove("visible");
  updateMusicBoxUI();
  deathStaticScreen.setAttribute("aria-hidden", "false");
  deathStaticScreen.classList.add("active");
  playSoundFromStart(deathStaticSound);
  window.clearTimeout(deathStaticTimeout);
  deathStaticTimeout = window.setTimeout(returnToMainMenu, 10000);
}
