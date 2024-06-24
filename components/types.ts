export interface IVarietyLeaf {
  _id: string
  origColorCode: string
  newColorCode: string
  imageUri: string | undefined
}

// export interface IUploadSettings {
//   _id: string
//   imageUrl: string | undefined
//   fuzz: string
//   numDominantColorsToExtract: number
// }

export interface ILayerData {
  [color: string]: {
    _id: string
    _ogid: string
    _rid: string
    artworkName: string
    colorVariety: number
    depthNumber: number
    imageUri: string | undefined
    rarity: string
    varieties: {
      [origColorCode: string]: IVarietyLeaf[]
    }
  }
}
export const emptyLayerData = {
  "000000": {
    _id: "",
    colorVariety: 0,
    depthNumber: 0,
    imageUri: "",
    rarity: "",
    varieties: {
      "000000": {
        _id: "",
        origColorCode: "000000",
        newColorCode: "rgba_255_255_255_0_50",
        imageUri: "htt",
      },
    },
  },
}

// export interface ILayer {
//   [name: string]: {
//     depthNumber?: number
//     imageUri: string
//     rarity?: string
//   }
// }
export interface IUploadedImage {
  uid?: string
  _id: string
  imageUrl: string | undefined
  dateTime?: string
  artworkName: string
  fuzz?: string
  numDominantColorsToExtract?: number
  isWhiteTransparent?: boolean
  layers?: Partial<ILayerData>
  editions?: number
}
