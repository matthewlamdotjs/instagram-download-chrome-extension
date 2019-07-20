document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.getSelected(null, function (tab) {
    console.log(tab);
    if(tab.url.indexOf('instagram') > -1){
      if(tab.url.indexOf('/p/') > -1){
        // chrome.runtime.sendMessage({type: "grabData"}, function(response) {
        //   function forceDownload(blob, filename) {
        //     let dl = document.createElement('a');
        //     dl.download = filename;
        //     dl.href = blob;
        //     dl.click();
        //   }
        //   function downloadAll(){
        //     response.images.forEach((image) => {
        //       forceDownload(image.blob, image.filename);
        //     });
        //     response.videos.forEach((video) => {
        //       forceDownload(video.blob, video.filename);
        //     });
        //   }
        //   if(response.images.length > 0 || response.videos.length > 0){
        //     document.getElementById('download-link').innerHTML = 'download';
        //     document.getElementById('download-link').addEventListener('click', downloadAll);
        //   }
        //   document.getElementById('images').innerHTML = `${response.images.length} images found`;
        //   document.getElementById('videos').innerHTML = `${response.videos.length} videos found`;
        // });     
        document.getElementById('results').innerHTML = 'If you want the download dialog to reappear, just reload the page by using ctrl+R';
      } else if(tab.url.indexOf('/stories/') > -1){
        document.getElementById('results').innerHTML = 'Click the download button on the top-left corner to start downloading automatically';
      } else {
        document.getElementById('results').innerHTML = 'Please navigate to a specific post or a story';
      }
    }
    else{
      document.getElementById('results').innerHTML = 'you are not currently on instagram';
    }
  });
}, false);