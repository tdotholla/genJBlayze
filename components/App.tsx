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
  Progress,
  Text,
} from "@chakra-ui/react"
import { BaseSyntheticEvent, useState } from "react"
import { artworkCreate, storeImage } from "./db/firebase"

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
  const [fuzzNum, setFuzzNum] = useState(0)
  const [colorsNum, setColorsNum] = useState(0)

  type IUploadSettings = {
    imageUrl: string | undefined
    fuzz: number
    numDominantColorsToExtract: number
  }

  const onClickUpload = async () => {
    setUploadStatus("STORING IMAGE...")
    if (userImage) {
      const imageUrl = await storeImage(userImage)
      const metadata = {
        imageUrl,
        fuzz: fuzzNum,
        numDominantColorsToExtract: colorsNum,
      }
      setUploadStatus("UPLOADING DOCUMENT....")
      const awid = await artworkCreate({ sourceImageUri: imageUrl })
      setProjectId(awid)
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
    setUploadStatus("")
  }
  const assembleImages = async () => {
    // get urls of each layer, save to fs in certain way, then run generate script
    const response = await fetch("./api/gen", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "same-origin", // no-cors, *cors, same-origin
      // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      // redirect: "follow", // manual, *follow, error
      // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(layerImages), // body data type must match "Content-Type" header
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
    console.log(response)
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
                {layerImages.map((url) => (
                  <GridItem key={url}>
                    <Image src={url} alt="Layer Image" />
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
      </SimpleGrid>
    </Box>
  )
}

export default App
