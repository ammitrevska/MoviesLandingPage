$(document).ready(function () {
  var apikey = "a6592a8d";
  var genres = ["Sci-fi", "Action", "Comedy", "Romance", "Thriller"];

  // Function to fetch movies by genre
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
              <div class="img-wrapper">
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

  // Call fetchAllMovies function on document ready
  fetchAllMovies();
});

// Function to fetch movies by title
function getMoviesByTitle(title) {
  var apikey = "a6592a8d";
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
  $("#plotModalLabel").text(movie.Title);
  $("#plotModalPlot").text(movie.Plot);
  $("#date").text(movie.Year);
  $("#genre").text(movie.Genre);
  $("#plotModalPoster").attr("src", movie.Poster);
  $('#plotModal').modal('show');
}

$(document).ready(function(){
  // Attach click event listener to a static parent element
  $(".carousel").on("click", ".carousel-item.movie", function (){
    var movieTitle = $(this).find(".card-title").text();
    getMoviesByTitle(movieTitle);
  });
});