document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".download").addEventListener("click", downloadVideo);
  document.querySelector(".close").addEventListener("click", () => {
    const errorMessage = document.querySelector(".modal");
    errorMessage.style.display = "none";
  });
});
async function downloadVideo(e) {
  e.preventDefault();
  let videoId = document.querySelector("#video-id").value;
  if (videoId) {
    if (videoId.startsWith("https://")) videoId = getTikTokVideoId(videoId);
    try {
      e.target.classList.add("loading");
      const response = await fetch(
        `https://tiktok-download-api-euxl.onrender.com/download?videoId=${videoId}`
      );
      const data = await response.json();
      if (response.status === 200) {
        const itemStruct = data?.data?.itemInfo?.itemStruct;
        const video = itemStruct?.video?.bitrateInfo.filter((item) => item?.GearName.includes("1080"))[0];
        const videoUrl = video?.PlayAddr?.UrlList[2];
        const userId = itemStruct?.author?.uniqueId;
        const videoTitle = itemStruct?.desc;
        await doDownloadVideo(videoUrl, `${videoTitle}@${userId}`);
      } else {
        showErrorMessage("Video not found");
      }
    } catch (error) {
      console.error(error);
      showErrorMessage("An error occurred while downloading the video");
    } finally {
      e.target.classList.remove("loading");
    }
  } else {
    showErrorMessage("Please enter a video ID");
  }
}

function getTikTokVideoId(url) {
  // Regular expressions for different TikTok URL formats
  const standardPattern = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/; // Standard TikTok URL
  const liteAppPattern = /tiktok\.com\/t\/(\w+)/; // Lite or app-generated URL
  const shortUrlPattern = /tiktok\.com\/([\w]+)/; // Shortened URL (e.g., vm.tiktok.com)

  // Check against each pattern
  let match = url.match(standardPattern);
  if (match) return match[1]; // Video ID from standard URL

  match = url.match(liteAppPattern);
  if (match) return match[1]; // Video ID from Lite app URL

  match = url.match(shortUrlPattern);
  if (match) return match[1]; // Shortened URL unique key (not the video ID itself)

  return null; // Return null if no valid format is found
}

async function doDownloadVideo(url, fileName) {
  // download the video with blob
  // const reponse = await fetch(url);
  // const blob = await reponse.blob();
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.download = fileName + ".mp4";
  link.click();
}

function showErrorMessage(message) {
  const errorMessage = document.querySelector(".modal");
  const errorText = document.querySelector("#errorText");
  errorText.textContent = message;
  errorMessage.style.display = "block";
}
