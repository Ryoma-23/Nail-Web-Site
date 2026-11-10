import qrcode from 'qrcode-generator';

const margin = 4;
export function makeQR(url: string) {
  const code = qrcode(0, 'M');
  code.addData(url);
  code.make();
  const count = code.getModuleCount();
  const size = count + margin * 2;
  const path = Array.from({ length: count }, (_, y) => Array.from({ length: count }, (_, x) =>
    code.isDark(y, x) ? 'M' + (x + margin) + ' ' + (y + margin) + 'h1v1h-1z' : '',
  ).join('')).join('');
  return { size, path };
}

export type QR = ReturnType<typeof makeQR>;

export function qrSvg(qr: QR) {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 ' + qr.size + ' ' + qr.size +
    '" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="white"/><path fill="black" d="' + qr.path + '"/></svg>';
}

export function qrPng(qr: QR): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const scale = Math.max(6, Math.floor(1024 / qr.size));
    canvas.width = canvas.height = qr.size * scale;
    const context = canvas.getContext('2d');
    if (!context) { reject(Error('Canvas unavailable')); return; }
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.scale(scale, scale);
    context.fillStyle = 'black';
    context.fill(new Path2D(qr.path));
    canvas.toBlob(blob => blob ? resolve(blob) : reject(Error('PNG unavailable')), 'image/png');
  });
}

export function downloadFile(blob: Blob, name: string) {
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}
