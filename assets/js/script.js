document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".download").addEventListener("click", downloadVideo);
});
async function downloadVideo() {
  let videoId = document.querySelector("#video-id").value;
  if (videoId) {
    if (videoId.startsWith("https://")) {
      videoId = getTikTokVideoId(videoId);
    }
    const response = await fetch(
      `https://tiktok-download-api-production.up.railway.app/download?videoId=${videoId}`
    );
    const data = await response.json();
    const videoUrl = data?.video_no_watermark.url;
    const userId = data?.user.username;
    doDownloadVideo(videoUrl, userId);
  } else {
    alert("Please enter a video ID");
  }
}

function getTikTokVideoId(url) {
  // Define the regular expression to extract the video ID
  const pattern = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/;
  const match = url.match(pattern);
  if (match) {
    return match[1]; // The video ID
  }
  return null; // Return null if no match is found
}

function doDownloadVideo(url, fileName) {
  // Download the video from the given URL
  // You can use the URL to create a download link or use a library like FileSaver.js to handle the download
  // For example:
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName + ".mp4";
  link.click();
  // Or using FileSaver.js:
  // saveAs(url, "video.mp4");
  // Replace the above code with your own implementation
}
