function getFromStorage() {
  const data = localStorage.getItem("countries");
  return data ? JSON.parse(data) : countries;
}

function setToStorage(data) {
  localStorage.setItem("countries", JSON.stringify(data));
}

function getTheme() {
  return localStorage.getItem("theme") || "light";
}

function setTheme(theme) {
  localStorage.setItem("theme", theme);
}

let countriesData = getFromStorage();

const elCountryList = document.querySelector(".country-list");
const elSearchInput = document.querySelector(".search-input");
const elSelect = document.querySelector(".select-capitals");
const elLikeCount = document.querySelector(".like-count");
const elBasketCount = document.querySelector(".basket-count");
const elLikeBtn = document.querySelector(".like-btn");
const elBasketBtn = document.querySelector(".basket-btn");
const elModalWrapper = document.querySelector(".modal-wrapper");
const elCreateForm = document.querySelector(".create-form");
const modalTitle = document.getElementById("modalTitle");
const infoModal = document.getElementById("infoModal");
const deleteModal = document.getElementById("deleteModal");
const deleteCountry = document.getElementById("deleteCountry");
const cancelDelete = document.getElementById("cancelDelete");
const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalPopulation = document.getElementById("modalPopulation");
const modalCapital = document.getElementById("modalCapital");
const modalRegion = document.getElementById("modalRegion");
const modalArea = document.getElementById("modalArea");
const sortCountry = document.getElementById("sort-countries");
const loadingSpinner = document.getElementById("loadingSpinner");
const themeToggle = document.getElementById("themeToggle");

let editId = null;
let currentCountry = null;
let currentDeleteId = null;

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
                </svg>`;
  } else {
    document.body.classList.remove("dark-mode");
    themeToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/>
                </svg>`;
  }
}

themeToggle.addEventListener("click", () => {
  const currentTheme = getTheme();
  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
  applyTheme(newTheme);
});

applyTheme(getTheme());

function showLoading() {
  loadingSpinner.classList.remove("scale-0");
}

function hideLoading() {
  setTimeout(() => {
    loadingSpinner.classList.add("scale-0");
  }, 1000);
}

function renderCountry(arr, list) {
  list.innerHTML = "";
  arr.forEach((item) => {
    const elItem = document.createElement("li");
    elItem.className =
      "bg-white w-[264px] rounded-md overflow-hidden animate-fadeIn shadow-lg";
    elItem.innerHTML = `
                    <img class="w-full h-[150px] object-cover" src="${
                      item.img
                    }" alt="${item.name}">
                    <div class="p-4">
                        <h3 class="font-bold text-xl mb-2">${item.name}</h3>
                        <p class="text-sm mb-1"><strong>Population:</strong> ${
                          item.population
                        }</p>
                        <p class="text-sm mb-4"><strong>Capital:</strong> ${
                          item.capital
                        }</p>
                        <div class="flex gap-2 justify-between">
                            <button onclick="handleLikeBtnClick(${
                              item.id
                            })" class="text-xl transition hover:scale-125 ${
      item.active ? "text-red-500" : ""
    }">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                                </svg>
                            </button>
                            <button onclick="handleBasketBtnClick(${
                              item.id
                            })" class="text-xl transition hover:scale-125 ${
      item.saved ? "text-green-500" : ""
    }">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                                </svg>
                            </button>
                            <button onclick="handleOpenInfoModal(${
                              item.id
                            })" class="text-xl transition hover:scale-125">ℹ️</button>
                            <button onclick="handleEdit(${
                              item.id
                            })" class="text-xl transition hover:scale-125">✏️</button>
                            <button onclick="handleDelete(${
                              item.id
                            })" class="text-xl transition hover:scale-125">🗑</button>
                        </div>
                    </div>
                `;
    list.appendChild(elItem);
  });
  elLikeCount.textContent = countriesData.filter((item) => item.active).length;
  elBasketCount.textContent = countriesData.filter((item) => item.saved).length;
}

function selectCountry(arr, list) {
  const currentValue = list.value;
  list.innerHTML = `<option value="all">All</option>`;
  const regions = arr.reduce((prev, curr) => {
    if (!prev.includes(curr.region)) prev.push(curr.region);
    return prev;
  }, []);
  regions.forEach((region) => {
    const option = document.createElement("option");
    option.value = region.toLowerCase();
    option.textContent = region;
    list.appendChild(option);
  });
  list.value = currentValue;
}

elSelect.addEventListener("change", (e) => {
  const selected = e.target.value;
  if (selected === "all") {
    renderCountry(countriesData, elCountryList);
  } else {
    const filtered = countriesData.filter(
      (country) => country.region.toLowerCase() === selected
    );
    renderCountry(filtered, elCountryList);
  }
});

sortCountry.addEventListener("change", (e) => {
  const selected = e.target.value;
  let sortedCountry = [...countriesData];

  switch (String(selected)) {
    case "nameaz":
      sortedCountry.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "nameza":
      sortedCountry.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "populationaz":
      sortedCountry.sort((a, b) => {
        const popA = parseInt(a.population.replace(/,/g, ""));
        const popB = parseInt(b.population.replace(/,/g, ""));
        return popA - popB;
      });
      break;
    case "populationza":
      sortedCountry.sort((a, b) => {
        const popA = parseInt(a.population.replace(/,/g, ""));
        const popB = parseInt(b.population.replace(/,/g, ""));
        return popB - popA;
      });
      break;
    default:
      sortedCountry = [...countriesData];
      break;
  }

  renderCountry(sortedCountry, elCountryList);
});

let isLikeFilterActive = false;
let isBasketFilterActive = false;

function handleLikeBtnClick(id) {
  const item = countriesData.find((item) => item.id === id);
  item.active = !item.active;
  setToStorage(countriesData);

  elLikeCount.textContent = countriesData.filter((item) => item.active).length;

  const buttons = document.querySelectorAll(
    `button[onclick="handleLikeBtnClick(${id})"]`
  );
  buttons.forEach((btn) => {
    if (item.active) {
      btn.classList.add("text-red-500");
    } else {
      btn.classList.remove("text-red-500");
    }
  });
  if (isLikeFilterActive) {
    const liked = countriesData.filter((item) => item.active);
    renderCountry(liked, elCountryList);
  }
}

elLikeBtn.addEventListener("click", () => {
  isLikeFilterActive = !isLikeFilterActive;

  if (isLikeFilterActive) {
    isBasketFilterActive = false;
    const liked = countriesData.filter((item) => item.active);
    renderCountry(liked, elCountryList);
    elLikeBtn.style.cssText =
      "background-color: #ef4444 !important; color: white !important;";
    elBasketBtn.style.cssText = "";
  } else {
    renderCountry(countriesData, elCountryList);
    elLikeBtn.style.cssText = "";
  }
});

function handleBasketBtnClick(id) {
  const item = countriesData.find((item) => item.id === id);
  item.saved = !item.saved;
  setToStorage(countriesData);

  elBasketCount.textContent = countriesData.filter((item) => item.saved).length;

  const buttons = document.querySelectorAll(
    `button[onclick="handleBasketBtnClick(${id})"]`
  );
  buttons.forEach((btn) => {
    if (item.saved) {
      btn.classList.add("text-green-500");
    } else {
      btn.classList.remove("text-green-500");
    }
  });

  if (isBasketFilterActive) {
    const saved = countriesData.filter((item) => item.saved);
    renderCountry(saved, elCountryList);
  }
}

elBasketBtn.addEventListener("click", () => {
  isBasketFilterActive = !isBasketFilterActive;

  if (isBasketFilterActive) {
    isLikeFilterActive = false;
    const saved = countriesData.filter((item) => item.saved);
    renderCountry(saved, elCountryList);
    elBasketBtn.style.cssText =
      "background-color: #22c55e !important; color: white !important;";
    elLikeBtn.style.cssText = "";
  } else {
    renderCountry(countriesData, elCountryList);
    elBasketBtn.style.cssText = "";
  }
});

function handleDelete(id) {
  currentDeleteId = id;
  deleteModal.classList.remove("scale-0");
}

deleteCountry.addEventListener("click", (e) => {
  e.preventDefault();
  if (currentDeleteId !== null) {
    showLoading();
    setTimeout(() => {
      const index = countriesData.findIndex(
        (item) => item.id === currentDeleteId
      );
      if (index !== -1) {
        countriesData.splice(index, 1);
        setToStorage(countriesData);
        renderCountry(countriesData, elCountryList);
        selectCountry(countriesData, elSelect);
      }
      currentDeleteId = null;
      deleteModal.classList.add("scale-0");
      hideLoading();
    }, 1000);
  }
});

cancelDelete.addEventListener("click", (e) => {
  e.preventDefault();
  currentDeleteId = null;
  deleteModal.classList.add("scale-0");
});

deleteModal.addEventListener("click", (e) => {
  if (e.target === deleteModal) {
    currentDeleteId = null;
    deleteModal.classList.add("scale-0");
  }
});

elSearchInput.addEventListener("input", (e) => {
  const val = e.target.value.toLowerCase();
  const filtered = countriesData.filter(
    (c) =>
      c.name.toLowerCase().includes(val) ||
      c.capital.toLowerCase().includes(val)
  );
  renderCountry(filtered, elCountryList);
});

function handleCreateBtnClick() {
  editId = null;
  currentCountry = null;
  elCreateForm.reset();
  modalTitle.textContent = "Create Country";
  const submitBtn = elCreateForm.querySelector('button[type="submit"]');
  submitBtn.textContent = "Create";
  elModalWrapper.classList.remove("scale-0");
}

elModalWrapper.addEventListener("click", (e) => {
  if (e.target === elModalWrapper) {
    elModalWrapper.classList.add("scale-0");
    editId = null;
    currentCountry = null;
    elCreateForm.reset();
  }
});

elCreateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  showLoading();

  setTimeout(() => {
    const data = {
      name: e.target.name.value.trim(),
      capital: e.target.capital.value.trim(),
      population: e.target.population.value.trim(),
      img: e.target.image.value.trim(),
      region: e.target.region.value.trim(),
      area: e.target.area.value.trim() || "Unknown",
      active: currentCountry ? currentCountry.active : false,
      saved: currentCountry ? currentCountry.saved : false,
    };

    if (editId) {
      const index = countriesData.findIndex((c) => c.id === editId);
      countriesData[index] = { ...countriesData[index], ...data };
      editId = null;
      currentCountry = null;
    } else {
      data.id =
        countriesData.length > 0
          ? Math.max(...countriesData.map((c) => c.id)) + 1
          : 1;
      countriesData.push(data);
    }

    setToStorage(countriesData);
    renderCountry(countriesData, elCountryList);
    selectCountry(countriesData, elSelect);
    elCreateForm.reset();
    elModalWrapper.classList.add("scale-0");
    hideLoading();
  }, 1000);
});

function handleOpenInfoModal(id) {
  const country = countriesData.find((i) => i.id === id);
  modalImg.src = country.img;
  modalName.textContent = country.name;
  modalPopulation.textContent = country.population;
  modalCapital.textContent = country.capital;
  modalRegion.textContent = country.region;
  modalArea.textContent = country.area || "Unknown";
  infoModal.classList.remove("scale-0");
}

document.getElementById("closeModal").onclick = () =>
  infoModal.classList.add("scale-0");
infoModal.onclick = (e) => {
  if (e.target === infoModal) infoModal.classList.add("scale-0");
};

function handleEdit(id) {
  editId = id;
  currentCountry = countriesData.find((c) => c.id === id);
  elCreateForm.name.value = currentCountry.name;
  elCreateForm.capital.value = currentCountry.capital;
  elCreateForm.population.value = currentCountry.population;
  elCreateForm.image.value = currentCountry.img;
  elCreateForm.region.value = currentCountry.region;
  elCreateForm.area.value = currentCountry.area;
  modalTitle.textContent = "Update Country";
  const submitBtn = elCreateForm.querySelector('button[type="submit"]');
  submitBtn.textContent = "Update";
  elModalWrapper.classList.remove("scale-0");
}

renderCountry(countriesData, elCountryList);
selectCountry(countriesData, elSelect);
