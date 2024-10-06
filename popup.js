document.addEventListener("DOMContentLoaded", function () {
  console.log("dom loaded entered into popup");

  document
    .getElementById("capture-button")
    .addEventListener("click", function () {
      console.log("clicked on the capture button");
      chrome.runtime.sendMessage(
        { message: "access the tab id" },
        function (response) {
          console.log("response was:", response);
          if (response === "work completed") {
            console.log("success");
            chrome.runtime.sendMessage(
              { direct: "startCapture" },
              function (response) {
                console.log("completed? :", response);
              }
            );
          }
        }
      );
      document.getElementById("textpart").innerText = "Just wait for 5-6 seconds for image to upload!"
      document.getElementById("capture-button").innerText = "Uploading...";
      document.getElementById("capture-button").style.backgroundColor = "rgb(45, 45, 255)";

    });

    

  });
