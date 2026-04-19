document.querySelector(".year").innerHTML = new Date().getFullYear()
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

// Load your image from folder
const img = new Image();
img.crossOrigin = "anonymous"; // 
img.src = "certificate.png";

img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
};

// Get text
function getText() {
    const value = document.querySelector(".name").value;

    if (value.trim() === "") {
        alert("Enter name text first!");
        return null;
    }
    return value;
}

// Draw text on image
function drawCanvas(text) {
    // redraw image first (important)
    ctx.drawImage(img, 0, 0);

    ctx.fillStyle = "#000";
    ctx.font = "80px Arial";
    ctx.fontWeight = "700"
    ctx.textAlign = "center";

    // adjust this position to match your certificate design
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas;
}

// Download PNG
function downloadPng() {
    const text = getText();
    if (!text) return;

    drawCanvas(text);

    const link = document.createElement("a");
    link.download = "certificate.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

// Download PDF
function downloadPdf() {
    const text = getText();
    if (!text) return;

    drawCanvas(text);

    const { jsPDF } = window.jspdf; // ✅ correct
    const pdf = new jsPDF();

    const imgData = canvas.toDataURL("image/png");

    pdf.addImage(imgData, "PNG", 10, 10, 180, 90);
    pdf.save("certificate.pdf");
}
