document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.getSelected(null, function (tab) {
    if(tab.url.indexOf('instagram') > -1){
      let request = new XMLHttpRequest();
      request.open('GET', tab.url, true);
      request.send(null);
      request.onreadystatechange = function() {
        if (request.readyState == 4){
          let domParser = new DOMParser();
          let docElement = domParser.parseFromString(request.responseText, 'text/html').documentElement;
          let metaTags = docElement.getElementsByTagName('meta');
          let media = getMedia(metaTags);
          if(media != 0){
            const type = media[0];
            document.getElementById('results').innerHTML = `one ${type} found`;
            document.getElementById('download-link').href = media[1];
            document.getElementById('download-link').innerHTML = 'download';
          }
          else{
            document.getElementById('results').innerHTML = 'no media found';
          }
        }
      };
    }
    else{
      document.getElementById('results').innerHTML = 'you are not currently on instagram';
    }
  });
}, false);

function getMedia(metaTags){
  for (let i=0; i<metaTags.length; i++) {
    if (metaTags[i].getAttribute('property') === 'og:video') {
      return ['video',metaTags[i].getAttribute('content')];
    }
  }
  for (let i=0; i<metaTags.length; i++) {
    if (metaTags[i].getAttribute('property') === 'og:image') {
      return ['image',metaTags[i].getAttribute('content')];
    }
  }
  return 0;
}
