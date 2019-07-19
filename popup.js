document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.getSelected(null, function (tab) {
    console.log(tab);
    if(tab.url.indexOf('instagram') > -1){
      if(tab.url.indexOf('/p/') > -1){
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
              document.getElementById('results').innerHTML = `one ${media.type} found`;
              document.getElementById('download-link').innerHTML = 'download';
              let filename = media.url.split('\\').pop().split('/').pop()
                .split(media.type == 'image' ? '.jpg' : '.mp4')[0]
                +(media.type == 'image' ? '.jpg' : '.mp4');
              let url = media.url.split(media.type == 'image' ? '.jpg' : '.mp4')[0];
              downloadResource(media.url, filename);
            }
            else{
              document.getElementById('results').innerHTML = 'no media found';
            }
          }
        };
      } else if(tab.url.indexOf('/stories/') > -1){
        document.getElementById('results').innerHTML = 'The stories should be downloading automatically';
      } else {
        document.getElementById('results').innerHTML = 'Please navigate to a specific post or a story';
      }
    }
    else{
      document.getElementById('results').innerHTML = 'you are not currently on instagram';
    }
  });
}, false);

function getMedia(metaTags){
  for (let i=0; i<metaTags.length; i++) {
    if (metaTags[i].getAttribute('property') === 'og:video') {
      return {type: 'video', url: metaTags[i].getAttribute('content')};
    }
  }
  for (let i=0; i<metaTags.length; i++) {
    if (metaTags[i].getAttribute('property') === 'og:image') {
      return {type: 'image', url: metaTags[i].getAttribute('content')};
    }
  }
  return 0;
}

// cross origin download workaround modified from:
// https://stackoverflow.com/questions/49474775/chrome-65-blocks-cross-origin-a-download-client-side-workaround-to-force-down
function forceDownload(blob, filename) {
  document.getElementById('download-link').download = filename;
  document.getElementById('download-link').href = blob;
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