const storageKey = "rego-os-selection";

const programs = [
  { value: "Biliárd",      desc: "Menjünk el biliárdozni.",            img: "./program-emojik/billiard_nobg.png" },
  { value: "Darts",        desc: "Nyomjunk egy darts-meccset.",         img: "./program-emojik/darts_nobg.png" },
  { value: "Mozi",         desc: "Válassz filmet, nézzük meg moziban.", img: "./program-emojik/mozi_nobg.png" },
  { value: "Közös gaming", desc: "Te választasz játékot, én jövök.",    img: "./program-emojik/gaming_nobg.png" },
  { value: "Kosarazás",    desc: "Dobáljunk vagy játsszunk egyet.",     img: "./program-emojik/kosarazas_nobg.png" },
];

const steps = [
  { group: "program", kicker: "01 / Fő választás", title: "Program", pill: "kötelező", required: true },
  { group: "food", kicker: "02 / Kaja választás", title: "Kaja", pill: "kötelező", required: true },
  { group: "after", kicker: "03 / Utána", title: "Utána", pill: "kötelező", required: true },
  { group: "reward", kicker: "04 / Extra", title: "Extra", pill: "opcionális", required: false },
  { group: "summary", kicker: "05 / Véglegesítés", title: "Véglegesítés", pill: "ellenőrzés", required: false },
];

const requiredGroups = ["program", "food", "after"];
const defaultState = {
  program: "",
  programIndex: 0,
  food: "",
  after: "",
  reward: "",
  confirmed: false,
  currentStep: 0,
  introSeen: false,
};

const state = { ...defaultState, ...loadState() };
state.currentStep = clampStep(state.currentStep);
state.programIndex = clampProgramIndex(state.programIndex);

// Auto-select the current carousel item if nothing is saved yet
if (!state.program) {
  state.program = programs[state.programIndex].value;
}

const labels = {
  program: document.querySelector("#summaryProgram"),
  food: document.querySelector("#summaryFood"),
  after: document.querySelector("#summaryAfter"),
  reward: document.querySelector("#summaryReward"),
};

const bootOverlay = document.querySelector("#bootOverlay");
const bootRing = document.querySelector("#bootRing");
const bootLevel = document.querySelector("#bootLevel");
const bootStatus = document.querySelector("#bootStatus");
const replayIntroButton = document.querySelector("#replayIntroButton");
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
const stepKicker = document.querySelector("#stepKicker");
const stepTitle = document.querySelector("#stepTitle");
const stepPill = document.querySelector("#stepPill");
const stepCounter = document.querySelector("#stepCounter");
const prevStepButton = document.querySelector("#prevStepButton");
const nextStepButton = document.querySelector("#nextStepButton");
const confirmButton = document.querySelector("#confirmButton");
const resetButton = document.querySelector("#resetButton");
const confirmation = document.querySelector("#confirmation");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── Carousel ─────────────────────────────────────────────────────────────────

const programPrev = document.querySelector("#programPrev");
const programNext = document.querySelector("#programNext");

programPrev?.addEventListener("click", () => navigateCarousel(-1));
programNext?.addEventListener("click", () => navigateCarousel(+1));

function navigateCarousel(direction) {
  const count = programs.length;
  state.programIndex = (state.programIndex + direction + count) % count;
  state.program = programs[state.programIndex].value;
  state.confirmed = false;
  saveState();
  renderCarousel(direction);
  render();
}

function renderCarousel(direction = 0) {
  const items = document.querySelectorAll(".carousel-item");
  const dots  = document.querySelectorAll(".carousel-dot");

  items.forEach((item) => {
    item.classList.remove("is-active", "slide-left", "slide-right");
  });

  const activeItem = document.querySelector(`.carousel-item[data-index="${state.programIndex}"]`);
  if (activeItem) {
    activeItem.classList.add("is-active");

    if (!reducedMotion && direction !== 0) {
      const animClass = direction > 0 ? "slide-right" : "slide-left";
      activeItem.classList.add(animClass);
      activeItem.addEventListener("animationend", () => {
        activeItem.classList.remove(animClass);
      }, { once: true });
    }
  }

  dots.forEach((dot) => {
    dot.classList.toggle("is-active", Number(dot.dataset.index) === state.programIndex);
  });
}

// ── Choice cards (food, after, reward) ───────────────────────────────────────

document.querySelectorAll(".choice-section").forEach((section) => {
  const group = section.dataset.group;
  if (group === "program") return; // carousel handles program

  section.querySelectorAll(".choice-card").forEach((button) => {
    button.addEventListener("click", () => {
      const wasSelected = button.classList.contains("is-selected");

      if (group === "reward" && wasSelected) {
        state[group] = "";
      } else {
        state[group] = button.dataset.value;
      }

      state.confirmed = false;
      saveState();
      render();
    });
  });
});

// ── Navigation ────────────────────────────────────────────────────────────────

document.querySelectorAll("[data-step-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    const targetStep = Number(button.dataset.stepJump);

    if (!button.disabled) {
      state.currentStep = clampStep(targetStep);
      state.confirmed = false;
      saveState();
      render();
    }
  });
});

prevStepButton.addEventListener("click", () => {
  state.currentStep = clampStep(state.currentStep - 1);
  state.confirmed = false;
  saveState();
  render();
});

nextStepButton.addEventListener("click", () => {
  state.currentStep = clampStep(state.currentStep + 1);
  state.confirmed = false;
  saveState();
  render();
});

confirmButton.addEventListener("click", () => {
  state.confirmed = true;
  saveState();
  render();
});

resetButton.addEventListener("click", () => {
  const introSeen = state.introSeen;
  Object.assign(state, defaultState, { introSeen });
  state.program = programs[0].value;
  state.programIndex = 0;
  saveState();
  renderCarousel(0);
  render();
});

replayIntroButton.addEventListener("click", () => {
  runBootIntro({ replay: true });
});

// ── Initial render ────────────────────────────────────────────────────────────

renderCarousel(0);
render();

if (!state.introSeen) {
  runBootIntro();
}

// ── Render ────────────────────────────────────────────────────────────────────

function render() {
  document.body.classList.toggle("is-confirmed", state.confirmed);
  state.currentStep = clampStep(state.currentStep);

  document.querySelectorAll(".choice-section").forEach((section) => {
    const group = section.dataset.group;
    if (group === "program") return;

    section.querySelectorAll(".choice-card").forEach((button) => {
      button.classList.toggle("is-selected", state[group] === button.dataset.value);
    });
  });

  document.querySelectorAll(".mission-step").forEach((section) => {
    section.classList.toggle("is-active", Number(section.dataset.step) === state.currentStep);
  });

  const activeStep = steps[state.currentStep];
  stepKicker.textContent = activeStep.kicker;
  stepTitle.textContent = activeStep.title;
  stepPill.textContent = activeStep.pill;
  stepPill.className = activeStep.required ? "required-pill" : "optional-pill";
  stepCounter.textContent = `${String(state.currentStep + 1).padStart(2, "0")} / 05`;

  labels.program.textContent = state.program || "Nincs kiválasztva";
  labels.food.textContent = state.food || "Nincs kiválasztva";
  labels.after.textContent = state.after || "Nincs kiválasztva";
  labels.reward.textContent = state.reward || "Nem kötelező";

  const completedRequired = requiredGroups.filter((group) => state[group]).length;
  const canConfirm = completedRequired === requiredGroups.length;
  const progress = Math.round((state.currentStep / (steps.length - 1)) * 100);

  progressText.textContent = `${progress}%`;
  progressBar.style.width = `${progress}%`;
  confirmButton.disabled = !canConfirm;
  confirmation.hidden = !state.confirmed;

  prevStepButton.disabled = state.currentStep === 0;
  nextStepButton.hidden = state.currentStep === steps.length - 1;
  nextStepButton.disabled = !canLeaveStep(activeStep);

  updateMissionMap(canConfirm);
}

function updateMissionMap(canConfirm) {
  document.querySelectorAll(".mission-map li").forEach((item, index) => {
    const button = item.querySelector("button");
    const step = steps[index];
    const complete = isStepComplete(step);
    const accessible = index < steps.length - 1 || canConfirm;

    item.classList.toggle("is-active", index === state.currentStep);
    item.classList.toggle("is-complete", complete);
    button.disabled = !accessible;
  });
}

function isStepComplete(step) {
  if (step.group === "summary") {
    return state.confirmed;
  }
  return Boolean(state[step.group]);
}

function canLeaveStep(step) {
  if (!step.required) {
    return true;
  }
  return Boolean(state[step.group]);
}

// ── Boot intro ────────────────────────────────────────────────────────────────

function runBootIntro({ replay = false } = {}) {
  bootOverlay.hidden = false;
  bootLevel.textContent = "13";
  bootStatus.textContent = "Rendszer előkészítése...";
  bootRing.style.setProperty("--intro-progress", "0deg");

  if (reducedMotion) {
    finishBootIntro(replay);
    return;
  }

  const duration = 2100;
  const startedAt = performance.now();

  function tick(now) {
    const rawProgress = Math.min((now - startedAt) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - rawProgress, 3);
    const degrees = Math.round(easedProgress * 360);

    bootRing.style.setProperty("--intro-progress", `${degrees}deg`);

    if (rawProgress > 0.42) {
      bootLevel.textContent = "14";
      bootStatus.textContent = "Level 14 hozzáférés aktiválva.";
    }

    if (rawProgress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    setTimeout(() => finishBootIntro(replay), 520);
  }

  requestAnimationFrame(tick);
}

function finishBootIntro(replay) {
  bootRing.style.setProperty("--intro-progress", "360deg");
  bootLevel.textContent = "14";
  bootStatus.textContent = "Level 14 hozzáférés aktiválva.";

  setTimeout(
    () => {
      bootOverlay.hidden = true;
      if (!replay) {
        state.introSeen = true;
        saveState();
      }
    },
    reducedMotion ? 120 : 460,
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function clampStep(step) {
  const number = Number(step);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(steps.length - 1, number));
}

function clampProgramIndex(index) {
  const number = Number(index);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(programs.length - 1, number));
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function saveState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // localStorage unavailable (file://, private browsing, quota) – state lives in memory
  }
}
