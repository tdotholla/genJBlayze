import { initializeImageMagick, ImageMagick } from "@imagemagick/magick-wasm"
import { AlphaOption } from "@imagemagick/magick-wasm/alpha-option"
import { CompositeOperator } from "@imagemagick/magick-wasm/composite-operator"
import { MagickFormat } from "@imagemagick/magick-wasm/magick-format"
import { writeFileSync } from "fs"
import { writeFile } from "fs"
import { NextApiRequest, NextApiResponse } from "next"
import path from "path"

const buildDir = `${process.env.PWD}/public/gallery`

const imHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  let msg = "well done...."
  switch (method) {
    case "GET":
      initializeImageMagick()
        .then(async () => {
          console.log("in test...")
          ImageMagick.read("logo:", (image) => {
            image.resize(100, 100)
            image.blur(1, 50)
            image.composite(image, CompositeOperator.Darken, "")
            console.log(image.format)
            console.log(image.backgroundColor)

            image.write((data) => {
              // console.log(data)
              writeFile(`${buildDir}/testfile.png`, data, "binary", (err) => {
                if (err) {
                  console.error(err.message)
                } else {
                  console.log("img written successfully")
                }
              })
              console.log(data.length)
            }, MagickFormat.Webp)
          })
        })
        .catch((err) => {
          console.error(err)
        })
      res.send(msg)
      break
    case "POST":
      break
    default:
      res.setHeader("Allow", ["GET", "POST"])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
export default imHandler
