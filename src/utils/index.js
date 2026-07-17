/**
 * 获取 assets/images 目录下的图片 URL
 * @param {string} img - 图片名称（不含扩展名）
 * @returns {string} 图片的完整 URL
 */
export function getImageUrl(img) {
  return new URL(`../assets/images/${img}.png`, import.meta.url).href
}
