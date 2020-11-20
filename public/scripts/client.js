$(document).ready( () => {

  const renderTweets = tweets => {
    // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
    for (let tweet of tweets) {
      $("#allTweets").prepend($(createTweetElement(tweet)).hide().fadeIn(300));
    }
  }

  const escape = str => {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  const createTweetElement = tweet => {
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


  $('form').on('submit', event => {
    event.preventDefault();

    const input = escape($('form textarea').val());
    if (input === "" || input === null) {
      message = "Message shouldn't be empty!";
      document.getElementById("error-message").innerHTML = message;
      $(".validation-error").slideDown(300);
    } 
    if (input.length > 140) {
      message = "Too long. Please keep your tweet to 140 Characters!";
      document.getElementById("error-message").innerHTML = message;
      $(".validation-error").slideDown(300);
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
  const scrollFunction = () => {
    if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  }
  window.onscroll = () => { 
    scrollFunction(); 
  };

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





