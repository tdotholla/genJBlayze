//post array of urls to api
// dl images from url
// store images in folders
// run generate commands with params
// upload images to store and return urls to all images

import { getDownloadURL, ref, uploadString } from "firebase/storage"
import { fbStorage } from "../../../components/db/firebase"
import { ILayerData } from "../../../components/types"
import { getFileName } from "../../../components/utils"
import { convert } from "imagemagick"
import { NextApiRequest, NextApiResponse } from "next"
import path from "path"
const maxAge = 1 * 24 * 60 * 60

/**
 *
 * Takes an array of image urls and applies imagemagick transformations to each, before uploading them to Storage
 * @param req request object
 * @param res response object
 * @returns JSON response
 */
const randomizeLayersHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  // db.createIndex("pullups", { location: "2dsphere" });

  // if (!req.user) {
  //   return res.status(401).send('unauthenticated');
  // }

  const {
    //can send query params to sort & limit results
    body,
    method,
  } = req
  const getRandomColor = () =>
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .toUpperCase()

  const fileRoot = path.join(process.cwd(), "tmp/")

  /**
   *   '000000': {
   _id: 'nMLLdR6mjLAnDO-sxQtu-',
   depthNumber: 0,
   imageUri: 'https://storage.googleapis.com/shop-mocknstock.appspot.com/43ce5167-a478-4bc8-97ce-18dfa661e5bc.png-000000.png',
   rarity: 'normal'
  }
  */
  switch (method) {
    case "POST":
      // take each uri and convert them x times
      if (!body) return res.status(400).send("You must write something")
      Object.entries(body as ILayerData).forEach(async function (item, i, a) {
        const colorCode = item[0]
        const { imageUri } = item[1]
        const randomColor = getRandomColor()
        const filePath = `${fileRoot}${getFileName(
          imageUri,
        )}_${randomColor}.png`
        convert(
          [
            imageUri,
            "-fuzz",
            "10%",
            "-fill",
            "#" + randomColor,
            "-opaque",
            "#" + colorCode,
            // filePath, // creates a file
            "-", // use stdout
          ],
          async (err, stdout) => {
            if (err) console.log(err)
            const storageRef = ref(
              fbStorage,
              `/uploads/${getFileName(imageUri)}.png`,
            )
            if (stdout) {
              const bufString = Buffer.from(stdout, "binary").toString("base64")
              await uploadString(storageRef, bufString, "base64", {
                contentType: "image/png",
              })
            } else {
              console.log(filePath)
              // read file and upload?
              // uploadBytes(storageRef, filePath)
            }
          },
        )
        //return array of refIDs or refPaths/URls so we can get downloadURLs in next step and store them to firebase db

        // const newImageUri = await getDownloadURL(createRef(imageUri))
        // console.log("newImageUri:", newImageUri)
        // randomizedUris.push(newImageUri)
        if (i == a.length - 1) {
          // This is only safe to cache when a timeframe is defined
          res.setHeader("cache-control", `public, max-age=${maxAge}`)
          // console.log(randomizedUris)
          res.send({ ok: true })
          //   res.send(
          //       `<!DOCTYPE html>
          //       <html>
          //       File saved at: <a href="file://${fileName}_cv.png">${fileRoot}${fileName}_cv.png</a>
          //       </html>
          //       `,)
        }
      })
      // res.send("dat uploaded successfully")

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

export default randomizeLayersHandler
