// let videos = [];
// let images = [];

// function addImage(image){
//     images.push(image);
// }

// function addVideo(video){
//     videos.push(video);
// }

// // Modified from:
// // https://stackoverflow.com/questions/49474775/chrome-65-blocks-cross-origin-a-download-client-side-workaround-to-force-down
// // Current blob size limit is around 500MB for browsers
// function makeBlob(message, callback) {
//     let url = message.url;
//     let filename = message.filename;
//     fetch(url, {
//     headers: new Headers({
//         'Origin': location.origin
//     }),
//     mode: 'cors'
//     })
//     .then(response => response.blob())
//     .then(blob => {
//     let blobUrl = window.URL.createObjectURL(blob);
//     callback({blob: blobUrl, filename: filename});
//     })
//     .catch(e => console.error(e));
// }

// // chrome message example modified from
// // https://stackoverflow.com/a/31112456/10817625
// chrome.runtime.onMessage.addListener(
//     function(message, sender, sendResponse) {
//         switch(message.type) {
//             case 'image':
//                 images.push(message);
//                 break;
//             case 'video':
//                 videos.push(message);
//                 break;
//             case 'clear':
//                 videos = [];
//                 images = [];
//                 break;
//             case 'grabData':
//                 sendResponse({images: images, videos: videos})
//                 break;
//             default:
//                 console.error("Unrecognised message: ", message);
//         }
//     }
// );