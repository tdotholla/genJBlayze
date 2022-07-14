import { getDownloadURL, ref, uploadString } from "firebase/storage"
import { convert } from "imagemagick"
import { NextApiRequest, NextApiResponse } from "next"
import { join } from "path"
import { cwd } from "process"
import { promisify } from "util"
import { fbStorage } from "../../../components/db/firebase"
import { ILayerData } from "../../../components/types"
import { nanoid } from "nanoid"

import { getFileName, getRandomRGBA, isDev, snakeCaseRGB } from "../../../components/utils"

const IM_TMP_PATH = isDev() ? "convert" : join(cwd(), "gallery")
const MAX_AGE = 1 * 24 * 60 * 60

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
  
        const konvert = promisify(convert)
    /**
     *   '000000': {
     _id: 'nMLLdR6mjLAnDO-sxQtu-',
     depthNumber: 0,
     imageUri: 'https://storage.googleapis.com/shop-mocknstock.appspot.com/43ce5167-a478-4bc8-97ce-18dfa661e5bc.png-000000.png',
     rarity: 'normal'
    }
    */
    let randomizedUris = Promise<any[]>
    // let newobj = {}
  
    const uploadImage = async ({
      binaryString,
      fileName,
      id,
    }: {
      binaryString: BinaryType
      fileName: string
      id: string
    }) => {
      const storageRef = ref(fbStorage, `/uploads/${id}/${fileName}`)
      if (binaryString) {
        const bufString = Buffer.from(binaryString, "binary").toString("base64")
        await uploadString(storageRef, bufString, "base64", {
          contentType: "image/png",
        })
        return await getDownloadURL(storageRef)
      } else {
        console.log(fileName)
        // read file and upload?
        // uploadBytes(storageRef, filePath)
      }
    }
  
    switch (method) {
      case "POST":
        if (!body) return res.status(400).send("You must write something")
        convert.path = IM_TMP_PATH
        console.log("inside im path", convert.path)
        // take each uri and convert them x times
        randomizedUris = Promise.all(
          Object.entries(body as ILayerData).map(async function (item) {
            const colorCode = item[0]
            const { imageUri, colorVariety, _rid } = item[1]
  
            return await Promise.all(
              Array.from(Array(colorVariety)).map(async () => {
                const randomColor = getRandomRGBA()
                const snakedColor = snakeCaseRGB(randomColor)
                const fileName = `${getFileName(
                  imageUri,
                )}_${colorCode}-${snakedColor}.png`
                console.log(fileName)
                try {
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
                  ]).then(async (binString) => {
                    const imageUri = await uploadImage({
                      binaryString: binString as BinaryType,
                      fileName,
                      id: _rid,
                    })
                      const _id = await nanoid();
                    console.log("imageUri: " + imageUri)
                    return {
                      _id,
                      origColorCode: colorCode,
                      newColorCode: snakedColor,
                      imageUri,
                    }
                  })
                } catch (error) {
                  console.error("APP ERROR: Konvert failure" + error)
                  return error
                }
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
          res.setHeader("cache-control", `public, max-age=${MAX_AGE}`)
  
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
  
export  default randomizeLayersHandler