// function getQuote(){
//     $.ajax({
//         url: 'https://quoteapi.pythonanywhere.com/random',
//         type: "GET",
//         success: function(data){
//             console.log(data);
//             $("#quote").text(data.quote);
//         },
//         error: function(xhr, status, error){
//             console.error('Error fetching quote:', error);
//         }

//     });
// }

// const apiUrl = 'https://quoteapi.pythonanywhere.com/quotes/';

//     fetch(apiUrl)
//         .then(response => response.json())
//         .then(data => console.log(data))
//         .catch(error => console.error('Error:', error));

// $(document).ready(function() {
//     getQuote();
// });

document.addEventListener("DOMContentLoaded", function() {

var carouselWidth = $(".carousel-inner.movie")[0].scrollWidth;
var cardWidth = $(".carousel-item.movie").width();
var scrollPosition = 0;

$(".carousel-control-next").on("click", function () {
    if (scrollPosition < (carouselWidth - cardWidth * 4)) { //check if you can go any further
      scrollPosition += cardWidth;  //update scroll position
      $(".carousel-inner.movie").animate({ scrollLeft: scrollPosition },600); //scroll left
    }
  });

  $(".carousel-control-prev").on("click", function () {
    if (scrollPosition > 0) {
      scrollPosition -= cardWidth;
      $(".carousel-inner.movie").animate(
        { scrollLeft: scrollPosition },
        600
      );
    }
  });

  var multipleCardCarousel = document.querySelector(
    "#carouselExampleControls"
  );
  if (window.matchMedia("(min-width: 768px)").matches) {
    var carousel = new bootstrap.Carousel(multipleCardCarousel, {
      interval: false,
      wrap: false,
    });
  } else {
    $(multipleCardCarousel).addClass("slide");
  }

});