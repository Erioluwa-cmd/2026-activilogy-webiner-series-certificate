// ========== Year ==========
document.querySelector(".year").textContent = new Date().getFullYear();

// ========== Elements ==========
const canvas = document.querySelector(".canvas");           // high-res for download
const ctx = canvas.getContext("2d");

const previewCanvas = document.querySelector(".preview-canvas");
const previewCtx = previewCanvas.getContext("2d");
const previewPlaceholder = document.querySelector(".preview-placeholder");

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

// ========== Image ==========
const img = new Image();
img.crossOrigin = "anonymous";
img.src = "certificate.png";   // ← make sure this file is in the same folder

img.onload = function () {
  // Set high-res canvas size
  canvas.width = img.width;
  canvas.height = img.height;

  // Set preview canvas size (we will scale it with CSS)
  previewCanvas.width = img.width;
  previewCanvas.height = img.height;

  // Draw initial empty certificate on preview
  drawPreview("");
};

// ========== Drawing Functions ==========
function drawOnContext(context, text, width, height) {
  context.clearRect(0, 0, width, height);
  context.drawImage(img, 0, 0, width, height);

  if (text.trim() !== "") {
    context.fillStyle = "#000000";
    // Scale font size based on certificate width
    const fontSize = Math.floor(width * 0.055); // adjust this number if text is too big/small
    context.font = `bold ${fontSize}px Arial`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Adjust Y position if needed (currently center)
    const yPos = height * 0.52;   // change this value to move text up/down
    context.fillText(text, width / 2, yPos);
  }
}

function drawPreview(text) {
  if (!img.complete) return;

  drawOnContext(previewCtx, text, previewCanvas.width, previewCanvas.height);

  if (text.trim() === "") {
    previewPlaceholder.classList.remove("hidden");
  } else {
    previewPlaceholder.classList.add("hidden");
  }
}

function drawCanvas(text) {
  drawOnContext(ctx, text, canvas.width, canvas.height);
  return canvas;
}

// ========== Live Preview on Typing ==========
nameInput.addEventListener("input", () => {
  const text = nameInput.value;
  drawPreview(text);

  // Clear status when user starts typing again
  if (statusEl.textContent && !hasAlreadyGenerated()) {
    statusEl.textContent = "";
  }
});

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

  // Create PDF matching the certificate size
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? "landscape" : "portrait",
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
  setTimeout(() => {
    document.getElementById("loader").classList.add("fade-out");

    setTimeout(() => {
      document.getElementById("loader").style.display = "none";
      const app = document.getElementById("app");
      app.classList.remove("hidden");
      app.classList.add("visible");
      updateUI();
    }, 600);
  }, 1100);
});