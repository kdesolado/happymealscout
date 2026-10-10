const toys = [
  "SpongeBob × Luffy", "Plankton × Usopp", "Mrs. Puff × Linlin", "Patrick × Zoro", "Squidward × Sanji",
  "Barnacle Boy × Koby", "Sandy × Nami", "Smitty Werbenjägermanjensen × Brook", "SpongeBob × Gear 5 Luffy",
  "Mr. Krabs × Jinbe", "Mermaid Man × Garp", "Gary × Chopper", "Larry × Franky", "Pearl × Robin", "Flying Dutchman × Teach"
];

const toyGrid = document.querySelector("#toy-grid");
toys.forEach((toy, index) => {
  const card = document.createElement("article");
  card.className = "toy-card";
  card.dataset.toy = toy.toLowerCase();
  card.innerHTML = `<span class="number">Toy #${index + 1}</span><strong>${toy}</strong><small>${index % 4 === 0 ? "Highly reported" : "Community tracked"}</small>`;
  toyGrid.appendChild(card);
});

const form = document.querySelector("#finder-form");
const zip = document.querySelector("#zip-search");
const toyFilter = document.querySelector("#toy-filter");
const share = document.querySelector("#share-button");
const toast = document.querySelector("#toast");
const locationCount = document.querySelector("#locations-count");

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function updateSearch() {
  const validZip = /^\d{5}$/.test(zip.value.trim());
  share.disabled = !validZip;
  if (validZip) {
    const seed = Number(zip.value.slice(-2));
    locationCount.textContent = String(8 + (seed % 15));
  }
}

zip.addEventListener("input", () => {
  zip.value = zip.value.replace(/\D/g, "");
  updateSearch();
});

form.addEventListener("submit", event => {
  event.preventDefault();
  if (!/^\d{5}$/.test(zip.value)) {
    notify("Enter a valid 5-digit ZIP code.");
    zip.focus();
    return;
  }
  updateSearch();
  document.querySelector("#map").scrollIntoView({ behavior: "smooth", block: "center" });
  notify(`Showing community reports around ${zip.value}.`);
});

toyFilter.addEventListener("change", () => {
  document.querySelectorAll(".toy-card").forEach(card => {
    const match = toyFilter.value === "any" || card.dataset.toy.includes(toyFilter.value);
    card.classList.toggle("active", match && toyFilter.value !== "any");
    card.style.opacity = match || toyFilter.value === "sold-out" ? "1" : ".32";
  });
  notify(toyFilter.value === "any" ? "Showing reports for every toy." : `Filter updated: ${toyFilter.options[toyFilter.selectedIndex].text}`);
});

share.addEventListener("click", async () => {
  const url = `${location.origin}${location.pathname}?zip=${zip.value}&toy=${encodeURIComponent(toyFilter.value)}`;
  try {
    await navigator.clipboard.writeText(url);
    notify("Search link copied.");
  } catch {
    notify(url);
  }
});

document.querySelector("#collapse-map").addEventListener("click", event => {
  const info = document.querySelector(".map-info");
  info.classList.toggle("collapsed");
  event.currentTarget.textContent = info.classList.contains("collapsed") ? "+" : "−";
});

document.querySelector("#location-button").addEventListener("click", () => {
  if (!navigator.geolocation) return notify("Location is not available in this browser.");
  notify("Requesting your location…");
  navigator.geolocation.getCurrentPosition(
    () => { locationCount.textContent = "12"; notify("Nearby demo locations loaded."); },
    () => notify("Location access was not granted. Try a ZIP code instead."),
    { timeout: 6000 }
  );
});

let zoom = 1;
document.querySelector("#zoom-in").addEventListener("click", () => { zoom = Math.min(1.2, zoom + .05); document.querySelector(".map-grid").style.transform = `scale(${zoom})`; });
document.querySelector("#zoom-out").addEventListener("click", () => { zoom = Math.max(.9, zoom - .05); document.querySelector(".map-grid").style.transform = `scale(${zoom})`; });
document.querySelectorAll(".marker,.cluster").forEach(marker => marker.addEventListener("click", () => notify(`${marker.getAttribute("aria-label")}: recent community reports available.`)));
document.querySelector("#feedback").addEventListener("click", () => notify("Thanks! Feedback form coming soon."));

document.querySelector("#language").addEventListener("change", event => {
  notify(event.target.value === "es" ? "La vista en español estará disponible pronto." : "English selected.");
});

const params = new URLSearchParams(location.search);
if (params.get("zip")) { zip.value = params.get("zip").slice(0, 5); updateSearch(); }
if (params.get("toy")) { toyFilter.value = params.get("toy"); toyFilter.dispatchEvent(new Event("change")); }
