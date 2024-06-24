//post array of urls to api
// dl images from url
// store images in folders
// run generate commands with params
// upload images to store and return urls to all images

import { convert } from "imagemagick"
import { buildSetup, createFiles, createMetaData } from "../../../gen/main"
import { defaultEdition } from "../../../gen/config"
import { NextApiRequest, NextApiResponse } from "next"
import { promisify } from "util"

const myArgs = process.argv.slice(2)
const editions = myArgs.length > 0 ? Number(myArgs[0]) : defaultEdition
/**
 *
 * Takes an array of image urls and applies imagemagick transformations to each, before uploading them to Storage
 * @param req request object
 * @param res response object
 * @returns JSON response
 */
const flattenLayersHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const {
    //can send query params to sort & limit results
    body,
    method,
  } = req
  switch (method) {
    case "POST":
      // take each uri and convert them x times
      if (!body) return res.status(400).send("You must write something")
      // need a promise.all array here

      buildSetup()
      createFiles(editions)
      // createMetaData() // need to upload or update metadata?
      break
    case "GET":
      // const pullup = await insertPullUp(db, req.body.data)
      // return res.json({ pullup })
      break
    default:
      res.setHeader("Allow", ["GET", "POST"])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// handler.post(async (req: Request | any, res: Response | any) => {
//
// });
// await spawn("convert", [tempFilePath, "-white-threshold", "90%", "-black-threshold", "90%", "-transparent", "white", "-opaque", "black", tempFilePath + ".png"]);
// await spawn("convert", [tempFilePath, "-white-threshold", "90%", "-transparent", "white", "-fill", colorSubstitution, "-opaque", "black", tempFilePath + ".png"]);
// await spawn("convert", [tempFilePath, "-white-threshold", "90%", "-black-threshold", "90%", "-transparent", "white", "-fill", vinylColor?.designColor?.hexColor, "-opaque", "black", tempFilePath + ".png"]);

export default flattenLayersHandler
