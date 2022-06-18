import {
  Box,
  Image,
  Center,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Img,
  Grid,
  GridItem,
  FormHelperText,
  Progress,
  Divider,
  Text,
} from "@chakra-ui/react"
import { nanoid } from "nanoid"
import { BaseSyntheticEvent, useState } from "react"
import { updateArtworkSet, storeImage } from "./db/firebase"
import { ILayerData, IUploadSettings } from "./types"

//get length
const BASE_PATH = `/gallery/`
const POST_URI =
  "https://us-central1-shop-mocknstock.cloudfunctions.net/app/get-image-layers"
const IMAGES: string[] = new Array(10)
for (let index = 0; index < IMAGES.length; index++) {
  IMAGES[index] = `${BASE_PATH}${index + 1}.png`
}

function App() {
  const [userImage, setUserImage] = useState(null)
  // const [imageURI, setImageURI] = useState("")
  const [previewURI, setPreviewURI] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [projectId, setProjectId] = useState("")
  const [uploadStatus, setUploadStatus] = useState("")
  const [layerImages, setLayerImages] = useState([])
  const [layerUris, setLayerUris] = useState([])
  const [metadata, setMetaData] = useState({} as ILayerData)
  const [fuzzNum, setFuzzNum] = useState(0)
  const [colorsNum, setColorsNum] = useState(0)

  const onClickUpload = async () => {
    setUploadStatus("STORING IMAGE...")
    if (userImage) {
      const imageUrl = await storeImage(userImage)
      setUploadStatus("UPLOADING DOCUMENT....")
      const _id = await updateArtworkSet({ sourceImageUri: imageUrl })
      const metadata = {
        _id,
        imageUrl,
        fuzz: `${fuzzNum}%`,
        numDominantColorsToExtract: colorsNum,
      }
      setProjectId(_id)
      setUploadStatus("GETTING LAYERS....")
      // uri && setImageURI(uri)
      imageUrl && getLayers(metadata)
    } else {
      setErrorMsg("No Image Seleted")
    }
  }

  const onFileInputChange = (e: BaseSyntheticEvent) => {
    setPreviewURI("")
    setUserImage(null)
    const file = e.target.files[0]
    setUserImage(file)
    const reader = new FileReader()
    reader.onload = (ev) =>
      ev.target?.result && setPreviewURI(ev.target.result as string)
    reader.readAsDataURL(file)
    if (file.size > 1234567) {
      console.warn("BIG FILE!!!", file.size)
    }
  }

  const getLayers = async ({
    _id,
    imageUrl,
    fuzz,
    numDominantColorsToExtract,
  }: IUploadSettings) => {
    // post image to url, get response back,
    // response is array of images and metadata
    // Example POST method implementation:
    // Default options are marked with *
    setLayerImages([])
    const data = {
      imageUrl,
      fuzz,
      numDominantColorsToExtract,
      isWhiteTransparent: true,
      // filename
    }

    const response = await fetch(POST_URI, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      // redirect: "follow", // manual, *follow, error
      // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
      .then((resp) => {
        if (!resp.ok) {
          return resp.text().then((result) => Promise.reject(new Error(result)))
        }
        setUploadStatus("FETCHING LAYERS....")
        return resp.json()
      })
      .then((data) => data)
      .catch((err) => {
        setErrorMsg("Error Fetching Layers: " + err.message)
        console.error("error", err)
      })

    console.info("::-LAYERS RESPONSE-::")
    console.info(response)
    // setLayerImages(response.urls) // parses JSON response into native JavaScript objects

    const layerData: ILayerData = {}
    response.urls.map(async (url: string, i: number) => {
      layerData[response.dominantColors[i].hexCode] = {
        _id: await nanoid(),
        depthNumber: i,
        imageUri: url,
        rarity: "normal",
      }
    })
    setLayerImages(response.urls)
    setMetaData(layerData)
    updateArtworkSet({ _id, layers: layerData }) // use swr here
  }
  /**
   * sends an array of layer urls to server, receives and returns an array of objects containing metadata about each iteration, the source layer, etc.
   * after randomizing layers, the next step is to randomly assemble each layer to create new images of N size.
   */
  const randomizeLayers = async () => {
    console.log("::-SENDING TO SERVER-::")
    console.log(metadata)
    //convert images but ideally recieve downloadURLs when finished...
    const response = await fetch("/api/gen", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      // redirect: "follow", // manual, *follow, error
      // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(metadata), // body data type must match "Content-Type" header
    })
      .then((resp) => {
        if (!resp.ok) {
          return resp.text().then((result) => Promise.reject(new Error(result)))
        }
        setUploadStatus("RANDOMIZING LAYERS....")
        return resp.json()
      })
      .then((data) => data)
      .catch((err) => {
        setErrorMsg("Error Creating Layers: " + err.message)
        console.error("error", err)
      })

    console.info("::-RANDOMIZATION RESPONSE-::")
    response && response.length > 0 && setLayerUris(response)

    //check status and get URLs for randomized images, then upload to db, display results in view?
    // then generate random images from layerImages
  }
  return (
    <Box className="App">
      <Center marginBlock="10">
        <Box>
          <FormControl isInvalid={!!errorMsg} isRequired>
            <FormLabel width={"50%"} htmlFor="imgUpload">
              Upload File:
            </FormLabel>
            <Input
              id="imgUpload"
              type="file"
              accept=".png, .jpg, .tiff, .tif, .gif"
              onChange={onFileInputChange}
            />
            {previewURI && (
              <Box>
                <Img src={previewURI} border={"1px solid red"} p={9} />
                <Divider w={"80%"} />
                <FormLabel width={"50%"} id="fuzzNum">
                  Amount of Fuzz (0-100%)
                </FormLabel>
                <Input
                  id="fuzzNum"
                  type="number"
                  min={0}
                  max={100}
                  step={10}
                  onChange={(ev) => setFuzzNum(Number(ev.target.value))}
                />
                <FormLabel width={"50%"}>Amount of Colors (layers)</FormLabel>
                <Input
                  id="colorsNum"
                  type="number"
                  min={2}
                  max={20}
                  onChange={(ev) => setColorsNum(Number(ev.target.value))}
                />
                <Button onClick={onClickUpload}>Get Layers</Button>
                <FormHelperText>{uploadStatus}</FormHelperText>
                {uploadStatus && <Progress size="xs" isIndeterminate />}
              </Box>
            )}
            {projectId && <Text>Project ID: {projectId}</Text>}
            {layerImages?.length > 0 && (
              <Grid
                templateColumns="repeat(3, 1fr)"
                gap={5}
                overflowX="scroll"
                width="100vw"
              >
                {layerImages?.map((url) => (
                  <GridItem key={url}>
                    <Image src={url} alt="Layer Image" />
                  </GridItem>
                ))}
              </Grid>
            )}
            {layerImages.length > 0 && (
              <Button
                onClick={() => {
                  randomizeLayers()
                }}
              >
                Assemble Images
              </Button>
            )}
            {layerUris?.length > 0 && (
              <Grid
                templateColumns="repeat(3, 1fr)"
                gap={5}
                overflowX="scroll"
                width="100vw"
              >
                {layerUris?.map((url) => (
                  <GridItem key={url}>
                    <Image src={url} alt="Layer Image" />
                  </GridItem>
                ))}
              </Grid>
            )}

            {errorMsg && <FormErrorMessage>{errorMsg}</FormErrorMessage>}
          </FormControl>
        </Box>
      </Center>
      {/* <SimpleGrid columns={2}>
        {IMAGES.map((path) => (
          <Center key={path}>
            <Box
              height="512"
              m={33}
              p={33}
              border="1px solid red"
              borderRadius={33}
              boxShadow="0 0 0.75rem crimson"
            >
              <Image
                alt="Gallery Image"
                src={path}
                maxHeight="100%"
                onError={(event) =>
                  (event.currentTarget.style.display = "none")
                }
              />
            </Box>
          </Center>
        ))}
      </SimpleGrid> */}
    </Box>
  )
}

export default App
