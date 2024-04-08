$(document).ready(function () {
  $(".carousel-control-next").on("click", function () {
    var carouselWidth = $(this).closest('.carousel').find(".carousel-inner")[0].scrollWidth;
    var cardWidth = $(this).closest('.carousel').find(".carousel-item").width();
    var scrollPosition = $(this).closest('.carousel').find(".carousel-inner").scrollLeft();

    var scrollThreshold = carouselWidth - cardWidth * 4;

    if (scrollPosition < scrollThreshold) {
      scrollPosition += cardWidth;
      $(this).closest('.carousel').find(".carousel-inner").animate({ scrollLeft: scrollPosition }, 600);
    }
  });

  $(".carousel-control-prev").on("click", function () {
    var cardWidth = $(this).closest('.carousel').find(".carousel-item").width();
    var scrollPosition = $(this).closest('.carousel').find(".carousel-inner").scrollLeft();

    if (scrollPosition > 0) {
      scrollPosition -= cardWidth;
      $(this).closest('.carousel').find(".carousel-inner").animate({ scrollLeft: scrollPosition }, 600);
    }
  });


  // Function to fetch movies by genre and displaying them

  var apikey = "ab7b1b1b";
  var genres = ["Sci-fi", "Action", "Comedy", "Fantasy", "Thriller"];

  function getMoviesByGenre(genre) {
    $.ajax({
      url: "http://omdbapi.com/?s=" + genre + "&apikey=" + apikey + "&type=movie",
      dataType: "json",
      success: function (data) {
        if (data.Response == "True") {
          var movies = data.Search;
          displayMovies(genre, movies);
        } else {
          console.log("Movies fetched for genre " + genre + " in year " + year);
        }
      },
      error: function (xhr, status, error) {
        console.log("Error fetching movies for genre: " + genre);
      }
    });
  }

  // Function to display movies in carousel
  function displayMovies(genre, movies) {
    var container = $("#" + genre.toLowerCase() + "-section");
    var carouselInner = container.find(".carousel-inner.movie");

    carouselInner.empty();

    movies.forEach(function (movie, index) {
      if (movie.Poster !== "N/A") {
        var movieHtml = `
            <div class="carousel-item movie">
              <div class="card bg-dark">
                <div class="img-wrapper d-flex justify-content-center align-items-center">
                  <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" class="d-block w-100 movie-img" alt="${movie.Title}">
                </div>
                <div class="card-body text-center">
                  <h5 class="card-title">${movie.Title}</h5>
                </div>
              </div>
            </div>
          `;
        carouselInner.append(movieHtml);
      }
    });

    container.find('.carousel-inner.movie').parent('.carousel').each(function () {
      var carousel = new bootstrap.Carousel(this, {
        interval: false,
        wrap: false,
      });
    });
  }

  // Function to fetch movies for all genres
  function fetchAllMovies() {
    genres.forEach(function (genre) {
      getMoviesByGenre(genre);
    });
  }

  fetchAllMovies();

});


// Function to fetch movies by title
$(document).ready(function () {

  function getMoviesByTitle(title) {
    var apikey = "ab7b1b1b";
    $.ajax({
      url: "http://omdbapi.com/?t=" + title + "&apikey=" + apikey + "&plot=short",
      dataType: "json",
      success: function (data) {
        if (data.Response == "True") {
          populateModal(data);
        } else {
          console.error("Error fetching movie details for title: " + title);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching movie details for title: " + title);
      }
    });
  }

  function populateModal(movie) {
    console.log(movie);
    $("#plotModalLabel").text(movie.Title);
    $("#plotModalPlot").text(movie.Plot);
    $("#date").text(movie.Year);
    $("#genre").text(movie.Genre);
    $("#plotModalPoster").attr("src", movie.Poster);
    $('#plotModal').modal('show');
  }

  $(".carousel").on("click", ".carousel-item.movie", function () {
    var movieTitle = $(this).find(".card-title").text();
    getMoviesByTitle(movieTitle);
  });
});


// Functions for populating the most watched carousel
$(document).ready(function () {
  var mostWatchedMovies = [
    { title: "Avatar", imgUrl: "assets/avatar-twow-videobg02_fae5d62e.jpeg" },
    { title: "Anyone But You", imgUrl: "assets/anyone but you.jpg" },
    { title: "Ice Age", imgUrl: "assets/wp2846726.jpg" },
    { title: "Ocean's 8", imgUrl: "assets/oceans8.jpg" },
    { title: "Oppenheimer", imgUrl: "assets/1323605.jpeg" }
  ];

 
  // Function to populate the most watched carousel
  async function populateMostWatchedCarousel() {
    var carouselInner = $(".hero .carousel-inner"); 
    carouselInner.empty();

    try {
      for (const movie of mostWatchedMovies) {
        const data = await getMovieDetailsByTitle(movie.title);
        const plot = data.Plot;
        const genre = data.Genre;
        const year = data.Year;

        var carouselItem = `
                <div class="carousel-item">
                    <img src="${movie.imgUrl}" class="d-block w-100" alt="${movie.title}">
                    <div class="carousel-caption d-flex align-items-start flex-column mb-3 text-start">
                        <div class="row">
                            <div class="col-auto">
                                <i class="bi bi-play-circle" style="font-size: 4rem;"></i>
                            </div>
                            <div class="col">
                                <h5>${movie.title}</h5>
                                <div class="my-2">
                                    <span class="card-text fst-italic" id="mostWatchedDate"><small class="text-muted">${year}</small></span> |
                                    <span class="card-text fst-italic" id="mostWatchedGenre"><small class="text-muted">${genre}</small></span>
                                </div>
                                <p class="text-break" id="mostWatchedPlot">${plot}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        carouselInner.append(carouselItem);
      }
      carouselInner.find(".carousel-item").first().addClass("active");
    } catch (error) {
      console.error("Error populating carousel:", error);
    }
  }

  $(document).ready(function () {
    populateMostWatchedCarousel();
  });

  function getMovieDetailsByTitle(title) {
    var apikey = "ab7b1b1b";

    return new Promise(function (resolve, reject) {
      $.ajax({
        url: "http://omdbapi.com/?t=" + title + "&apikey=" + apikey + "&plot=short",
        dataType: "json",
        success: function (data) {
          console.log("Success response for title: " + title, data);
          if (data.Response == "True") {
            resolve(data);
          } else {
            reject("Movie details not found for title: " + title);
          }
        },
        error: function (xhr, status, error) {
          console.error("Error fetching movie details for title: " + title, error);
          reject("Error fetching movie details for title: " + title);
        }
      });
    });
  }

});



// Open the modal to add a movie
$(document).ready(function () {

  // Function to validate Title
  function validateTitle(title) {
    if (title.trim() === "") {
      alert('Please enter a title.');
      return false;
    }
    return true;
  }

  // Function to validate date
  function validateDate(date) {
    if (date.trim() === "") {
      alert('Please enter a release date.');
      return false;
    }
    // Add more sophisticated date validation logic if needed
    return true;
  }

  // Function to validate description
  function validateDescription(description) {
    if (description.trim() === "") {
      alert('Please enter a description.');
      return false;
    }
    return true;
  }


  $('#addMovieForm').submit(function (event) {
    event.preventDefault(); 

    var title = $('#movieTitle').val();
    var releaseDate = $('#releaseDate').val();
    var description = $('#description').val();

    if (!validateTitle(title) || !validateDate(releaseDate) || !validateDescription(description)) {
      return;
    }

    var existingMovie = $(`#addedMoviesCarousel .carousel-inner .added-movie[data-title="${title}"]`);


    if (existingMovie.length > 0) {
      existingMovie.find('.release-date').text(`Release Date: ${releaseDate}`);
      existingMovie.find('.description').text(`Description: ${description}`);
    } else {
      var movieCardHtml = `
          <div class="carousel-item added-movie d-flex align-items-stretch me-0" data-title="${title}">
              <div class="card bg-dark mb-5 mt-3">
                  <div class="card-body text-center">
                      <h5 class="card-title">${title}</h5>
                      <p class="card-text release-date">Release Date: ${releaseDate}</p>
                      <p class="card-text description">Description: ${description}</p>
                  </div>
              </div>
          </div>
      `;

    $('#addedMoviesCarousel .carousel-inner').append(movieCardHtml);
    }

    $('#addedMoviesSection').show();
    
    $('#addMovieModal').modal('hide');

    $('#movieTitle').val('');
    $('#releaseDate').val('');
    $('#description').val('');
  });

});

$(document).ready(function () {

  $("#addMovieBtn").on("click", function () {
    $("#addMovieModal").modal("show");
  });
});



