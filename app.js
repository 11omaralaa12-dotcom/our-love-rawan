
"use strict";

// غيّر التاريخ ده لتاريخ بداية علاقتكم.
// الصيغة: السنة، الشهر - 1، اليوم، الساعة، الدقيقة
const startDate = new Date(2025, 9, 23, 1, 0);

const $ = (selector) => document.querySelector(selector);

// Love Counter
function updateLoveCounter() {
  const now = Date.now();
  const elapsed = Math.max(0, now - startDate.getTime());

  const totalSeconds = Math.floor(elapsed / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);

  $("#days").textContent = days.toLocaleString("en-US");
  $("#hours").textContent = String(totalHours % 24).padStart(2, "0");
  $("#minutes").textContent = String(totalMinutes % 60).padStart(2, "0");
  $("#seconds").textContent = String(totalSeconds % 60).padStart(2, "0");
}

updateLoveCounter();
setInterval(updateLoveCounter, 1000);

// Music Player
const music = $("#backgroundMusic");
const musicButton = $("#musicToggle");
const musicStatus = $("#musicStatus");

musicButton.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicStatus.textContent = "الموسيقى شغالة ♡";
      musicButton.innerHTML = '<i class="bi bi-pause-fill"></i>';
    } catch {
      musicStatus.textContent = "ضيف ملف الأغنية أولًا";
    }
  } else {
    music.pause();
    musicStatus.textContent = "الموسيقى متوقفة";
    musicButton.innerHTML = '<i class="bi bi-music-note-beamed"></i>';
  }
});

// Image Gallery
const modal = $("#imageModal");
const modalImage = $("#modalImage");

function openImage(src) {
  modalImage.src = src;
  modal.classList.add("open");
}

document.querySelectorAll(".gallery-photo").forEach((button) => {
  button.addEventListener("click", () => {
    openImage(button.dataset.image);
  });
});

function closeImage() {
  modal.classList.remove("open");
  modalImage.src = "";
}

$("#closeModal").addEventListener("click", closeImage);

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeImage();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeImage();
});

// Add photos from the device for local preview
const photoUpload = $("#photoUpload");
const gallery = $(".gallery-grid");

photoUpload.addEventListener("change", (event) => {
  const files = Array.from(event.target.files || []);
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));

  imageFiles.forEach((file) => {
    const url = URL.createObjectURL(file);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-photo";
    button.setAttribute("aria-label", "عرض صورة جديدة");
    button.dataset.image = url;

    const image = document.createElement("img");
    image.src = url;
    image.alt = file.name || "ذكرى جديدة";

    button.appendChild(image);
    button.addEventListener("click", () => openImage(url));

    gallery.insertBefore(button, $(".upload-card"));
  });

  photoUpload.value = "";
});

// Video preview from the device
const videoUpload = $("#videoUpload");
const video = $("#loveVideo");

let temporaryVideoUrl = null;

videoUpload.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file || !file.type.startsWith("video/")) return;

  if (temporaryVideoUrl) URL.revokeObjectURL(temporaryVideoUrl);

  temporaryVideoUrl = URL.createObjectURL(file);
  video.pause();
  video.src = temporaryVideoUrl;
  video.load();
  videoUpload.value = "";
});

// PWA Service Worker
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .catch((error) => console.error("PWA registration failed:", error));
  });
}
