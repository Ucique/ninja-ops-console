const STORAGE_KEY = "ninjaOpsCabinetDataV1";
const state = {
  cards: [],
  budget: {
    currency: "USD",
    weeklyLimit: 0,
    monthlyLimit: 0,
    expenses: []
  }
};

const grid = document.querySelector(".cabinet-grid");
const exportBtn = document.querySelector("[data-action='export']");
const importBtn = document.querySelector("[data-action='import']");
const importInput = document.querySelector("#import-json");
const addCardBtn = document.querySelector("[data-action='add-card']");

const formatCurrency = (value, currency) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0
  });
  return formatter.format(value || 0);
};

const saveState = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const loadState = async () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    Object.assign(state, JSON.parse(stored));
    return;
  }
  const response = await fetch("assets/data.json");
  const data = await response.json();
  Object.assign(state, data);
  saveState();
};

const createId = (prefix) => `${prefix}-${crypto.randomUUID()}`;

const render = () => {
  grid.innerHTML = "";
  state.cards.forEach((card, index) => {
    const cardEl = document.createElement("article");
    cardEl.className = "card fade-in";
    cardEl.dataset.id = card.id;
    cardEl.dataset.urgency = card.urgency;
    cardEl.dataset.leverage = card.leverage;
    cardEl.draggable = true;

    cardEl.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", card.id);
      event.dataTransfer.effectAllowed = "move";
    });

    cardEl.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    });

    cardEl.addEventListener("drop", (event) => {
      event.preventDefault();
      const draggedId = event.dataTransfer.getData("text/plain");
      if (!draggedId || draggedId === card.id) return;
      const fromIndex = state.cards.findIndex((item) => item.id === draggedId);
      const toIndex = index;
      if (fromIndex === -1) return;
      const [moved] = state.cards.splice(fromIndex, 1);
      state.cards.splice(toIndex, 0, moved);
      saveState();
      render();
    });

    cardEl.appendChild(renderCardHeader(card));

    if (card.type === "vault") {
      cardEl.appendChild(renderVault());
      grid.appendChild(cardEl);
      return;
    }

    cardEl.appendChild(renderDescription(card));
    cardEl.appendChild(renderChecklist(card));
    cardEl.appendChild(renderTags(card));
    cardEl.appendChild(renderSliders(card));

    if (card.type === "money") {
      cardEl.appendChild(renderBudgetWidget());
    }

    if (card.type === "weekly") {
      cardEl.appendChild(renderWeekStrip(card));
    }

    grid.appendChild(cardEl);
  });
};

const renderCardHeader = (card) => {
  const header = document.createElement("div");
  header.className = "card-header";

  const title = document.createElement("input");
  title.className = "card-title";
  title.value = card.title;
  title.setAttribute("aria-label", "Card title");
  title.addEventListener("input", (event) => {
    card.title = event.target.value;
    saveState();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    const ok = window.confirm("Delete this card?");
    if (!ok) return;
    state.cards = state.cards.filter((item) => item.id !== card.id);
    saveState();
    render();
  });

  header.appendChild(title);
  if (card.type !== "vault") {
    header.appendChild(deleteBtn);
  }
  return header;
};

const renderDescription = (card) => {
  const wrap = document.createElement("div");

  const label = document.createElement("div");
  label.className = "section-title";
  label.textContent = "Notes";

  const textarea = document.createElement("textarea");
  textarea.value = card.description || "";
  textarea.addEventListener("input", (event) => {
    card.description = event.target.value;
    saveState();
  });

  wrap.appendChild(label);
  wrap.appendChild(textarea);
  return wrap;
};

const renderChecklist = (card) => {
  const wrap = document.createElement("div");

  const label = document.createElement("div");
  label.className = "section-title";
  label.textContent = "Checklist";

  const list = document.createElement("div");
  list.className = "checklist";

  card.checklist.forEach((item) => {
    const row = document.createElement("div");
    row.className = "check-item";
    if (item.done) row.classList.add("checked");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.addEventListener("change", (event) => {
      item.done = event.target.checked;
      saveState();
      render();
    });

    const input = document.createElement("input");
    input.type = "text";
    input.value = item.text;
    input.addEventListener("input", (event) => {
      item.text = event.target.value;
      saveState();
    });

    row.appendChild(checkbox);
    row.appendChild(input);
    list.appendChild(row);
  });

  const addBtn = document.createElement("button");
  addBtn.className = "secondary";
  addBtn.textContent = "Add item";
  addBtn.addEventListener("click", () => {
    card.checklist.push({ id: createId("item"), text: "New item", done: false });
    saveState();
    render();
  });

  wrap.appendChild(label);
  wrap.appendChild(list);
  wrap.appendChild(addBtn);
  return wrap;
};

const renderTags = (card) => {
  const wrap = document.createElement("div");

  const label = document.createElement("div");
  label.className = "section-title";
  label.textContent = "Tags";

  const tagRow = document.createElement("div");
  tagRow.className = "tags";

  card.tags.forEach((tag) => {
    const chip = document.createElement("span");
    chip.className = "tag";
    chip.textContent = tag;
    tagRow.appendChild(chip);
  });

  const tagInput = document.createElement("input");
  tagInput.className = "tag-input";
  tagInput.placeholder = "+ add tag";
  tagInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const value = event.target.value.trim();
      if (!value) return;
      card.tags.push(value);
      event.target.value = "";
      saveState();
      render();
    }
  });

  tagRow.appendChild(tagInput);
  wrap.appendChild(label);
  wrap.appendChild(tagRow);
  return wrap;
};

const renderSliders = (card) => {
  const wrap = document.createElement("div");
  wrap.className = "slider-row";

  const urgency = sliderBlock("Urgency", card.urgency, (value) => {
    card.urgency = value;
    saveState();
    render();
  });

  const leverage = sliderBlock("Leverage", card.leverage, (value) => {
    card.leverage = value;
    saveState();
    render();
  });

  wrap.appendChild(urgency);
  wrap.appendChild(leverage);
  return wrap;
};

const sliderBlock = (labelText, value, onChange) => {
  const block = document.createElement("div");
  block.className = "slider-block";

  const label = document.createElement("label");
  label.className = "section-title";
  label.textContent = `${labelText}: ${value}`;

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = 1;
  slider.max = 5;
  slider.value = value;
  slider.addEventListener("input", (event) => {
    label.textContent = `${labelText}: ${event.target.value}`;
  });
  slider.addEventListener("change", (event) => {
    onChange(Number(event.target.value));
  });

  block.appendChild(label);
  block.appendChild(slider);
  return block;
};

const renderBudgetWidget = () => {
  const wrap = document.createElement("div");
  wrap.className = "budget-widget";

  const label = document.createElement("div");
  label.className = "section-title";
  label.textContent = "Budget Console";

  const grid = document.createElement("div");
  grid.className = "budget-grid";

  const currencySelect = document.createElement("select");
  ["USD", "EUR", "GBP"].forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.textContent = option;
    if (state.budget.currency === option) opt.selected = true;
    currencySelect.appendChild(opt);
  });
  currencySelect.addEventListener("change", (event) => {
    state.budget.currency = event.target.value;
    saveState();
    render();
  });

  const weeklyInput = document.createElement("input");
  weeklyInput.type = "number";
  weeklyInput.value = state.budget.weeklyLimit;
  weeklyInput.placeholder = "Weekly limit";
  weeklyInput.addEventListener("change", (event) => {
    state.budget.weeklyLimit = Number(event.target.value);
    saveState();
    render();
  });

  const monthlyInput = document.createElement("input");
  monthlyInput.type = "number";
  monthlyInput.value = state.budget.monthlyLimit;
  monthlyInput.placeholder = "Monthly limit";
  monthlyInput.addEventListener("change", (event) => {
    state.budget.monthlyLimit = Number(event.target.value);
    saveState();
    render();
  });

  grid.appendChild(currencySelect);
  grid.appendChild(weeklyInput);
  grid.appendChild(monthlyInput);

  const expenseRow = document.createElement("div");
  expenseRow.className = "budget-grid";

  const amountInput = document.createElement("input");
  amountInput.type = "number";
  amountInput.placeholder = "Amount";

  const categorySelect = document.createElement("select");
  ["Ads", "Tools", "Domains", "Other"].forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.textContent = option;
    categorySelect.appendChild(opt);
  });

  const noteInput = document.createElement("input");
  noteInput.type = "text";
  noteInput.placeholder = "Note";

  const addExpenseBtn = document.createElement("button");
  addExpenseBtn.textContent = "Add expense";
  addExpenseBtn.addEventListener("click", () => {
    const amount = Number(amountInput.value);
    if (!amount) return;
    state.budget.expenses.unshift({
      id: createId("expense"),
      amount,
      category: categorySelect.value,
      note: noteInput.value.trim() || "Quick add",
      date: new Date().toISOString().split("T")[0]
    });
    amountInput.value = "";
    noteInput.value = "";
    saveState();
    render();
  });

  expenseRow.appendChild(amountInput);
  expenseRow.appendChild(categorySelect);
  expenseRow.appendChild(noteInput);
  expenseRow.appendChild(addExpenseBtn);

  const status = renderBudgetStatus();

  wrap.appendChild(label);
  wrap.appendChild(grid);
  wrap.appendChild(expenseRow);
  wrap.appendChild(status);
  return wrap;
};

const renderBudgetStatus = () => {
  const status = document.createElement("div");
  status.className = "budget-status";

  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);

  const weeklySpend = state.budget.expenses
    .filter((expense) => new Date(expense.date) >= weekAgo)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const monthlySpend = state.budget.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const weeklyRatio = state.budget.weeklyLimit
    ? weeklySpend / state.budget.weeklyLimit
    : 0;
  const monthlyRatio = state.budget.monthlyLimit
    ? monthlySpend / state.budget.monthlyLimit
    : 0;

  status.appendChild(
    buildStatusCard(
      "Weekly",
      formatCurrency(weeklySpend, state.budget.currency),
      state.budget.weeklyLimit,
      weeklyRatio
    )
  );
  status.appendChild(
    buildStatusCard(
      "Monthly",
      formatCurrency(monthlySpend, state.budget.currency),
      state.budget.monthlyLimit,
      monthlyRatio
    )
  );

  const remaining = Math.max(
    state.budget.monthlyLimit - monthlySpend,
    0
  );

  const remainingCard = document.createElement("div");
  remainingCard.className = "status-card";
  remainingCard.innerHTML = `<span>Remaining</span><strong>${formatCurrency(
    remaining,
    state.budget.currency
  )}</strong>`;
  status.appendChild(remainingCard);

  return status;
};

const buildStatusCard = (label, spendFormatted, limit, ratio) => {
  const card = document.createElement("div");
  card.className = "status-card";
  if (ratio > 0.9) {
    card.classList.add("status-urgent");
  } else if (ratio > 0.6) {
    card.classList.add("status-warn");
  } else {
    card.classList.add("status-calm");
  }

  card.innerHTML = `
    <span>${label}</span>
    <strong>${spendFormatted}</strong>
    <small>Limit: ${formatCurrency(limit, state.budget.currency)}</small>
  `;
  return card;
};

const renderWeekStrip = (card) => {
  const wrap = document.createElement("div");

  const label = document.createElement("div");
  label.className = "section-title";
  label.textContent = "Week Strip";

  const strip = document.createElement("div");
  strip.className = "week-strip";

  card.weekBlocks = card.weekBlocks || [];

  card.weekBlocks.forEach((block, index) => {
    const blockEl = document.createElement("div");
    blockEl.className = "week-block";
    blockEl.textContent = block.label;
    blockEl.draggable = true;

    blockEl.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", block.id);
    });

    blockEl.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    blockEl.addEventListener("drop", (event) => {
      event.preventDefault();
      const draggedId = event.dataTransfer.getData("text/plain");
      if (!draggedId || draggedId === block.id) return;
      const fromIndex = card.weekBlocks.findIndex((item) => item.id === draggedId);
      const toIndex = index;
      if (fromIndex === -1) return;
      const [moved] = card.weekBlocks.splice(fromIndex, 1);
      card.weekBlocks.splice(toIndex, 0, moved);
      saveState();
      render();
    });

    strip.appendChild(blockEl);
  });

  const addBlockBtn = document.createElement("button");
  addBlockBtn.className = "secondary";
  addBlockBtn.textContent = "Add block";
  addBlockBtn.addEventListener("click", () => {
    card.weekBlocks.push({ id: createId("week"), label: "New block" });
    saveState();
    render();
  });

  wrap.appendChild(label);
  wrap.appendChild(strip);
  wrap.appendChild(addBlockBtn);
  return wrap;
};

const renderVault = () => {
  const locked = document.createElement("div");
  locked.className = "locked-panel";
  locked.innerHTML = `
    <strong>LOCKED</strong>
    <p>Hints only. Secrets remain sealed.</p>
  `;
  return locked;
};

const setupControls = () => {
  exportBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ninja-ops-cabinet.json";
    link.click();
    URL.revokeObjectURL(url);
  });

  importBtn.addEventListener("click", () => {
    importInput.click();
  });

  importInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const data = JSON.parse(loadEvent.target.result);
        Object.assign(state, data);
        saveState();
        render();
      } catch (error) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  });

  addCardBtn.addEventListener("click", () => {
    const title = window.prompt("Card title", "New Cabinet Slot");
    if (!title) return;
    state.cards.push({
      id: createId("card"),
      title,
      description: "",
      checklist: [],
      tags: [],
      urgency: 2,
      leverage: 2,
      type: "standard"
    });
    saveState();
    render();
  });
};

const init = async () => {
  await loadState();
  setupControls();
  render();
};

init();
