const elCountryList = document.querySelector(".country-list");
const elSearchInput = document.querySelector(".search-input");
const elSelect = document.querySelector(".select-capitals");
const elLikeCount = document.querySelector(".like-count");
const elBasketCount = document.querySelector(".basket-count");
const elLikeBtn = document.querySelector(".like-btn");
const elBasketBtn = document.querySelector(".basket-btn");
const elModalWrapper = document.querySelector(".modal-wrapper");
const elCreateForm = document.querySelector(".create-form");

const infoModal = document.getElementById("infoModal");
const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalPopulation = document.getElementById("modalPopulation");
const modalCapital = document.getElementById("modalCapital");
const modalRegion = document.getElementById("modalRegion");
const modalArea = document.getElementById("modalArea");

let editId = null;
let currentCountry = null;

function renderCountry(arr, list) {
    list.innerHTML = "";

    arr.forEach(item => {
        const elItem = document.createElement("li");
        elItem.className = "bg-white w-[264px] rounded-md overflow-hidden";

        elItem.innerHTML = `
            <img class="h-[160px] w-full object-cover" src="${item.img}">
            <div class="p-6">
                <h2 class="font-bold text-[18px] mb-[16px]">${item.name}</h2>

                <ul class="flex flex-col gap-[8px]">
                    <li><b>Population:</b> ${item.population}</li>
                    <li><b>Capital:</b> ${item.capital}</li>
                </ul>

                <div class="country-wrapper flex items-center justify-between mt-5">
                    <button onclick="handleLikeBtnClick(${item.id})"
                        class="w-[40px] h-[40px] rounded-md border-2 border-black flex items-center justify-center
                        ${item.active ? "bg-red-500 text-white border-white" : ""}">
                        ❤️
                    </button>

                    <button onclick="handleBasketBtnClick(${item.id})"
                        class="w-[40px] h-[40px] rounded-md border-2 border-black flex items-center justify-center
                        ${item.saved ? "bg-blue-500 text-white border-white" : ""}">
                        🛒
                    </button>

                    <button onclick="handleOpenInfoModal(${item.id})"
                        class="w-[40px] h-[40px] rounded-md border-2 border-black flex items-center justify-center">
                        ℹ
                    </button>

                    <button onclick="handleEdit(${item.id})"
                        class="w-[40px] h-[40px] rounded-md border-2 border-black flex items-center justify-center">
                        ✏️
                    </button>

                    <button onclick="handleDelete(${item.id})"
                        class="w-[40px] h-[40px] rounded-md border-2 border-black flex items-center justify-center">
                        🗑
                    </button>
                </div>
            </div>
        `;

        list.appendChild(elItem);
    });

    elLikeCount.textContent = countries.filter(item => item.active).length;
    elBasketCount.textContent = countries.filter(item => item.saved).length;
}

function selectCountry(arr, list) {
    list.innerHTML = `<option value="all">All</option>`;
    const regions = arr.reduce((prev, curr) => {
        if (!prev.includes(curr.region)) prev.push(curr.region);
        return prev;
    }, []);

    regions.forEach(region => {
        const option = document.createElement("option");
        option.value = region.toLowerCase();
        option.textContent = region;
        list.appendChild(option);
    });
}

elSelect.addEventListener("change", (e) => {
    const selected = e.target.value;
    if (selected === "all") {
        renderCountry(countries, elCountryList);
    } else {
        const filtered = countries.filter(country => country.region.toLowerCase() === selected);
        renderCountry(filtered, elCountryList);
    }
});

function handleLikeBtnClick(id) {
    const item = countries.find(item => item.id === id);
    item.active = !item.active;
    renderCountry(countries, elCountryList);
}

elLikeBtn.addEventListener("click", () => {
    const liked = countries.filter(item => item.active);
    renderCountry(liked, elCountryList);
});

function handleBasketBtnClick(id) {
    const item = countries.find(item => item.id === id);
    item.saved = !item.saved;
    renderCountry(countries, elCountryList);
}

elBasketBtn.addEventListener("click", () => {
    const saved = countries.filter(item => item.saved);
    renderCountry(saved, elCountryList);
});

function handleDelete(id) {
    const index = countries.findIndex(item => item.id === id);
    if (index !== -1) {
        countries.splice(index, 1);
        renderCountry(countries, elCountryList);
    }
}

elSearchInput.addEventListener("input", e => {
    const val = e.target.value.toLowerCase();
    const filtered = countries.filter(c =>
        c.name.toLowerCase().includes(val) ||
        c.capital.toLowerCase().includes(val)
    );
    renderCountry(filtered, elCountryList);
});

function handleCreateBtnClick() {
    editId = null;
    currentCountry = null;
    elCreateForm.reset();
    const submitBtn = elCreateForm.querySelector('button');
    submitBtn.textContent = "Create";
    elModalWrapper.classList.remove("scale-0");
}

elModalWrapper.addEventListener("click", e => {
    if (e.target === elModalWrapper) {
        elModalWrapper.classList.add("scale-0");
        editId = null;
        currentCountry = null;
        elCreateForm.reset();
        const submitBtn = elCreateForm.querySelector('button');
        submitBtn.textContent = "Create";
    }
});

elCreateForm.addEventListener("submit", e => {
    e.preventDefault();
    
    const data = {
        name: e.target.name.value.trim() || (currentCountry ? currentCountry.name : ""),
        capital: e.target.capital.value.trim() || (currentCountry ? currentCountry.capital : ""),
        population: e.target.population.value.trim() || (currentCountry ? currentCountry.population : ""),
        img: e.target.image.value.trim() || (currentCountry ? currentCountry.img : ""),
        active: currentCountry ? currentCountry.active : false,
        saved: currentCountry ? currentCountry.saved : false
    };

    if (editId) {
        const index = countries.findIndex(c => c.id === editId);
        countries[index] = { ...countries[index], ...data };
        editId = null;
        currentCountry = null;
    } else {
        data.id = countries.length+1
        countries.push(data);
    }

    renderCountry(countries, elCountryList);
    elCreateForm.reset();
    elModalWrapper.classList.add("scale-0");
});

function handleOpenInfoModal(id) {
    const country = countries.find(i => i.id === id);
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

infoModal.onclick = e => {
    if (e.target === infoModal) infoModal.classList.add("scale-0");
};

function handleEdit(id) {
    editId = id;
    currentCountry = countries.find(c => c.id === id);
    elCreateForm.name.value = currentCountry.name;
    elCreateForm.capital.value = currentCountry.capital;
    elCreateForm.population.value = currentCountry.population;
    elCreateForm.image.value = currentCountry.img;
    const submitBtn = elCreateForm.querySelector('button');
    submitBtn.textContent = "Update";
    elModalWrapper.classList.remove("scale-0");
}

renderCountry(countries, elCountryList);
selectCountry(countries, elSelect);