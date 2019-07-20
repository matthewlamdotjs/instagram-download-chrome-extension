let videos = [];
let images = [];

function download(blob, filename) {
    let dl = document.createElement('a');
    dl.download = filename;
    dl.href = blob;
    dl.click();
}

// chrome message example modified from
// https://stackoverflow.com/a/31112456/10817625
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        switch(message.type) {
            case 'image':
                images.push(message);
                break;
            case 'video':
                videos.push(message);
                break;
            case 'clear':
                videos = [];
                images = [];
                break;
            case 'grabData':
                sendResponse({images: images, videos: videos})
                break;
            default:
                console.error("Unrecognised message: ", message);
        }
    }
);