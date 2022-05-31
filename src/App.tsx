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
  Flex,
} from "@chakra-ui/react"
import { BaseSyntheticEvent, useState } from "react"
import "./App.css"
import { uploadImage } from "./db/firebase"

//get length
const BASE_PATH = `/gallery/`
const IMAGES: string[] = new Array(10)
for (let index = 0; index < IMAGES.length; index++) {
  IMAGES[index] = `${BASE_PATH}${index + 1}.png`
}

function App() {
  const [userImage, setUserImage] = useState({} as File)
  const [imageURI, setImageURI] = useState("")
  const [previewURI, setPreviewURI] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [layerImages, setLayerImages] = useState([])

  const onClickUpload = async () => {
    if (userImage) {
      const uri = await uploadImage(userImage)
      uri && setImageURI(uri)
    } else {
      setErrorMsg("No Image Seleted")
    }
  }
  const getLayers = async () => {
    // post image to url, get response back,
    // response is array of images and metadata
    // Example POST method implementation:
    // Default options are marked with *
    const POST_URI =
      "https://us-central1-shop-mocknstock.cloudfunctions.net/app/get-image-layers"
    const data = {
      imageUrl: imageURI,
      fuzz: "1%",
      numDominantColorsToExtract: 5,
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
        return response.json()
      })
      .then((data) => data)
      .catch((err) => console.log("error", err))
    setLayerImages(response.urls) // parses JSON response into native JavaScript objects
  }

  return (
    <Box className="App">
      <Center marginBlock="10">
        <Box>
          <FormControl isInvalid={!!errorMsg} isRequired>
            <FormLabel htmlFor="imgUpload">Upload File:</FormLabel>
            {previewURI && (
              <Box>
                <Img src={previewURI} border={"1px solid red"} p={9} />
              </Box>
            )}
            <Input
              id="imgUpload"
              type="file"
              accept=".png, .jpg, .tiff, .tif, .gif"
              onChange={(e: BaseSyntheticEvent) => {
                setUserImage(e.target.files[0])
                const reader = new FileReader()
                reader.onload = (ev) =>
                  ev.target?.result && setPreviewURI(ev.target.result as any)
                reader.readAsDataURL(e.target.files[0])
              }}
            />
            {previewURI && <Button onClick={onClickUpload}>Upload</Button>}
            {imageURI && <Button onClick={getLayers}>Get Layers</Button>}
            {console.log(layerImages)}
            {layerImages?.length > 0 && (
              <Flex style={{ overflowX: "scroll" }}>
                <Grid templateColumns="repeat(5, 1fr)" gap={5}>
                  {layerImages.map((url) => (
                    <GridItem>
                      <Image src={url} />
                    </GridItem>
                  ))}
                </Grid>
              </Flex>
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
