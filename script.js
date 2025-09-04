const uploadImage = document.getElementById('uploadImage');
const microscopeView = document.getElementById('microscopeView');
const sampleImage = document.getElementById('sampleImage');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const resetBtn = document.getElementById('reset');
const snapshotBtn = document.getElementById('snapshot');

let scale = 1, posX = 0, posY = 0;
let isDragging = false;
let startX, startY;

// Load from file upload
uploadImage.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      sampleImage.src = e.target.result;
      resetView();
    };
    reader.readAsDataURL(file);
  }
});


// Zoom controls
zoomInBtn.addEventListener('click', () => { scale += 0.2; updateTransform(); });
zoomOutBtn.addEventListener('click', () => { if (scale > 0.4) scale -= 0.2; updateTransform(); });
resetBtn.addEventListener('click', resetView);

// Snapshot functionality
snapshotBtn.addEventListener('click', () => {
  html2canvas(microscopeView).then(canvas => {
    const link = document.createElement('a');
    link.download = 'microscope_snapshot.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});

// Dragging for desktop
microscopeView.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX - posX;
  startY = e.clientY - posY;
});
microscopeView.addEventListener('mouseup', () => { isDragging = false; });
microscopeView.addEventListener('mousemove', (e) => {
  if (isDragging) {
    posX = e.clientX - startX;
    posY = e.clientY - startY;
    updateTransform();
  }
});

// Touch gestures for mobile
microscopeView.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    isDragging = true;
    startX = e.touches[0].clientX - posX;
    startY = e.touches[0].clientY - posY;
  }
}, { passive: true });

microscopeView.addEventListener('touchmove', (e) => {
  if (isDragging && e.touches.length === 1) {
    posX = e.touches[0].clientX - startX;
    posY = e.touches[0].clientY - startY;
    updateTransform();
  }
}, { passive: true });

microscopeView.addEventListener('touchend', () => {
  isDragging = false;
}, { passive: true });

function updateTransform() {
  sampleImage.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
  document.getElementById('zoomLevel').textContent = `Zoom: ${Math.round(scale * 100)}%`;
}


function resetView() {
  scale = 1;
  posX = 0;
  posY = 0;
  updateTransform();
}