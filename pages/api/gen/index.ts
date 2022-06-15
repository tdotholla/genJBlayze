//post array of urls to api
// dl images from url
// store images in folders
// run generate commands with params
// upload images to store and return urls to all images

import { createWriteStream } from "fs"
import { NextApiRequest, NextApiResponse } from "next"

export default async function downloadHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req

  switch (method) {
    case "POST": {
      const path = "./images/image.png"
      const download = (url, path, callback) => {
        console.log("downloading file...")
      }
      const uris = req.body as string[]
      console.log(uris)
      uris.forEach((uri) => {
        download(uri, path, () => {
          console.log(uri.substring(uri.lastIndexOf("/") + 1))
          console.log("✅ Done!")
        })
      })
      // download each uri
      //   link uri or file to config metadata
      //
      break
    }

    default:
      res.status(400).json({ itemnotfound: "No file" })
      break
  }
}

