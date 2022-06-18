export interface IUploadSettings {
  _id: string
  imageUrl: string | undefined
  fuzz: string
  numDominantColorsToExtract: number
}

export interface ILayerData {
  [color: string]: {
    _id: string
    colorVariety: number
    depthNumber: number
    imageUri: string
    rarity: string
    varieties: {
      [color: string]: {
        _id: string
        origColorCode: string
        newColorCode: string
        imageUri: string | undefined
      }
    }
  }
}
