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
    const videoUrl = data?.video_no_watermark?.url;
    const userId = data?.user?.username;
    await doDownloadVideo(videoUrl, userId);
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

async function doDownloadVideo(url, fileName) {
  // download the video with blob
  const reponse = await fetch(url);
  const blob = await reponse.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.target = "_blank";
  link.download = fileName + ".mp4";
  link.click();
}
