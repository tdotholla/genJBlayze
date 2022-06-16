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
// export const analytics = getAnalytics(appRef)
const fsdb = initializeFirestore(appRef, {})
const fbStorage = getStorage(appRef)
// useDeviceLanguage(getAuth())
const uploadsRef = collection(fsdb, "UPLOADS")

// const storageRef = ref(fbStorage, "/uploads")

export const storeImage = async (image: File) => {
  if (image) {
    const storageRef = ref(fbStorage, `/uploads/${image.name}`)
    await uploadBytes(storageRef, image, {})
    const imageURI = await getDownloadURL(storageRef)
    // console.info("image", image)
    return imageURI
  }
}

// == ARTWORKS ================================== //

interface ILayer {
  [name: string]: {
    depthNumber?: number
    imageUri: string
    rarity?: string
  }
}
interface IUploadedImage {
  uid?: string
  _id: string
  sourceImageUri: string | undefined
  dateTime?: string
  fuzz?: number
  numDominantColorsToExtract?: number
  isWhiteTransparent?: boolean
  layers?: ILayer
  editions?: number
}
export const updateArtworkSet = async function (data: Partial<IUploadedImage>) {
  const _id = data._id ?? nanoid()
  const dateTime = data.dateTime ?? new Date().toISOString()
  const origData = {
    _id,
    dateTime,
  }
  const docRef = doc(uploadsRef, _id)
  console.log("submitting to db...", { ...data, ...origData })
  await setDoc(docRef, { ...origData, ...data }, { merge: true })
  return _id
}

export const artworkFetch = async function (id: string) {
  const docRef = doc(uploadsRef, id)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() && docSnap.data()
}


