// ========== Year ==========
document.querySelector(".year").textContent = new Date().getFullYear();

// ========== Elements ==========
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const nameInput = document.querySelector(".name");
const statusEl = document.querySelector("#status");
const pngBtn = document.querySelector(".png-btn");
const pdfBtn = document.querySelector(".pdf-btn");

// ========== One Certificate Only ==========
const STORAGE_KEY = "activus_certificate_generated";

function hasAlreadyGenerated() {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

function markAsGenerated() {
  localStorage.setItem(STORAGE_KEY, "true");
}

function updateUI() {
  if (hasAlreadyGenerated()) {
    nameInput.disabled = true;
    nameInput.placeholder = "You have already generated your certificate";
    pngBtn.disabled = true;
    pdfBtn.disabled = true;
    statusEl.textContent = "You have already generated your one allowed certificate.";
    statusEl.className = "status error";
  }
}

// ========== Image Loading ==========
const img = new Image();
img.crossOrigin = "anonymous";
img.src = "certificate.png"; // make sure this file exists in the same folder

img.onload = function () {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
};

// ========== Helpers ==========
function getText() {
  const value = nameInput.value.trim();
  if (!value) {
    statusEl.textContent = "Please enter your full name first.";
    statusEl.className = "status error";
    return null;
  }
  return value;
}

function drawCanvas(text) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  ctx.fillStyle = "#000000";
  ctx.font = "bold 80px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Adjust Y position if needed for your certificate design
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  return canvas;
}

// ========== Download PNG ==========
function downloadPng() {
  if (hasAlreadyGenerated()) {
    statusEl.textContent = "Only one certificate is allowed.";
    statusEl.className = "status error";
    return;
  }

  const text = getText();
  if (!text) return;

  drawCanvas(text);

  const link = document.createElement("a");
  link.download = `${text.replace(/\s+/g, "_")}_certificate.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();

  markAsGenerated();
  updateUI();
  statusEl.textContent = "Image downloaded successfully!";
  statusEl.className = "status success";
}

// ========== Download PDF ==========
function downloadPdf() {
  if (hasAlreadyGenerated()) {
    statusEl.textContent = "Only one certificate is allowed.";
    statusEl.className = "status error";
    return;
  }

  const text = getText();
  if (!text) return;

  drawCanvas(text);

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.width, canvas.height]
  });

  const imgData = canvas.toDataURL("image/png");
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(`${text.replace(/\s+/g, "_")}_certificate.pdf`);

  markAsGenerated();
  updateUI();
  statusEl.textContent = "PDF downloaded successfully!";
  statusEl.className = "status success";
}

// ========== Loader + Init ==========
window.addEventListener("load", () => {
  // Simulate a short elegant loader
  setTimeout(() => {
    document.getElementById("loader").classList.add("fade-out");
    
    setTimeout(() => {
      document.getElementById("loader").style.display = "none";
      const app = document.getElementById("app");
      app.classList.remove("hidden");
      app.classList.add("visible");
      updateUI();
    }, 600);
  }, 1200); // adjust duration if you want
});