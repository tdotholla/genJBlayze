import { initializeApp } from "firebase/app"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyB_AvlJ-tlRx7dGtZ_qUmzCEw2ekQ11XoI",
  authDomain: "genblayze.firebaseapp.com",
  projectId: "genblayze",
  storageBucket: "genblayze.appspot.com",
  messagingSenderId: "928767027927",
  appId: "1:928767027927:web:206bad3e155e1992ba1e92",
  measurementId: "G-GXR2KSL74L",
}

export const appRef = initializeApp(firebaseConfig)
export const analytics = getAnalytics(appRef)
export const fbStorage = getStorage(appRef)
// const storageRef = ref(fbStorage, "/uploads")

export const uploadImage = async (image: any) => {
  if (image) {
    const storageRef = ref(fbStorage, `/uploads/${image.name}`)
    await uploadBytes(storageRef, image, {})
    const imageURI = await getDownloadURL(storageRef)
    // console.info("image", image)
    return imageURI
  }
}
