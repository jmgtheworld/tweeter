$(document).ready(function() {
  $("#tweet-text").on("keyup change input", function() {
    // update counter 
    let counter = $(this).parent().children(".tweetAndcount").children(".counter")
    counter.text(140 - $(this).val().length); 
    // make counter red if count goes below 0  
    if ((counter.val()) < 0) {
      counter.addClass("error");
    }
    if ((counter.val()) > 0) {
      counter.removeClass("error");
    }
  }); 
});

