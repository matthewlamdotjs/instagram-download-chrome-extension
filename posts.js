// set initial url
let currentUrl = '';

// workaround in lieu of chrome.tabs.onUpdated since instagram updates url w/o changing dom content
setInterval(function(){
    if(window.location.href.indexOf('/p/') > -1
        && window.location.href != currentUrl){
        downloadPosts();
        currentUrl = window.location.href;
    } else {
        chrome.runtime.sendMessage({type: 'clear'});
    }
}, 500)

function downloadPosts(){
    // detect dialog
    let firstChildren = document.body.children;
    let dialog;
    if(firstChildren[firstChildren.length - 1].getAttribute('role') == 'dialog'){
        dialog = firstChildren[firstChildren.length - 1];
    }

    if(dialog){
        queryMedia(dialog);
    } else {
        queryMedia(document);
    }

    function queryMedia(element){
        let images = element.getElementsByTagName('img');
        for(let i=0; i<images.length; i++) {
            let image = images[i];
            if(image.classList.contains('FFVAD')){
                console.log(image.src);
                downloadResource(image.src, 'image');
            }
        }
        let videos = element.getElementsByTagName('video');
        for(let i=0; i<videos.length; i++) {
            let video = videos[i];
            console.log(video.src);
            downloadResource(video.src, 'video');
        }
    }

    // sends media to background.js
    function sendToBackground(blob, filename, type) {
        filename = filename.split('\\').pop().split('/').pop()
                .split(type == 'image' ? '.jpg' : '.mp4')[0]
                +(type == 'image' ? '.jpg' : '.mp4');
        chrome.runtime.sendMessage({type: type, filename: filename, blob: blob});
    }

    // Modified from:
    // https://stackoverflow.com/questions/49474775/chrome-65-blocks-cross-origin-a-download-client-side-workaround-to-force-down
    // Current blob size limit is around 500MB for browsers
    function downloadResource(url, type) {
        let filename = url.split('\\').pop().split('/').pop();
        fetch(url, {
        headers: new Headers({
            'Origin': location.origin
        }),
        mode: 'cors'
        })
        .then(response => response.blob())
        .then(blob => {
        let blobUrl = window.URL.createObjectURL(blob);
        sendToBackground(blobUrl, filename, type);
        })
        .catch(e => console.error(e));
    }
}