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
            document.getElementById('download-link').innerHTML = 'download';
            document.getElementById('download-link').addEventListener('click', function() {
              downloadResource(media[1]);
            }, false);
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

// cross origin download workaround solution from:
// https://stackoverflow.com/questions/49474775/chrome-65-blocks-cross-origin-a-download-client-side-workaround-to-force-down

function forceDownload(blob, filename) {
  var a = document.createElement('a');
  a.download = filename;
  a.href = blob;
  a.click();
}

// Current blob size limit is around 500MB for browsers
function downloadResource(url, filename) {
  if (!filename) filename = url.split('\\').pop().split('/').pop();
  fetch(url, {
    headers: new Headers({
      'Origin': location.origin
    }),
    mode: 'cors'
  })
      .then(response => response.blob())
      .then(blob => {
        let blobUrl = window.URL.createObjectURL(blob);
        forceDownload(blobUrl, filename);
      })
      .catch(e => console.error(e));
}
