const DAYS = ["mon", "tue", "wed", "thu", "fri"];
const DEFAULT_GROUPS = ["Винахідники", "Дослідники", "Пізнайки", "Я самчики"];
const STORAGE_KEY = "umka-class-schedule-v1";

function emptyDays() {
  const days = {};
  for (const id of DAYS) {
    days[id] = { morning: "", afternoon: "" };
  }
  return days;
}

function defaultState() {
  return {
    groups: DEFAULT_GROUPS.map((name) => ({
      name,
      days: emptyDays(),
    })),
  };
}

function mergeState(parsed) {
  const base = defaultState();
  if (!parsed || !Array.isArray(parsed.groups)) return base;
  return {
    groups: base.groups.map((group, index) => {
      const incoming = parsed.groups[index] || {};
      const days = emptyDays();
      for (const id of DAYS) {
        days[id] = {
          morning: incoming.days?.[id]?.morning ?? "",
          afternoon: incoming.days?.[id]?.afternoon ?? "",
        };
      }
      return {
        name: incoming.name ?? group.name,
        days,
      };
    }),
  };
}

function encodeShare(data) {
  return encodeURIComponent(JSON.stringify(data));
}

function decodeShare(raw) {
  return JSON.parse(decodeURIComponent(raw));
}

function stateFromHash() {
  const hash = location.hash.startsWith("#s=") ? location.hash.slice(3) : "";
  if (!hash) return null;
  try {
    return mergeState(decodeShare(hash));
  } catch {
    return null;
  }
}

function loadState() {
  const fromLink = stateFromHash();
  if (fromLink) return fromLink;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return mergeState(JSON.parse(raw));
  } catch {
    return defaultState();
  }
}

let state = loadState();

function groupRows() {
  return [...document.querySelectorAll(".group-row")];
}

function readFromDom() {
  groupRows().forEach((row, groupIndex) => {
    const group = state.groups[groupIndex];
    group.name = row.querySelector(".group-name span").innerText.replace(/\n/g, " ").trim();
    row.querySelectorAll("td").forEach((cell, dayIndex) => {
      const [morning, afternoon] = cell.querySelectorAll(".lessons");
      group.days[DAYS[dayIndex]].morning = morning.innerText.replace(/\n+$/, "");
      group.days[DAYS[dayIndex]].afternoon = afternoon.innerText.replace(/\n+$/, "");
    });
  });
}

function applyState() {
  groupRows().forEach((row, groupIndex) => {
    const group = state.groups[groupIndex];
    row.querySelector(".group-name span").textContent = group.name;
    row.querySelectorAll("td").forEach((cell, dayIndex) => {
      const [morning, afternoon] = cell.querySelectorAll(".lessons");
      morning.textContent = group.days[DAYS[dayIndex]].morning;
      afternoon.textContent = group.days[DAYS[dayIndex]].afternoon;
    });
  });
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const next = `${location.pathname}${location.search}#s=${encodeShare(state)}`;
  history.replaceState(null, "", next);
}

function bind() {
  const sheet = document.querySelector(".sheet");
  sheet.addEventListener("input", () => {
    readFromDom();
    saveState();
  });

  document.getElementById("print-btn").addEventListener("click", () => window.print());

  document.getElementById("share-btn").addEventListener("click", async () => {
    readFromDom();
    saveState();
    const hint = document.getElementById("share-hint");
    try {
      await navigator.clipboard.writeText(location.href);
      hint.hidden = false;
      hint.textContent =
        "Посилання скопійовано. Відкрий його на іншому комп’ютері — розклад буде той самий.";
    } catch {
      hint.hidden = false;
      hint.textContent =
        "Скопіюй адресу з рядка браузера і відкрий її на іншому комп’ютері.";
    }
  });

  window.addEventListener("hashchange", () => {
    const fromLink = stateFromHash();
    if (!fromLink) return;
    state = fromLink;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    applyState();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyState();
  bind();
  saveState();
});
