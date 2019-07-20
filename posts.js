// set initial url
let currentUrl = '';

// workaround in lieu of chrome.tabs.onUpdated since instagram updates url w/o changing dom content
setInterval(function(){
    if(window.location.href.indexOf('/p/') > -1
        && window.location.href != currentUrl){
        currentUrl = window.location.href;
        downloadPosts();
    } else {
        // chrome.runtime.sendMessage({type: 'clear'});
    }
}, 500)

document.addEventListener('click', function(e){
    if(window.location.href.indexOf('/p/') > -1
        && window.location.href != currentUrl){
        currentUrl = window.location.href;
        downloadPosts();
    }
})

function downloadPosts(){
    let videos = [];
    let images = [];
    let loopindex = 0;
    const MAX_LOOPS = 20;
    
    let attempts = setInterval(function(){
        // detect dialog
        let firstChildren = document.body.children;
        let dialog;
        if(firstChildren[firstChildren.length - 1].getAttribute('role') == 'dialog'){
            console.log('dialoggggg');
            dialog = firstChildren[firstChildren.length - 1];
        }

        let element;
        if(dialog){
            console.log('query media dialoggggg');
            element = dialog;
        } else {
            element = document;
        }

        let imagesElements = element.getElementsByTagName('img');
        console.log(imagesElements[0]);
        let videosElements = element.getElementsByTagName('video');
        for(let i=0; i<imagesElements.length; i++) {
            console.log('image-'+i);
            let image = imagesElements[i];
            if(image.classList.contains('FFVAD')){
                console.log(image.src);
                images.push(image.src);
            }
        }
        for(let i=0; i<videosElements.length; i++) {
            let video = videosElements[i];
            console.log('video-'+i);
            console.log(video.src);
            videos.push(video.src);
        }

        if(videos.length > 0 || images.length > 0){
            loopindex = MAX_LOOPS;
            let ans = confirm(images.length+' image(s) and '+videos.length+' video(s) found. Would you like to download them?');
            if(ans){
                images.forEach(function(image){
                    downloadResource(image, 'image');
                });
                videos.forEach(function(video){
                    downloadResource(video, 'video');
                });
            } else {
                videos = [];
                images = [];
            }
            clearInterval(attempts);
        }
        if(loopindex >= MAX_LOOPS) clearInterval(attempts);
        loopindex++
    }, 1000);
}

// OLD: sends media to background.js
// UPDATE: now downloads here, use confirm on page instead. CORS workaround
function sendToBackground(blob, filename, type) {
    filename = filename.split('\\').pop().split('/').pop()
            .split(type == 'image' ? '.jpg' : '.mp4')[0]
            +(type == 'image' ? '.jpg' : '.mp4');
    // chrome.runtime.sendMessage({type: type, filename: filename, blob: blob});

    // Download here instead after confirm
    let dl = document.createElement('a');
    dl.download = filename;
    dl.href = blob;
    dl.click();
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