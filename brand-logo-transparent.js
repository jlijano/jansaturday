(() => {
  function removeLightBackground(source, onReady) {
    if (!source) return;

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth || image.width;
      canvas.height = image.naturalHeight || image.height;

      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return;

      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      for (let index = 0; index < pixels.length; index += 4) {
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];

        if (red > 232 && green > 228 && blue > 218) {
          const brightness = (red + green + blue) / 3;
          if (brightness >= 247) {
            pixels[index + 3] = 0;
          } else {
            const alpha = Math.max(0, Math.min(255, Math.round(((247 - brightness) / 15) * 255)));
            pixels[index + 3] = Math.min(pixels[index + 3], alpha);
          }
        }
      }

      context.putImageData(imageData, 0, 0);
      onReady(canvas.toDataURL('image/png'));
    };
    image.src = source;
  }

  const brandImage = document.querySelector('.brand--logo img');
  if (brandImage) {
    const originalSource = brandImage.currentSrc || brandImage.src;
    removeLightBackground(originalSource, (transparentSource) => {
      brandImage.src = transparentSource;
      brandImage.style.background = 'transparent';
    });
  }

  const iconLink = document.querySelector('link[rel="icon"]');
  if (iconLink?.href) {
    removeLightBackground(iconLink.href, (transparentSource) => {
      iconLink.type = 'image/png';
      iconLink.href = transparentSource;
    });
  }
})();
