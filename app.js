$(document).ready(function() {

  const searchBox   = $('#searchBar');    // Input field
  const searchList  = $('.search-list');  // List from 10 result
  const wikiSubmit  = $('#wikiSubmit');   // Submit Form

  // Clear results in searchList
  let clearList = () => { searchList.html('') };

  // Get input value from search bar
  wikiSubmit.on('submit', function(e) {
    e.preventDefault();
    clearList();

    let searchVal = searchBox.val();

    setTimeout(function() {
      getWikiAPI(searchVal)
    }, 1000);

    // Reset animation
    if (searchList.hasClass('open')) {
      searchList.removeClass('slide-up').removeClass('open');
    }
    // Move search box to the top
    $(this).addClass('move-to-top');
  });

  // Search in Wiki API after submitting
  function getWikiAPI(searchVal) {
    $.ajax({
      url: 'https://en.wikipedia.org/w/api.php',
      data: {
        action: 'query',
        prop: 'extracts',
        generator: 'search',
        exsentences: 1,
        exintro: 1,
        explaintext: 1,
        gsrsearch: searchVal,
        gsrnamespace: 0,
        gsrlimit: 10,
        format: 'json',
        formatversion: 2
      },
      dataType: 'jsonp',
      success: function(data) {
        if (typeof data.query === 'undefined') {
          // If search result can not be found
          checkResult(false);
          // Clear previous results
          searchList.html('');
        } else {
          // If search result can be found
          checkResult(true);

          let result = [];

          data.query.pages.forEach(element => result.push(element));

          let html = '';

          result.forEach(element => {
            let id =  element.pageid;
            let title = element.title;
            let des = element.extract;
            let go_to_url = `https://en.wikipedia.org/?curid=${id}`;
            html += `<a href="${go_to_url}" target="blank" class="list-group-item list-group-item-action">`;
            html += `<div class="row list-title"><h1>${title}</h1></div>`;
            html += `<div class="row list-des">${des}</div>`;
            html += `</a>`;
            searchList.html(html);
          });
        }
        // Add animation
        searchList.addClass('slide-up');
        // Reset animation
        setTimeout(function() {
          searchList.addClass('open');
          searchList.removeClass('slide-up');
        }, 200);
      },
      error: function() {
        alert('an error.');
      }
    });
  }


  // Show message if no result found
  var checkResult = (Boolean) => Boolean ?
  ($('.message').css('display', 'none')) : ($('.message').css('display', 'block'));


  getRandomWiki();
  $('.wiki-random').click(() => getRandomWiki());

  // Generate random article
  function getRandomWiki() {
    $.ajax({
      url: 'https://en.wikipedia.org/w/api.php',
      data: {
        action: 'query',
        generator: 'random',
        grnnamespace: 0,
        grnlimit: 1,
        format: 'json'
      },
      dataType: 'jsonp',
      success: function(data) {
        let result = [];
        for (let element in data.query.pages) {
          result.push(element);
        }
        let pageID = result[0];
        let go_to_url = `https://en.wikipedia.org/?curid=${pageID}`;
        $('.wiki-random').attr('href', go_to_url);
      }
    });
  }


  // Animate search box
  const iconLine      = $('.line');
  const closeBtn      = $('.close-icon');
  const intro         = $('.intro');
  const ranomArticle  = $('.random-article');

  searchBox.focus(function() {
    searchBox.addClass('in');
    iconLine.css('display', 'none');
    intro.css('display', 'none');
    ranomArticle.addClass('move-to-right');

    setTimeout(function(){
      closeBtn.css('display', 'block');
      searchBox.addClass('open').removeClass('in');
    }, 200);
  });

  // Close button
  closeBtn.click(function() {
    searchBox.addClass('close');
    checkResult(true);

    setTimeout(function(){
      searchBox.removeClass('open').removeClass('close');
      iconLine.css('display', 'block');
      closeBtn.css('display', 'none');
      intro.css('display', 'block');
      ranomArticle.removeClass('move-to-right');
    }, 200);
    // Clear input value
    searchBox.val('');
    wikiSubmit.removeClass('move-to-top');
    clearList();
  });

});
