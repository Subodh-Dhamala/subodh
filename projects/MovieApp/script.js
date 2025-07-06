const API_KEY = "api_key=ec332d19e6fed067df0160ce34067cc4";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}`;
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = `${BASE_URL}/search/movie?${API_KEY}`;
const LATEST_MOVIES_URL = `${BASE_URL}/discover/movie?sort_by=release_date.desc&${API_KEY}`;
const SERIES_URL = `${BASE_URL}/discover/tv?sort_by=popularity.desc&${API_KEY}`;
const TRENDING_URL = `${BASE_URL}/trending/all/week?${API_KEY}`;

const main = document.getElementById("main");
const form = document.getElementById("form");
const mobileSearchForm = document.getElementById("mobile-search-form");
const search = document.getElementById("search");
const mobileSearch = document.getElementById("mobile-search");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");
const overlayContent = document.getElementById("overlay-content");
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");
const toggle = document.querySelector(".toggle");
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuClose = document.querySelector(".mobile-menu-close");
const logo = document.querySelector(".logo");
const menuItems = document.querySelectorAll(".menu-list-item");
const mobileMenuItems = document.querySelectorAll(".mobile-menu-item");

let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = "";
let totalPages = 100;
let activeSlide = 0;
let totalVideos = 0;

window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  loader.style.display = "none";
  document.body.classList.add(localStorage.getItem("theme") || "dark-mode");
  getMovies(API_URL);
});

function getMovies(url) {
  lastUrl = url;
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      if (data.results && data.results.length > 0) {
        showMovies(data.results);
        updatePagination(data.page, data.total_pages);
      } else {
        main.innerHTML = `<h1 class="no-results text-center text-xl font-bold mt-8">No Results Found</h1>`;
      }
    })
    .catch((error) => {
      main.innerHTML = `<h1 class="no-results text-center text-xl font-bold mt-8">Error Loading Movies: ${error.message}</h1>`;
      console.error("Fetch error:", error);
    });
}

function showMovies(data) {
  main.innerHTML = "";
  data.forEach((movie) => {
    const title = movie.title || movie.name || "Untitled";
    const poster_path = movie.poster_path || movie.backdrop_path;
    const { vote_average, overview, id } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
      <img src="${poster_path ? IMAGE_URL + poster_path : "http://via.placeholder.com/1080x1580"}" alt="${title}" />
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getColor(vote_average)}">${vote_average || "N/A"}</span>
      </div>
      <div class="overview">
        <h3 class="font-bold mb-2">Overview</h3>
        ${overview || "No overview available."}
        <br/>
        <button class="know-more" id="${id}">Know More</button>
      </div>
    `;
    main.appendChild(movieEl);
    document.getElementById(id).addEventListener("click", () => openNav(movie));
  });
}

function getColor(vote) {
  if (!vote) return "gray";
  if (vote >= 8) return "green";
  if (vote >= 5) return "orange";
  return "red";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim();
  getMovies(searchTerm ? `${SEARCH_URL}&query=${searchTerm}` : API_URL);
  search.value = "";
});

mobileSearchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = mobileSearch.value.trim();
  getMovies(searchTerm ? `${SEARCH_URL}&query=${searchTerm}` : API_URL);
  mobileSearch.value = "";
  mobileMenu.classList.remove("active");
});

function updatePagination(currentPg, totalPg) {
  currentPage = currentPg;
  nextPage = currentPg + 1;
  prevPage = currentPg - 1;
  totalPages = totalPg;
  current.innerText = currentPage;
  prev.classList.toggle("disabled", currentPage <= 1);
  next.classList.toggle("disabled", currentPage >= totalPages);
}

prev.addEventListener("click", () => {
  if (prevPage > 0) pageCall(prevPage);
});

next.addEventListener("click", () => {
  if (nextPage <= totalPages) pageCall(nextPage);
});

function pageCall(page) {
  let urlSplit = lastUrl.split("?");
  let queryParams = urlSplit[1].split("&");
  let keyIndex = queryParams.findIndex((param) => param.startsWith("page="));

  if (keyIndex === -1) {
    queryParams.push(`page=${page}`);
  } else {
    queryParams[keyIndex] = `page=${page}`;
  }

  const newUrl = `${urlSplit[0]}?${queryParams.join("&")}`;
  getMovies(newUrl);
}

function openNav(movie) {
  const { id, title, name } = movie;
  const displayTitle = title || name || "Untitled";
  overlayContent.innerHTML = `<h1 class="no-results text-2xl font-bold">Loading trailer for ${displayTitle}...</h1>`;
  document.getElementById("myNav").style.width = "100%";

  const isSeries = lastUrl.includes("/tv");
  const videoUrl = `${BASE_URL}/${isSeries ? "tv" : "movie"}/${id}/videos?${API_KEY}`;

  fetch(videoUrl)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      if (data.results && data.results.length > 0) {
        const embeds = data.results
          .filter((video) => video.site === "YouTube" && video.key)
          .map((video, idx) => `
            <iframe width="100%" height="315" src="https://www.youtube.com/embed/${video.key}" title="${video.name}" class="embed ${idx === 0 ? "show" : "hide"}" frameborder="0" allowfullscreen></iframe>
          `);

        if (embeds.length > 0) {
          const dots = embeds.map((_, idx) => `<span class="dot ${idx === 0 ? "active" : ""}">${idx + 1}</span>`);
          overlayContent.innerHTML = `
            <h1 class="no-results text-2xl font-bold mb-4">${displayTitle}</h1>
            ${embeds.join("")}
            <div class="dots">${dots.join("")}</div>
          `;
          activeSlide = 0;
          totalVideos = embeds.length;
          showVideos();
        } else {
          overlayContent.innerHTML = `<h1 class="no-results text-2xl font-bold">No YouTube Trailers Available for ${displayTitle}</h1>`;
        }
      } else {
        overlayContent.innerHTML = `<h1 class="no-results text-2xl font-bold">No Trailers Available for ${displayTitle}</h1>`;
      }
    })
    .catch((error) => {
      overlayContent.innerHTML = `<h1 class="no-results text-2xl font-bold">Error Loading Trailer for ${displayTitle}: ${error.message}</h1>`;
      console.error("Fetch error:", error);
    });
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
  overlayContent.innerHTML = "";
  activeSlide = 0;
  totalVideos = 0;
}

function showVideos() {
  const embeds = document.querySelectorAll(".embed");
  const dots = document.querySelectorAll(".dot");

  embeds.forEach((el, idx) => {
    el.classList.toggle("show", idx === activeSlide);
    el.classList.toggle("hide", idx !== activeSlide);
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === activeSlide);
  });
}

leftArrow.addEventListener("click", () => {
  if (totalVideos > 0) {
    activeSlide = (activeSlide - 1 + totalVideos) % totalVideos;
    showVideos();
  }
});

rightArrow.addEventListener("click", () => {
  if (totalVideos > 0) {
    activeSlide = (activeSlide + 1) % totalVideos;
    showVideos();
  }
});

toggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light-mode" : "dark-mode");
});

mobileMenuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
});

mobileMenuClose.addEventListener("click", () => {
  mobileMenu.classList.remove("active");
});

logo.addEventListener("click", (e) => {
  e.preventDefault();
  updateActiveMenu("Home");
  getMovies(API_URL);
  currentPage = 1;
  mobileMenu.classList.remove("active");
});

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    const category = item.textContent;
    updateActiveMenu(category);
    currentPage = 1;
    switch (category) {
      case "Home":
        getMovies(API_URL);
        break;
      case "Movies":
        getMovies(LATEST_MOVIES_URL);
        break;
      case "Series":
        getMovies(SERIES_URL);
        break;
      case "Popular":
        getMovies(API_URL);
        break;
      case "Trends":
        getMovies(TRENDING_URL);
        break;
    }
  });
});

mobileMenuItems.forEach((item) => {
  item.addEventListener("click", () => {
    const category = item.getAttribute("data-category");
    updateActiveMenu(category);
    currentPage = 1;
    switch (category) {
      case "Home":
        getMovies(API_URL);
        break;
      case "Movies":
        getMovies(LATEST_MOVIES_URL);
        break;
      case "Series":
        getMovies(SERIES_URL);
        break;
      case "Popular":
        getMovies(API_URL);
        break;
      case "Trends":
        getMovies(TRENDING_URL);
        break;
      default:
        main.innerHTML = `<h1 class="no-results text-center text-xl font-bold mt-8">${category} - Coming Soon</h1>`;
    }
    mobileMenu.classList.remove("active");
  });
});

function updateActiveMenu(category) {
  menuItems.forEach((item) => {
    item.classList.toggle("active", item.textContent === category);
  });
  mobileMenuItems.forEach((item) => {
    item.classList.toggle("active", item.getAttribute("data-category") === category);
  });
}