const header = document.querySelector("[data-header]");
const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
const eventCards = Array.from(document.querySelectorAll(".event-card"));
const resultCount = document.querySelector("[data-result-count]");
const searchInput = document.querySelector("#event-search");

function syncHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 8);
}

function activeFilter() {
  const active = filterButtons.find((button) => button.classList.contains("is-active"));
  return active ? active.dataset.filter : "all";
}

function normalizedSearch() {
  return searchInput ? searchInput.value.trim().toLowerCase() : "";
}

function matchesCard(card, filter, search) {
  const formatMatch = filter === "all" || card.dataset.format === filter;
  const searchText = `${card.textContent} ${card.dataset.search || ""}`.toLowerCase();
  const searchMatch = !search || searchText.includes(search);
  return formatMatch && searchMatch;
}

function renderDirectory() {
  const filter = activeFilter();
  const search = normalizedSearch();
  let shown = 0;

  eventCards.forEach((card) => {
    const visible = matchesCard(card, filter, search);
    card.hidden = !visible;
    if (visible) shown += 1;
  });

  if (resultCount) {
    const suffix = shown === 1 ? "listing" : "listings";
    resultCount.textContent = search || filter !== "all"
      ? `Showing ${shown} ${suffix}.`
      : "Showing all listings.";
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("is-active");
    button.setAttribute("aria-pressed", "true");
    renderDirectory();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", renderDirectory);
}

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();
renderDirectory();
