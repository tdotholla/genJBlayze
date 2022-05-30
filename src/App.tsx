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

  const onClick = async () => {
    if (userImage) {
      const uri = await uploadImage(userImage)
      uri && setImageURI(uri)
      console.log(imageURI)
    } else {
      setErrorMsg("No Image Seleted")
    }
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
            <Button onClick={onClick}>Upload</Button>
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
