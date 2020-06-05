const IMG_URL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2";
const SERVER = "https://api.themoviedb.org/3";
const API_KEY = "51f6a544d8e1ce8c0ccbeaccfeea1d97";
// Example API Request
// https://api.themoviedb.org/3/movie/550?api_key=51f6a544d8e1ce8c0ccbeaccfeea1d97

// API Read Access Token (v4 auth)
// eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MWY2YTU0NGQ4ZTFjZThjMGNjYmVhY2NmZWVhMWQ5NyIsInN1YiI6IjVlZDEzMmRjZTRiNTc2MDAxZjJmZDQ1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.86LIgLu2feJWR2PbtHpIzbuuzNIiz0ZGqN85YgxNoaE

// menu
const leftmenu = document.querySelector(".left-menu");
const hamburger = document.querySelector(".hamburger");
const tvShowsList = document.querySelector(".tv-shows__list");
const modal = document.querySelector(".modal");
const tvShows = document.querySelector(".tv-shows");
const tvCardImg = document.querySelector(".tv-card__img");
const modalTitle = document.querySelector(".modal__title");
const genresList = document.querySelector(".genres-list");
const rating = document.querySelector(".rating");
const description = document.querySelector(".description");
const modalLink = document.querySelector(".modal__link");
const searchForm = document.querySelector(".search__form");
const searchFormInput = document.querySelector(".search__form-input");
const preloader = document.querySelector(".preloader");
const dropdown = document.querySelectorAll(".dropdown");
const posterWrapper = document.querySelector(".poster__wrapper");
const modalContent = document.querySelector(".modal__content");
const tvShowsHead = document.querySelector(".tv-shows__head");
const pagination = document.querySelector(".pagination");
const trailer = document.getElementById("trailer");
const headTrailer = document.getElementById("headTrailer");

const loading = document.createElement("div");
loading.className = "loading";

const DBService = class {
  getData = async (url) => {
    tvShowsList.append(loading);
    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Не вдалося отримати дані за адресою ${url}`);
    }
  };

  getTestData = async () => {
    return this.getData("test.json");
  };

  getTestCard = () => {
    return this.getData("card.json");
  };

  getSearchResult = (query) => {
    this.temp =
      SERVER +
      "/search/tv?api_key=" +
      API_KEY +
      "&language=ru-RU&query=" +
      query;

    return this.getData(this.temp);
  };

  getNextPage = (page) => {
    return this.getData(this.temp + "&page=" + page);
  };

  getTvShow = (id) => {
    return this.getData(
      SERVER + "/tv/" + id + "?api_key=" + API_KEY + "&language=ru-RU"
    );
  };

  getTopRated = () =>
    this.getData(
      SERVER + "/tv/top_rated?api_key=" + API_KEY + "&language=en-US&page=1"
    );

  getPopular = () =>
    this.getData(
      SERVER + "/tv/popular?api_key=" + API_KEY + "&language=en-US&page=1"
    );

  getWeek = () =>
    this.getData(
      SERVER + "/tv/on_the_air?api_key=" + API_KEY + "&language=en-US&page=1"
    );

  getToday = () =>
    this.getData(
      SERVER + "/tv/airing_today?api_key=" + API_KEY + "&language=en-US&page=1"
    );

  getVideo = (id) => {
    return this.getData(
      SERVER + "/tv/" + id + "/videos?api_key=" + API_KEY + "&language=ru-RU"
    );
  };
};

const dbService = new DBService();

//console.log(new DBService().getSearchResult('Папа'));

const renderCard = (response, target) => {
  //console.log(response);
  tvShowsList.textContent = "";

  if (response.results.length == 0) {
    loading.remove();
    tvShowsHead.textContent = "Нажаль за Вашим запитом нічого не знайдено...";
    tvShowsHead.style.color = "red";
    return;
  }

  tvShowsHead.textContent = target ? target.textContent : "Результат пошуку";
  tvShowsHead.style.color = "green";

  response.results.forEach((item) => {
    const {
      backdrop_path: backdrop,
      name: title,
      poster_path: poster,
      vote_average: vote,
      id,
    } = item;

    const posterIMG = poster ? IMG_URL + poster : "img/no-poster.jpg";
    const backdropIMG = backdrop ? IMG_URL + backdrop : "img/no-poster.jpg";

    const voteElem = vote;
    const span = document.querySelector("span");
    //const voteElem = vote != 0 ? vote : `${() => {tvCardVote.classList.add("hide")}}`;

    const card = document.createElement("li");
    card.idTV = id;
    card.classList.add("tv-shows__item");

    if (vote != 0) {
      card.innerHTML = `
            <a href="#" id="${id}" class="tv-card">
            <span class="tv-card__vote">${voteElem}</span>
                <img
                  class="tv-card__img"
                  src="${posterIMG}"
                  data-backdrop="${backdropIMG}"
                  alt="${title}"
                />
                <h4 class="tv-card__head">${title}</h4>
            </a>
    `;
    } else {
      card.innerHTML = `
            <a href="#" class="tv-card">
            
                <img
                  class="tv-card__img"
                  src="${posterIMG}"
                  data-backdrop="${backdropIMG}"
                  alt="${title}"
                />
                <h4 class="tv-card__head">${title}</h4>
            </a>
    `;
    }

    loading.remove();
    tvShowsList.append(card); // append
  });

  pagination.textContent = "";
  if (!target && response.total_pages > 1) {
    for (let i = 1; i <= response.total_pages; i++) {
      pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`;
    }
  }
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = searchFormInput.value.trim();
  searchFormInput.value = "";

  if (value) {
    dbService.getSearchResult(value).then(renderCard);
  }
});

// {
//   tvShowsList.append(loading);
//   new DBService().getTestData().then(renderCard);
// }

// open/close menu

const closeDropdown = () => {
  dropdown.forEach((item) => {
    item.classList.remove("active");
  });
};

hamburger.addEventListener("click", () => {
  leftmenu.classList.toggle("openMenu");
  hamburger.classList.toggle("open");
  closeDropdown();
});

// закрываем меню, коли кликаем мимо
document.addEventListener("click", (event) => {
  if (!event.target.closest(".left-menu")) {
    leftmenu.classList.remove("openMenu");
    hamburger.classList.remove("open");
    closeDropdown();
  }
});

leftmenu.addEventListener("click", (event) => {
  event.preventDefault();
  const target = event.target;
  const dropdown = target.closest(".dropdown");
  if (dropdown) {
    dropdown.classList.toggle("active");
    leftmenu.classList.add("openMenu");
    hamburger.classList.add("open");
  }

  if (target.closest("#top-rated")) {
    dbService.getTopRated().then((response) => renderCard(response, target));
  }

  if (target.closest("#popular")) {
    dbService.getPopular().then((response) => renderCard(response, target));
  }

  if (target.closest("#today")) {
    dbService.getToday().then((response) => renderCard(response, target));
  }

  if (target.closest("#week")) {
    dbService.getWeek().then((response) => renderCard(response, target));
  }

  if (target.closest("#search")) {
    tvShowsList.textContent = "";
    tvShowsHead.textContent = "";
  }
});

// opening of modal window

tvShowsList.addEventListener("click", (event) => {
  event.preventDefault();
  const target = event.target;
  const card = target.closest(".tv-card");
  if (card) {
    preloader.style.display = "block";

    dbService
      .getTvShow(card.id) /* //getTestCard() */
      .then(
        ({
          id,
          poster_path: posterPath,
          name: title,
          genres,
          vote_average: voteAverage,
          overview,
          homepage,
        }) => {
          if (posterPath) {
            tvCardImg.src = IMG_URL + posterPath;
            tvCardImg.alt = title;
            posterWrapper.style.display = "";
            modalContent.style.paddingLeft = "";
          } else {
            posterWrapper.style.display = "none";
            modalContent.style.paddingLeft = "25px";
          }

          modalTitle.textContent += title;

          genresList.textContent = "";

          for (const item of genres) {
            genresList.innerHTML += `<li>${item.name}</li>`;
          }

          rating.innerHTML = voteAverage;
          description.innerHTML = overview;
          modalLink.href = homepage;
          return id;
        }
      )
      .then(dbService.getVideo)
      .then((response) => {
        headTrailer.classList.add("hide");
        trailer.textContent = "";
        if (response.results.length) {
          headTrailer.classList.remove("hide");
          response.results.forEach((item) => {
            const trailerItem = document.createElement("li");

            trailerItem.innerHTML = `
            <iframe width="400" 
                height="300" 
                src="https://www.youtube.com/embed/${item.key}" 
                frameborder="0" 
                allowfullscreen>
            </iframe>
            <h4>${item.name}</h4>
            `;

            trailer.append(trailerItem); // 08:39
          });
        }
      })
      .then(() => {
        document.body.style.overflow = "hidden";
        modal.classList.remove("hide");
      })
      .finally(() => {
        preloader.style.display = "none";
      });
  }
});

// close modal window
modal.addEventListener("click", (event) => {
  const target = event.target.closest(".cross");
  if (target) {
    document.body.style.overflow = "";
    modal.classList.add("hide");
  }
  loading.remove();
});

// change of a card
const changeImage = (event) => {
  const card = event.target.closest(".tv-shows__item");

  if (card) {
    const img = card.querySelector(".tv-card__img");
    const changeImg = img.dataset.backdrop;
    if (changeImg) {
      img.dataset.backdrop = img.src;
      img.src = changeImg;
    }
  }
};

tvShowsList.addEventListener("mouseover", changeImage);
tvShowsList.addEventListener("mouseout", changeImage);

pagination.addEventListener("click", (event) => {
  event.preventDefault();
  const target = event.target;
  if (target.classList.contains("pages")) {
    tvShows.append(loading);
    dbService.getNextPage(target.textContent).then(renderCard);
  }
});
