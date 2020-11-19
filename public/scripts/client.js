/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Fake data taken from initial-tweets.json
// const data = [
//   {
//     "user": {
//       "name": "Dwight Schrute",
//       "avatars": "../images/Dwight-Shrute.png",
//       "handle": "@BeetFarmer"
//     },
//     "content": {
//       "text": "I am the regional manager!"
//     },
//     "created_at": 1461116232227
//   },
//   {
//     "user": {
//       "name": "Stanley Hudson",
//       "avatars": "../images/stanley.jpg",
//       "handle": "@PretzelDay " },
//     "content": {
//       "text": "Did I stutter?"
//     },
//     "created_at": 1461113959088
//   },
//   {
//     "user": {
//       "name": "Michael Scott",
//       "avatars": "../images/michael.jpg",
//       "handle": "@littleKidLover" },
//     "content": {
//       "text": "That's what she said!"
//     },
//     "created_at": 1445674679000
//   }
// ]


$(document).ready(() => {
  const renderTweets = function(tweets) {
    // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
        for (let tweet of tweets) {
          $("#allTweets").prepend($(createTweetElement(tweet)).hide().fadeIn(300));
        }
    }
    
    const createTweetElement = function(tweet) {
      const today = Date.now();
      const postDate = tweet.created_at;
      const daysAgo = Math.round(Math.floor(today-postDate) / (1000 * 60 * 60 * 24));
      const $tweet = `
        <article class = "tweetContainer">
          <header class = "tweetHeader">
            <div class = "userInfo">
            <img src = ${tweet.user.avatars}> 
            <h4 class = "userName"> ${tweet.user.name} </h4> 
            </div>
            <h5 class = "userID"> ${tweet.user.handle} </h5>
          </header>
          <p class="tweetContent"> ${escape(tweet.content.text)} </p>
          <footer class = "tweetFooter">
            <h6 class = "footerDate"> ${daysAgo} days ago</h6> 
            <div class = "footerImages">
              <i class="fas fa-flag"></i>
              <i class="fas fa-retweet"></i>
              <i class="fas fa-heart"></i>
            </div>
          </footer>
        </article>
        `;

      return $tweet;
    }


    const escape =  function(str) {
      let div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }
  
  $('form').on('submit', event => {
    event.preventDefault();

    const input = escape($('form textarea').val());

    if (input === "" || input === null) {
      message = "Message shouldn't be empty!";
      document.getElementById("error-message").innerHTML = message;
      $(".validation-error").slideDown(200);
    } 
    if (input.length > 140) {
      message = "Too long. Please keep your tweet to 140 Characters!";
      document.getElementById("error-message").innerHTML = message;
      $(".validation-error").slideDown(200);
    } else {
      $.ajax({
        url: "/tweets",
        method: "POST",
        data: $('form').serialize()
      })
      .then(res => {
        loadTweets();
        $('.validation-error').css("display", "none");
        $('#tweet-text').val("");
        $('.counter').val("140");
      })
    }
  });

  $('.newTweet').on('click', event => {
    $('.form').toggle();
    $('#tweet-text').focus();
  });

  // when user scroll downs 30px from the top, show the button
  let mybutton = document.getElementById("movetoTop");
  window.onscroll = function() {scrollFunction()};
  function scrollFunction() {
    if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  }

  // Scroll to top of page when button is clicked
  $('#movetoTop').on('click', event => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    $('.form').slideDown();
    $('#tweet-text').focus();
  });

  const loadTweets = () => {
    $.ajax({
      url: "/tweets",
      method: "GET",
    })
    .then(res => {
      $('#allTweets').empty()
      renderTweets(res);
    })
    .catch(err => console.log(err))
    .always(() => console.log("Finished loading"))
  }

  loadTweets();

});





