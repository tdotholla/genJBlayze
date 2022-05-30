import { Box, SimpleGrid, Image, Center } from "@chakra-ui/react";
import "./App.css";

//get length
const BASE_PATH = `/gallery/`;
const IMAGES: string[] = new Array(10);
for (let index = 0; index < IMAGES.length; index++) {
  IMAGES[index] = `${BASE_PATH}${index + 1}.png`;
}

function App() {
  return (
    <Box className="App">
      <Center>
        <input type="file" accept=".png, .jpg, .tiff, .tif, .gif" />
        <button>Upload</button>
      </Center>
      <SimpleGrid columns={2}>
        {IMAGES.map((path) => (
          <Center>
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

export default App;
