const storageKey = "rego-os-selection";

const requiredGroups = ["program", "food", "after"];
const defaultState = {
  program: "",
  food: "",
  after: "",
  reward: "",
  confirmed: false,
};

const state = { ...defaultState, ...loadState() };

const labels = {
  program: document.querySelector("#summaryProgram"),
  food: document.querySelector("#summaryFood"),
  after: document.querySelector("#summaryAfter"),
  reward: document.querySelector("#summaryReward"),
};

const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
const confirmButton = document.querySelector("#confirmButton");
const resetButton = document.querySelector("#resetButton");
const confirmation = document.querySelector("#confirmation");

document.querySelectorAll(".choice-section").forEach((section) => {
  const group = section.dataset.group;

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

confirmButton.addEventListener("click", () => {
  state.confirmed = true;
  saveState();
  render();
});

resetButton.addEventListener("click", () => {
  Object.assign(state, defaultState);
  saveState();
  render();
});

render();

function render() {
  document.querySelectorAll(".choice-section").forEach((section) => {
    const group = section.dataset.group;

    section.querySelectorAll(".choice-card").forEach((button) => {
      button.classList.toggle("is-selected", state[group] === button.dataset.value);
    });
  });

  labels.program.textContent = state.program || "Nincs kiválasztva";
  labels.food.textContent = state.food || "Nincs kiválasztva";
  labels.after.textContent = state.after || "Nincs kiválasztva";
  labels.reward.textContent = state.reward || "Nem kötelező";

  const completedRequired = requiredGroups.filter((group) => state[group]).length;
  const progress = Math.round((completedRequired / requiredGroups.length) * 100);

  progressText.textContent = `${progress}%`;
  progressBar.style.width = `${progress}%`;
  confirmButton.disabled = completedRequired !== requiredGroups.length;
  confirmation.hidden = !state.confirmed;
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}
