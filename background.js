let currentTabId;
let workerURL = "https://securesnap.ayushkv10204.workers.dev/"

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("request was:", request);
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    currentTabId = tabs[0].id;
    console.log("the id of current tab is: ", currentTabId);
  });
  sendResponse("work completed");
});

async function sendImageToWorker(imageData){
  console.log("entered here in async fxn, runnin it");
    const response = await fetch(workerURL, {
      method: "POST",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        action: "store",
        image: imageData
      })
    });
    if(response.ok){
      console.log("Image stored successfully!");
    } else {
      console.error("Failed to store image: ", response.statusText)
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.direct === "startCapture") {
    // get the current window id
    chrome.windows.getCurrent(function (window) {
      // use the window id as the first argument
      chrome.tabs.captureVisibleTab(
        window.id,
        { format: "png" },
        function (imageData) {
          var image = {};
          image[currentTabId] = imageData;
          console.log("we entered here too");
          console.log(image[currentTabId]);
          sendImageToWorker(imageData).then(() => {
            chrome.tabs.create({ url: "https://secur-esnap.web.app/ImageEditor" });
          }).catch(error => {
            console.error('Failed to store image, not opening new tab:', error);
          });
        }
      );
    });
  }
});
