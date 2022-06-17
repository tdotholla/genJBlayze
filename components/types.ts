export interface IUploadSettings {
  _id: string
  imageUrl: string | undefined
  fuzz: string
  numDominantColorsToExtract: number
}
export interface ILayerData {
  [color: string]: {
    _id: string
    depthNumber: number
    imageUri: string
    rarity: string
  }
}
