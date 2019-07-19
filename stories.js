
if(window.location.href.indexOf('instagram') > -1 && window.location.href.indexOf('/stories/') > -1){
    let button = document.createElement('button');
    let stop;
    button.innerHTML = 'Start IG Stories Download';
    button.style = 'position: absolute; padding: 10px; margin-top: 10px; margin-left: 10px; z-index: 999; border-radius: 5px';
    button.onclick = startDl;
    document.body.insertBefore(button, document.body.firstChild);

    function startDl(){
        stop = false;
        button.innerHTML = 'Stop downloading';
        button.onclick = stopDl;
    
        let fileNameStem = window.location.href.split('/stories/')[1].replace(/\\/g, '_');
        let currentFileIndex = 1;
        let story = document.getElementsByTagName('source')[0];
        let dl = document.createElement('a');
    
        // make initial download 
        downloadResource(story.src ,fileNameStem + 0 + '.mp4');
    
        let currentTimeout = setInterval(function() {
            if(story != document.getElementsByTagName('source')[0]){
                story = document.getElementsByTagName('source')[0];
                downloadResource(story.src, fileNameStem + currentFileIndex + '.mp4');
                currentFileIndex++;
            }
            // stop downloading if no longer in stories
            if(window.location.href.indexOf('/stories/') < 0 || stop){
                clearInterval(currentTimeout);
            }
        }, 500);
    
        // cross origin download workaround modified from:
        // https://stackoverflow.com/questions/49474775/chrome-65-blocks-cross-origin-a-download-client-side-workaround-to-force-down
        function forceDownload(blob, filename) {
            let dl = document.createElement('a');
            dl.download = filename;
            dl.href = blob;
            dl.click();
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
    }

    function stopDl() {
        stop = true;
        button.innerHTML = 'Start IG Stories Download';
        button.onclick = startDl;
    }
}
