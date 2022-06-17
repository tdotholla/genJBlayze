import { ref } from "firebase/storage"
import { fbStorage } from "./db/firebase"

export const getFileName = (uri: string) =>
  uri.split("/")[uri.split("/").length - 1].split(".")[0]

export function setRef(imageUri: string) {
  return ref(fbStorage, `/uploads/${getFileName(imageUri)}.png`)
}
