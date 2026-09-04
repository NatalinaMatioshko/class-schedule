const DAYS = ["mon", "tue", "wed", "thu", "fri"];
const STORAGE_KEY = "umka-class-schedule-v3";
const PREV_STORAGE_KEY = "umka-class-schedule-v2";
const MIN_FONT_PX = 6;
const MAX_FONT_PX = 22;

const INITIAL_GROUPS = [
  {
    name: "Винахідники",
    days: {
      mon: {
        morning: "Математика 9.15 / Англійська мова\nЖивопис 10.30 (I підгрупа)\nХореографія 11.00\nЖивопис 11.30 (II підгрупа)",
        afternoon: "Early Years. Cambridge (супровід)\nNature",
      },
      tue: {
        morning: "Музика 9.15-9.45\nГрамота 9.50 / Англійська мова\nФізкультура 11.00-11.25",
        afternoon: "Пізнаю світ / Розвиток мови",
      },
      wed: {
        morning: "Early Years. Cambridge (супровід)\nМатематика 9.15 / Англійська мова\nЖивопис 10.50-12.00 (по групах)",
        afternoon: "Підготовка руки до письма 16.15",
      },
      thu: {
        morning: "Early Years. Cambridge (супровід)\nГрамота 9.15 / Англійська мова\nМузика 10.25\nХореографія 11.00-11.25",
        afternoon: "СХД",
      },
      fri: {
        morning: "Англійська мова / Математика 9.15\nФізкультура 10.50-11.20",
        afternoon: "ЯПС 15.15-15.45",
      },
    },
  },
  {
    name: "Дослідники",
    days: {
      mon: {
        morning: "Математика 9.15-10.00\nЖивопис 10.10\nАнгл. мова 10.45\nХореографія 12.00",
        afternoon: "",
      },
      tue: {
        morning: "Грамота. Читання 9.15-9.45\nМузика 10.30-11.00\nФізкультура 12.00-12.25",
        afternoon: "Пізнаю світ / Розвиток мови 15.45-16.15",
      },
      wed: {
        morning: "Математика 9.15-9.50\nЖивопис 10.15-11.00",
        afternoon: "Англійська мова 15.15\nСХД",
      },
      thu: {
        morning: "Грамота 9.15\nАнглійська мова 10.00\nМузика 11.00\nХореографія 12.00-12.25",
        afternoon: "Підготовка руки до письма",
      },
      fri: {
        morning: "Математика 9.15\nФізкультура 10.10-10.40\nАнглійська мова 11.00",
        afternoon: "Early Years. Cambridge\nЯПС",
      },
    },
  },
  {
    name: "Пізнайки",
    days: {
      mon: {
        morning: "Математика 9.15-9.40\nЖивопис 9.45\nАнгл. мова 10.20\nХореографія 11.25-11.45",
        afternoon: "ЯПС",
      },
      tue: {
        morning: "Грамота 9.20-9.40\nМузика 10.10-10.30\nФізкультура 11.45-12.05",
        afternoon: "Early Years. Cambridge / Nature\nЯПС / Розвиток мовлення 15.20",
      },
      wed: {
        morning: "Математика 9.15\nЖивопис 9.50-10.10",
        afternoon: "СХД-пластилінографія\nАнглійська мова 16.05",
      },
      thu: {
        morning: "Грамота 9.20\nМузика 9.45\nАнглійська мова 10.25\nХореографія 11.45-12.05",
        afternoon: "СХД 16.15",
      },
      fri: {
        morning: "Англійська мова 9.20\nФізкультура 9.45-10.05\nМатематика 10.10-10.30",
        afternoon: "Пізнаю світ 15.30-16.00",
      },
    },
  },
  {
    name: "Я самики",
    days: {
      mon: {
        morning: "Живопис 9.20\nАнглійська мова 10.00\nСенсорика 10.20\nХореографія 11.45-12.00",
        afternoon: "ЯПС",
      },
      tue: {
        morning: "Грамота 9.20-9.40\nМузика 9.45-10.10\nЖивопис 10.10-10.30\nФізкультура 11.30-11.45",
        afternoon: "ЯПС / Розвиток мовлення 15.30",
      },
      wed: {
        morning: "Живопис 9.20-9.40\nСенсорний розвиток 9.45-10.05",
        afternoon: "СХД-пластилінографія\nАнглійська мова 15.45",
      },
      thu: {
        morning: "Музика 9.20-9.45\nГрамота 10.20\nХореографія 11.30-11.45",
        afternoon: "Early Years. Cambridge\nСХД",
      },
      fri: {
        morning: "Фізкультура 9.20-9.40\nАнглійська мова 9.45\nМатематика 10.00-10.15",
        afternoon: "Пізнаю світ 15.30-16.00",
      },
    },
  },
];

function emptyDays() {
  const days = {};
  for (const id of DAYS) {
    days[id] = { morning: "", afternoon: "" };
  }
  return days;
}

function defaultState() {
  return {
    groups: INITIAL_GROUPS.map((group) => ({
      name: group.name,
      days: {
        mon: { ...group.days.mon },
        tue: { ...group.days.tue },
        wed: { ...group.days.wed },
        thu: { ...group.days.thu },
        fri: { ...group.days.fri },
      },
    })),
  };
}

function htmlToText(value) {
  if (!value) return "";
  if (!/[<>]/.test(value)) return String(value);
  const box = document.createElement("div");
  box.innerHTML = value;
  return box.innerText.replace(/\n+$/, "");
}

function looksLikeHtml(value) {
  return /<\/?[a-z]|style\s*=/i.test(value || "");
}

function isEmptyState(data) {
  return data.groups.every((group) =>
    DAYS.every(
      (id) =>
        !htmlToText(group.days[id].morning).trim() &&
        !htmlToText(group.days[id].afternoon).trim()
    )
  );
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
      const name = incoming.name ?? group.name;
      const nameText = htmlToText(name).trim();
      return {
        name: /^Я сам(ч)?ики$/i.test(nameText) ? "Я самики" : name,
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
  if (fromLink && !isEmptyState(fromLink)) return fromLink;
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(PREV_STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = mergeState(JSON.parse(raw));
    if (isEmptyState(parsed)) return defaultState();
    return parsed;
  } catch {
    return defaultState();
  }
}

let state = loadState();

function groupRows() {
  return [...document.querySelectorAll(".group-row")];
}

const STYLE_PROPS = ["color", "font-family", "font-size", "font-weight", "font-style", "text-decoration"];
const ALLOWED_TAGS = new Set(["SPAN", "FONT", "BR", "B", "STRONG", "I", "EM", "U", "DIV", "P"]);

function sanitizeStyle(styleText) {
  const dummy = document.createElement("span");
  dummy.setAttribute("style", styleText || "");
  return STYLE_PROPS.map((prop) => {
    const value = dummy.style.getPropertyValue(prop);
    return value ? `${prop}: ${value}` : "";
  })
    .filter(Boolean)
    .join("; ");
}

function sanitizeHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html || "";

  const clean = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.COMMENT_NODE) {
        child.remove();
        return;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) return;
      if (!ALLOWED_TAGS.has(child.tagName)) {
        const fragment = document.createDocumentFragment();
        while (child.firstChild) fragment.appendChild(child.firstChild);
        child.replaceWith(fragment);
        clean(node);
        return;
      }
      [...child.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (name === "style") {
          const next = sanitizeStyle(attr.value);
          if (next) child.setAttribute("style", next);
          else child.removeAttribute("style");
        } else if (name === "class" && /^(lesson-red|lesson-red-en)$/.test(attr.value.trim())) {
          child.setAttribute("class", attr.value.trim());
        } else if (name === "color" && child.tagName === "FONT") {
          child.setAttribute("color", attr.value);
        } else if (name === "face" && child.tagName === "FONT") {
          child.setAttribute("face", attr.value);
        } else {
          child.removeAttribute(attr.name);
        }
      });
      clean(child);
    });
  };

  clean(template.content);
  return template.innerHTML;
}

function compactCellHtml(el) {
  const html = sanitizeHtml(el.innerHTML).replace(/\s+$/, "");
  if (!looksLikeHtml(html)) return htmlToText(html);
  return html;
}

function readFromDom() {
  groupRows().forEach((row, groupIndex) => {
    const group = state.groups[groupIndex];
    group.name = compactCellHtml(row.querySelector(".group-name span"));
    row.querySelectorAll("td").forEach((cell, dayIndex) => {
      const [morning, afternoon] = cell.querySelectorAll(".lessons");
      group.days[DAYS[dayIndex]].morning = compactCellHtml(morning);
      group.days[DAYS[dayIndex]].afternoon = compactCellHtml(afternoon);
    });
  });
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatLessons(text) {
  const src = text || "";
  const rules = [
    { re: /E[aа]rly Years\. Cambridge(?:\s*\(\s*супровід\s*\))?/gi, className: "lesson-red" },
    { re: /Англійська мова|Англ\.\s*мова/gi, className: "lesson-red-en" },
  ];
  const hits = [];
  for (const rule of rules) {
    rule.re.lastIndex = 0;
    let match;
    while ((match = rule.re.exec(src))) {
      hits.push({
        start: match.index,
        end: match.index + match[0].length,
        className: rule.className,
      });
    }
  }
  hits.sort((a, b) => a.start - b.start || b.end - a.end);

  const picked = [];
  let cursor = 0;
  for (const hit of hits) {
    if (hit.start < cursor) continue;
    picked.push(hit);
    cursor = hit.end;
  }

  let html = "";
  let last = 0;
  for (const hit of picked) {
    html += escapeHtml(src.slice(last, hit.start)).replace(/\n/g, "<br>");
    html += `<span class="${hit.className}">${escapeHtml(src.slice(hit.start, hit.end))}</span>`;
    last = hit.end;
  }
  html += escapeHtml(src.slice(last)).replace(/\n/g, "<br>");
  return html;
}

function paintLessons(el, text) {
  el.innerHTML = formatLessons(text);
}

function setRichText(el, value, asLessons) {
  if (looksLikeHtml(value)) {
    el.innerHTML = sanitizeHtml(value);
    return;
  }
  if (asLessons) paintLessons(el, value);
  else el.textContent = value || "";
}

function hasCustomStyle(el) {
  if ((el.getAttribute("style") || "").trim()) return true;
  return Boolean(el.querySelector("[style], font[color], font[face]"));
}

function applyState() {
  groupRows().forEach((row, groupIndex) => {
    const group = state.groups[groupIndex];
    setRichText(row.querySelector(".group-name span"), group.name, false);
    row.querySelectorAll("td").forEach((cell, dayIndex) => {
      const [morning, afternoon] = cell.querySelectorAll(".lessons");
      setRichText(morning, group.days[DAYS[dayIndex]].morning, true);
      setRichText(afternoon, group.days[DAYS[dayIndex]].afternoon, true);
    });
  });
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const next = `${location.pathname}${location.search}#s=${encodeShare(state)}`;
  history.replaceState(null, "", next);
}

function scaleSheetToScreen() {
  if (window.matchMedia("print").matches) return;
  const wrap = document.querySelector(".sheet-wrap");
  const sheet = document.querySelector(".sheet");
  if (!wrap || !sheet) return;
  sheet.style.transform = "none";
  const naturalW = sheet.offsetWidth;
  const naturalH = sheet.offsetHeight;
  const available = Math.max(document.documentElement.clientWidth - 32, 160);
  const scale = Math.min(1, available / naturalW);
  sheet.style.transformOrigin = "top left";
  sheet.style.transform = scale < 0.999 ? `scale(${scale})` : "none";
  wrap.style.width = `${naturalW * scale}px`;
  wrap.style.height = `${naturalH * scale}px`;
}

function fitSheetForPrint() {
  const sheet = document.querySelector(".sheet");
  const wrap = document.querySelector(".sheet-wrap");
  const content = document.querySelector(".sheet-content");
  if (!sheet || !content) return;
  sheet.style.transform = "none";
  if (wrap) {
    wrap.style.width = "";
    wrap.style.height = "";
  }
  content.style.transform = "none";
  const available = sheet.clientHeight;
  const needed = content.scrollHeight;
  const scale = Math.min(1, available / Math.max(needed, 1));
  content.style.transformOrigin = "top center";
  content.style.transform = scale < 0.995 ? `scale(${scale})` : "none";
}

function clearPrintFit() {
  const content = document.querySelector(".sheet-content");
  if (content) content.style.transform = "none";
  scaleSheetToScreen();
}

function persistEdits() {
  readFromDom();
  saveState();
  scaleSheetToScreen();
}

let savedRange = null;
let activeEditor = null;

function isEditor(node) {
  if (!node) return null;
  const el = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  return el?.closest('[contenteditable="true"]') || null;
}

function rememberSelection() {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  const editor = isEditor(sel.anchorNode);
  if (!editor) return;
  activeEditor = editor;
  savedRange = sel.getRangeAt(0).cloneRange();
}

function restoreSelection() {
  if (!savedRange || !activeEditor) return false;
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(savedRange);
  return true;
}

function currentFontSize() {
  const node = savedRange?.commonAncestorContainer;
  const el = node
    ? node.nodeType === Node.ELEMENT_NODE
      ? node
      : node.parentElement
    : activeEditor;
  return parseFloat(getComputedStyle(el || activeEditor).fontSize) || 9;
}

function quoteFont(family) {
  if (!family) return "";
  return family
    .split(",")
    .map((part) => {
      const name = part.trim();
      return name.includes(" ") && !/^["'].*["']$/.test(name) ? `"${name}"` : name;
    })
    .join(", ");
}

function paintTree(root, styles) {
  const apply = (el) => {
    if (el.tagName === "BR") return;
    if (styles.color) el.style.color = styles.color;
    if (Object.prototype.hasOwnProperty.call(styles, "fontFamily")) {
      if (styles.fontFamily) el.style.fontFamily = styles.fontFamily;
      else el.style.removeProperty("font-family");
    }
    if (styles.fontSize) el.style.fontSize = styles.fontSize;
  };
  apply(root);
  root.querySelectorAll("*").forEach(apply);
}

function applyStyles(styles, sizeDelta) {
  if (!activeEditor) return;
  restoreSelection();
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  let range = sel.getRangeAt(0);
  const nextStyles = { ...styles };
  if (nextStyles.fontFamily) nextStyles.fontFamily = quoteFont(nextStyles.fontFamily);
  if (sizeDelta) {
    nextStyles.fontSize = `${Math.min(MAX_FONT_PX, Math.max(MIN_FONT_PX, currentFontSize() + sizeDelta))}px`;
  }

  if (range.collapsed) {
    range = document.createRange();
    range.selectNodeContents(activeEditor);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  const span = document.createElement("span");
  const contents = range.extractContents();
  span.appendChild(contents);
  paintTree(span, nextStyles);
  range.insertNode(span);
  const next = document.createRange();
  next.selectNodeContents(span);
  sel.removeAllRanges();
  sel.addRange(next);
  savedRange = next.cloneRange();
  persistEdits();
}

function bindFormatBar() {
  const bar = document.querySelector(".format-bar");
  const fontSelect = document.getElementById("font-family");
  const colorInput = document.getElementById("font-color");
  if (!bar) return;

  bar.addEventListener("mousedown", (event) => {
    rememberSelection();
    if (event.target.closest("select, input[type=color]")) return;
    event.preventDefault();
  });

  fontSelect.addEventListener("change", () => {
    applyStyles({ fontFamily: fontSelect.value || "" });
  });

  document.getElementById("font-smaller").addEventListener("click", () => applyStyles({}, -1));
  document.getElementById("font-larger").addEventListener("click", () => applyStyles({}, 1));

  bar.querySelectorAll(".color-swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      const color = btn.getAttribute("data-color");
      colorInput.value = color;
      applyStyles({ color });
    });
  });

  colorInput.addEventListener("input", () => applyStyles({ color: colorInput.value }));
}

function bind() {
  const sheet = document.querySelector(".sheet");
  sheet.addEventListener("input", persistEdits);

  sheet.addEventListener("focusin", (event) => {
    activeEditor = isEditor(event.target);
    rememberSelection();
  });

  document.addEventListener("selectionchange", rememberSelection);

  sheet.addEventListener("focusout", (event) => {
    const el = event.target.closest(".lessons");
    if (!el || el.contains(event.relatedTarget)) return;
    persistEdits();
    if (!hasCustomStyle(el)) {
      paintLessons(el, el.innerText.replace(/\n+$/, ""));
      persistEdits();
    }
  });

  bindFormatBar();

  document.getElementById("print-btn").addEventListener("click", () => window.print());

  window.addEventListener("beforeprint", fitSheetForPrint);
  window.addEventListener("afterprint", clearPrintFit);

  window.addEventListener("resize", scaleSheetToScreen);

  document.getElementById("share-btn").addEventListener("click", async () => {
    persistEdits();
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

  if (window.ResizeObserver) {
    new ResizeObserver(scaleSheetToScreen).observe(sheet);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyState();
  bind();
  saveState();
  scaleSheetToScreen();
});
