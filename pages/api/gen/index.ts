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
import { nanoid } from "nanoid"
import { promisify } from "util"

const maxAge = 1 * 24 * 60 * 60
const konvert = promisify(convert)
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
  // const getRandomHexColor = () =>
  //   Math.floor(Math.random() * 16777215)
  //     .toString(16)
  //     .toUpperCase()
  const getRandomRGBA = () => {
    const getNum = () => Math.floor(Math.random() * 256)
    const getOpacity = () =>
      (Math.floor(Math.random() * (100 - 50 + 1) + 50) / 100).toPrecision(2) //btwn .5-1
    return `rgba(${getNum()},${getNum()},${getNum()},${getOpacity()})`
  }
  // const fileRoot = path.join(process.cwd(), "tmp/")
  const snakeCaseRGB = (color: string): string =>
    color.slice(0, -1).replace(/[(,.]/g, "_")
  /**
   *   '000000': {
   _id: 'nMLLdR6mjLAnDO-sxQtu-',
   depthNumber: 0,
   imageUri: 'https://storage.googleapis.com/shop-mocknstock.appspot.com/43ce5167-a478-4bc8-97ce-18dfa661e5bc.png-000000.png',
   rarity: 'normal'
  }
  */
  let randomizedUris = []
  // let newobj = {}
  switch (method) {
    case "POST":
      // take each uri and convert them x times
      if (!body) return res.status(400).send("You must write something")
      // need a promise.all array here
      randomizedUris = Promise.all(
        Object.entries(body as ILayerData).map(async function (item, i) {
          const colorCode = item[0]
          const { imageUri, colorVariety, _rid } = item[1]

          return await Promise.all(
            Array.from(Array(colorVariety)).map(async () => {
              const randomColor = getRandomRGBA()
              const snakedColor = snakeCaseRGB(randomColor)
              const filePath =
                imageUri &&
                `${getFileName(
                  imageUri,
                )}_${colorCode}-${snakedColor}_${i}_of_${colorVariety}.png`
              const uploadImage = async (binaryString: BinaryType) => {
                const storageRef = ref(
                  fbStorage,
                  `/uploads/${_rid}/${filePath}`,
                )
                if (binaryString) {
                  const bufString = Buffer.from(
                    binaryString,
                    "binary",
                  ).toString("base64")
                  await uploadString(storageRef, bufString, "base64", {
                    contentType: "image/png",
                  })
                  return await getDownloadURL(storageRef)
                } else {
                  console.log(filePath)
                  // read file and upload?
                  // uploadBytes(storageRef, filePath)
                }
              }

              return await konvert([
                imageUri,
                "-fuzz",
                "90%",
                "-fill",
                randomColor,
                "-opaque",
                "#" + colorCode,
                // filePath, // creates a file
                "-", // use stdout
              ]).then(async (binString) => ({
                _id: nanoid(),
                origColorCode: colorCode,
                newColorCode: snakedColor,
                imageUri: await uploadImage(binString as BinaryType),
              }))
            }),
          )

          //set item[1].varieties[newColorCode]  = this....?

          //   const uriArray = Promise.all(
          //     Array(colorVariety).map(async () => await uploadImage(binString)),
          //   )
          //   if ((await uriArray).length > 0) {
          //     console.log(await uriArray)
          //     return await uriArray
          //   }
          //   // {
          //   //   item[1].varieties[snakeCaseRGB(randomColor)] = {
          //   //     _id: nanoid(),
          //   //     origColorCode: colorCode,
          //   //     newColorCode: snakeCaseRGB(randomColor),
          //   //     imageUri:
          //   // }
        }),
      )
      //return array of refIDs or refPaths/URls so we can get downloadURLs in next step and store them to firebase db
      // This is only safe to cache when a timeframe is defined
      if ((await randomizedUris).length > 0) {
        res.setHeader("cache-control", `public, max-age=${maxAge}`)

        res.send(JSON.stringify(await randomizedUris))
      } else {
        res.statusCode = 405
      }
      //   res.send(
      //       `<!DOCTYPE html>
      //       <html>
      //       File saved at: <a href="file://${fileName}_cv.png">${fileRoot}${fileName}_cv.png</a>
      //       </html>
      //       `,)
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
