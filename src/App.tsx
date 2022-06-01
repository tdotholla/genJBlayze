import {
  Box,
  SimpleGrid,
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

} from "@chakra-ui/react"
import { BaseSyntheticEvent, useState } from "react"
import "./App.css"
import { uploadImage } from "./db/firebase"

//get length
const BASE_PATH = `/gallery/`
const POST_URI =
  "https://us-central1-shop-mocknstock.cloudfunctions.net/app/get-image-layers"
const IMAGES: string[] = new Array(10)
for (let index = 0; index < IMAGES.length; index++) {
  IMAGES[index] = `${BASE_PATH}${index + 1}.png`
}

function App() {
  const [userImage, setUserImage] = useState({} as File)
  // const [imageURI, setImageURI] = useState("")
  const [previewURI, setPreviewURI] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [uploadStatus, setUploadStatus] = useState("")
  const [layerImages, setLayerImages] = useState([])
  const [fuzzNum, setFuzzNum] = useState(0)
  const [colorsNum, setColorsNum] = useState(0)

  type ILayers = {
    imageUrl: string | undefined
    fuzz: number
    numDominantColorsToExtract: number
  }

  const onClickUpload = async () => {
    setUploadStatus("UPLOADING...")
    if (userImage) {
      const imageUrl = await uploadImage(userImage)
      const metadata = {
        imageUrl,
        fuzz: fuzzNum,
        numDominantColorsToExtract: colorsNum,
      }
      setUploadStatus("GETTING LAYERS....")
      // uri && setImageURI(uri)
      imageUrl && getLayers(metadata)
    } else {
      setErrorMsg("No Image Seleted")
    }
  }
  const onFileInputChange = (e: BaseSyntheticEvent) => {
    const file = e.target.files[0]
    setUserImage(file)
    const reader = new FileReader()
    reader.onload = (ev) =>
      ev.target?.result && setPreviewURI(ev.target.result as any)
    reader.readAsDataURL(file)
    if (file.size > 1234567) {
      console.warn("BIG FILE!!!", file.size)
    }
  }

  const getLayers = async ({
    imageUrl,
    fuzz,
    numDominantColorsToExtract,
  }: ILayers) => {
    // post image to url, get response back,
    // response is array of images and metadata
    // Example POST method implementation:
    // Default options are marked with *

    const data = {
      imageUrl,
      fuzz,
      numDominantColorsToExtract,
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
      .then((response) => {
        if (!response.ok) {
          return response
            .text()
            .then((result) => Promise.reject(new Error(result)))
        }
        setUploadStatus("DISPLAYING LAYERS....")
        return response.json()
      })
      .then((data) => data)
      .catch((err) => {
        setErrorMsg("Error Fetching Layers: " + err.message)
        console.error("error", err)
      })
    setLayerImages(response.urls) // parses JSON response into native JavaScript objects
  }
  const assembleImages = async () => {
    // get urls of each layer, save to fs in certain way, then run generate script
  }
  return (
    <Box className="App">
      <Center marginBlock="10">
        <Box>
          <FormControl isInvalid={!!errorMsg} isRequired>
            {previewURI && (
              <Box>
                <Img src={previewURI} border={"1px solid red"} p={9} />
              </Box>
            )}
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
                <FormLabel width={"50%"}>Amount of Fuzz</FormLabel>
                <Input
                  id="fuzzNum"
                  type="number"
                  min={0}
                  max={2000}
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
              </Box>
            )}
            {layerImages?.length > 0 && (
              <Grid templateColumns="repeat(5, 1fr)" gap={5}>
                {layerImages.map((url) => (
                  <GridItem>
                    <Image src={url} />
                  </GridItem>
                ))}
              </Grid>
            )}
            {layerImages && (
              <Button onClick={() => assembleImages()}>Assemble Images</Button>
            )}
            {errorMsg && <FormErrorMessage>{errorMsg}</FormErrorMessage>}
          </FormControl>
        </Box>
      </Center>
      <SimpleGrid columns={2}>
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
                src={path}
                maxHeight="100%"
                onError={(event) =>
                  (event.currentTarget.style.display = "none")
                }
              />
            </Box>
          </Center>
        ))}
      </SimpleGrid>
    </Box>
  )
}

export default App
