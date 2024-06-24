import { initializeApp } from "firebase/app"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import {
  collection,
  doc,
  getDoc,
  initializeFirestore,
  setDoc,
} from "firebase/firestore"
// import { getAuth, useDeviceLanguage } from "firebase/auth"
// import { getAnalytics } from "firebase/analytics"
import { nanoid } from "nanoid"
import { IUploadedImage } from "../types"

const firebaseConfig = {
  apiKey: "AIzaSyB_AvlJ-tlRx7dGtZ_qUmzCEw2ekQ11XoI",
  authDomain: "genblayze.firebaseapp.com",
  projectId: "genblayze",
  storageBucket: "genblayze.appspot.com",
  messagingSenderId: "928767027927",
  appId: "1:928767027927:web:206bad3e155e1992ba1e92",
  measurementId: "G-GXR2KSL74L",
}

const appRef = initializeApp(firebaseConfig)
// export const analytics = getAnalytics(appRef) //needs "window"
const fsdb = initializeFirestore(appRef, {})
export const fbStorage = getStorage(appRef)
// useDeviceLanguage(getAuth())
const uploadsRef = collection(fsdb, "UPLOADS")

export const storeImage = async (image: File, path?: string) => {
  const stripped = image.name.split(".")[0]
  path = path ?? `/uploads/${stripped}/${image.name}`
  if (image) {
    const storageRef = ref(fbStorage, path)
    await uploadBytes(storageRef, image, {})
    const imageURI = await getDownloadURL(storageRef)
    return imageURI
  }
}

export const updateArtworkInfo = async function (
  data: Partial<IUploadedImage>,
) {
  const _id = data._id ?? nanoid()
  const dateTime = data.dateTime ?? new Date().toISOString()
  const origData = {
    _id,
    dateTime,
  }
  const docRef = doc(uploadsRef, _id)
  console.log("submitting to db...", { ...origData, ...data })
  await setDoc(docRef, { ...origData, ...data }, { merge: true })
  return _id
}

export const artworkFetch = async function (id: string) {
  const docRef = doc(uploadsRef, id)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() && docSnap.data()
}


