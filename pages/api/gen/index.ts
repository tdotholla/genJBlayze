//post array of urls to api
// dl images from url
// store images in folders
// run generate commands with params
// upload images to store and return urls to all images

import { convert, resize } from "imagemagick"
import { NextApiRequest, NextApiResponse } from "next"
import path from "path"
const maxAge = 1 * 24 * 60 * 60

const randomizeLayersHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  // const db = await connectToDatabase();
  // db.createIndex("pullups", { location: "2dsphere" });
  const {
    //can send query params to sort & limit results
    query: { by, limit, lat, lng },
    method,
  } = req
  const fileRoot = path.join(process.cwd(), "./")
  const URI = "http://localhost:3000/gallery/1.png"
  switch (method) {
    case "GET":
      convert(
        [URI, "-resize", "25%", "public/temp/kittens-small.png"],
        function (err, stdout) {
          if (err) console.error(err)
          console.log("stdout:", stdout)
          res.send(JSON.stringify(`${fileRoot}public/temp/kittens-small.png`))
        },
      )
      // const pullups =
      //   lat && lng
      //     ? await getPullupsNearBy(
      //       db,
      //       { lat: Number(lat), lng: Number(lng) },
      //       by,
      //       limit ? parseInt(limit, 10) : 100
      //     )
      //     : await getPullUps(db);
      // if (lat && lng && pullups.length > 0) {
      //   // This is only safe to cache when a timeframe is defined
      //   res.setHeader("cache-control", `public, max-age=${maxAge}`);
      // }
      // res.send({ pullups })
      break
    case "POST":
      // if (!req.user) {
      //   return res.status(401).send('unauthenticated');
      // }

      if (!req.body) return res.status(400).send("You must write something")
      console.log(JSON.parse(req.body))
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