export const CLOUDINARY_CONFIG = {
  cloudName: 'wpsmgulo',
  apiKey: '476521812923295',
  apiSecret: 'AUPqSnOKOWRNTfV_v0XV6Nwi7yc',
  folder: 'history_game',
};

/**
 * Calculates SHA-1 hash for Cloudinary signed upload
 */
async function calculateSHA1(str: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  resourceType: string;
  bytes: number;
}

/**
 * Direct signed upload to Cloudinary using browser Web Crypto API
 */
export async function uploadToCloudinary(
  file: File | Blob,
  resourceType: 'image' | 'video' | 'auto' = 'auto',
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = CLOUDINARY_CONFIG.folder;

  // Cloudinary signature parameters sorted alphabetically: folder, timestamp + apiSecret
  const stringToSign = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
  const signature = await calculateSHA1(stringToSign);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', CLOUDINARY_CONFIG.apiKey);
  formData.append('timestamp', timestamp);
  formData.append('folder', folder);
  formData.append('signature', signature);

  const uploadEndpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadEndpoint);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({
            url: data.url,
            secureUrl: data.secure_url,
            publicId: data.public_id,
            format: data.format,
            resourceType: data.resource_type,
            bytes: data.bytes,
          });
        } catch (err) {
          reject(new Error('Lỗi giải mã phản hồi từ máy chủ Cloudinary.'));
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          reject(new Error(errData.error?.message || `Lỗi tải lên (${xhr.status}): ${xhr.statusText}`));
        } catch {
          reject(new Error(`Tải lên Cloudinary thất bại (${xhr.status})`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Lỗi kết nối mạng khi tải tệp lên Cloudinary.'));
    };

    xhr.send(formData);
  });
}
