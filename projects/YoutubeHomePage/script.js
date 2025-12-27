const searchInput = document.querySelector('.searchbox input');
const searchBtn = document.querySelector('.searchBtn');


searchBtn.addEventListener('click', function () {
  searchYouTube();
});


searchInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    searchYouTube();
  }
});

function searchYouTube() {
  const query = searchInput.value.trim();

  if (query.length > 0) {
    const url =
      'https://www.youtube.com/results?search_query=' +
      encodeURIComponent(query);

    window.open(url, '_blank');
  }
}
