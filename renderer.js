const { ipcRenderer } = require('electron');

document.getElementById('fetch-image').onclick = async () => {
  const images = await ipcRenderer.invoke('get-selected-images');
  if (!images.length) {
    alert('No image selected in Eagle!');
    return;
  }
  const image = images[0];
  const img = new window.Image();
  img.src = image.path;
  img.onload = () => {
    const canvas = document.getElementById('image-canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
};

document.getElementById('run-inpaint').onclick = async () => {
  const images = await ipcRenderer.invoke('get-selected-images');
  if (!images.length) return;
  const imagePath = images[0].path;
  const canvas = document.getElementById('image-canvas');
  const maskDataURL = canvas.toDataURL('image/png');
  const prompt = document.getElementById('prompt').value;
  const resultPath = await ipcRenderer.invoke('sdxl-inpaint', { imagePath, maskDataURL, prompt });
  await ipcRenderer.invoke('import-to-eagle', resultPath);
  alert('Inpainting complete and imported to Eagle!');
};

// TODO: Add mask drawing logic to canvas