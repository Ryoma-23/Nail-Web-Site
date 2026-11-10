export type View = { yaw: number; pitch: number; zoom: number };
export const defaultView: View = { yaw: 0, pitch: 0, zoom: 1 };

export function adjustView(view: View, yaw: number, pitch: number, zoom = 0): View {
  return {
    yaw: ((view.yaw + yaw) % 360 + 360) % 360,
    pitch: Math.max(-75, Math.min(75, view.pitch + pitch)),
    zoom: Math.max(1, Math.min(2.6, Math.round((view.zoom + zoom) * 10) / 10)),
  };
}

export function projectPanorama(source: ImageData, output: ImageData, view: View) {
  const radians = Math.PI / 180;
  const yaw = view.yaw * radians;
  const pitch = view.pitch * radians;
  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);
  const spread = Math.tan(48 * radians) / view.zoom;
  const { width, height, data } = output;
  for (let row = 0; row < height; row++) {
    const cameraY = (height - 2 * row - 1) * spread / width;
    const worldY = cameraY * cosPitch + sinPitch;
    const worldZ = cosPitch - cameraY * sinPitch;
    for (let col = 0; col < width; col++) {
      const x = (2 * col + 1 - width) * spread / width;
      const longitude = Math.atan2(x, worldZ) + yaw;
      const latitude = Math.atan2(worldY, Math.hypot(x, worldZ));
      const u = (longitude / (2 * Math.PI) + 1.5) % 1;
      const v = .5 - latitude / Math.PI;
      const sample = 4 * (Math.floor(v * source.height) * source.width + Math.floor(u * source.width));
      const target = 4 * (row * width + col);
      data[target] = source.data[sample];
      data[target + 1] = source.data[sample + 1];
      data[target + 2] = source.data[sample + 2];
      data[target + 3] = 255;
    }
  }
}
