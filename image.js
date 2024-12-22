const accessKey = "jF4gHznhVLLhVrUTTQ5DqEdKaYA4TY1j-GI3RoHhxIQ";

const formEl = document.querySelector("form");
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.querySelector(".search-results");
const paginationEl = document.getElementById("pagination");
const showMoreButtonEl = document.getElementById("show-more-button");

let inputData = "";
let page = 1;

async function searchImages() {
  inputData = searchInputEl.value;
  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (page === 1) {
    searchResultsEl.innerHTML = "";
  }

  const results = data.results;

  results.forEach((result) => {
    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("search-result");

    const image = document.createElement("img");
    image.src = result.urls.small;
    image.alt = result.alt_description;

    const imageLink = document.createElement("a");
    imageLink.href = result.links.html;
    imageLink.target = "_blank";
    imageLink.textContent = result.alt_description || "View on Unsplash";
    imageWrapper.appendChild(image);
    imageWrapper.appendChild(imageLink);
    searchResultsEl.appendChild(imageWrapper);
  });

  updatePagination(data.total_pages);

  if (page < data.total_pages) {
    showMoreButtonEl.style.display = "block";
  } else {
    showMoreButtonEl.style.display = "none";
  }
}

function updatePagination(totalPages) {
  paginationEl.innerHTML = ""; // Clear existing pagination

  const paginationWrapper = document.createElement("div");
  paginationWrapper.classList.add("pagination-wrapper");

  // Generate page numbers with range logic
  const maxPagesToShow = 5; // Adjust the range of visible page numbers
  const startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.classList.add("page-button");
    if (i === page) {
      pageButton.classList.add("active");
    }
    pageButton.addEventListener("click", () => {
      page = i;
      searchImages();
    });
    paginationWrapper.appendChild(pageButton);
  }

  paginationEl.appendChild(paginationWrapper);
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  page = 1;
  searchImages();
});

showMoreButtonEl.addEventListener("click", () => {
  page++;
  searchImages();
});

function logout() {
  const userConfirmed = confirm("Are you sure you want to logout?");
  if (userConfirmed) {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  } else {
    console.log("Logout canceled by the user.");
  }
}

