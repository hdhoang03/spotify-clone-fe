// canvasUtils.ts
export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous'); // Cần thiết để tránh lỗi tainted canvas
        image.src = url;
    });

/**
 * Hàm này nhận vào url ảnh và vùng pixel cần cắt (từ react-easy-crop)
 * Trả về một Blob (file ảnh) đã được cắt.
 */
export async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    flip = { horizontal: false, vertical: false }
): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('No 2d context');
    }

    // Set kích thước canvas bằng kích thước vùng cắt
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Vẽ ảnh lên canvas, chỉ lấy phần trong vùng crop
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    // Trả về kết quả dưới dạng Blob
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            resolve(blob);
        }, 'image/jpeg'); // Hoặc 'image/png'
    });
}