import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(buffer: Buffer, folder = "byahero/receipts") {
  const dataUri = `data:image/jpeg;base64,${buffer.toString("base64")}`;
  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const result = await cloudinary.uploader.upload(dataUri, {
        folder,
        resource_type: "image",
        timeout: 20000,
      });
      return result;
    } catch (error) {
      lastError = error;
      await new Promise((r) => setTimeout(r, 300 * attempt));
    }
  }

  throw lastError;
}

export { cloudinary };
