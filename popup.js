document.addEventListener('DOMContentLoaded', function() {
  let videos = [];
  // document.getElementById('download-link').innerHTML = 'no media found';
  chrome.tabs.executeScript(tabs[tab].id, {
    "code": "document.getElementsByTagName('video')"
}, function (result) {
    videos = result;
    console.log(result);
});
  let metaTags = []
  chrome.tabs.executeScript(tabs[tab].id, {
    "code": "document.getElementsByTagName('meta')"
}, function (result) {
    metaTags = result;
    console.log(result);
});

  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {

    const media = getMedia(videos, metaTags);
    if(media != 0){
      const type = media[0];
      document.getElementById('download-link').html(`<p>one ${type} found<p>`);
    }
    else{
      document.getElementById('download-link').html('<p>no media found</p>');
    }

  }, false);
}, false);

function getMedia(videos, metaTags){
  
  if(videos.length > 0){
    return ['video',videos[0].getAttribute('src')];
  }

  for (let i=0; i<metaTags.length; i++) { 
    if (metaTags[i].getAttribute('property') === 'og:image') { 
      return ['image',metaTags[i].getAttribute('content')]; 
    } 
  }

  return 0;
}