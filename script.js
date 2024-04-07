
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

  var currentYear = new Date().getFullYear();

  var genres = ["Sci-fi", "Action", "Comedy", "Romance", "Thriller"];
  var apikey = "a6592a8d";
  var moviesByGenre = {}
  
  // Function to fetch movies by genre
  function getMoviesByGenre(genre) {
      $.ajax({
        url: "http://omdbapi.com/?s=" + genre + "&apikey=" + apikey + "&type=movie",
          dataType: "json",
          success: function (data) {
              if (data.Response == "True") {
                  var movies = data.Search;
                  moviesByGenre[genre] = movies;


                  console.log(data)
                  console.log(moviesByGenre)

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
