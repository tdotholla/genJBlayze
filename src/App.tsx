import * as React from 'react';
import './App.css';
import { Box, SimpleGrid, Image, Center } from '@chakra-ui/react';
import {defaultEdition} from "../gen/config"
//get length
const BASE_PATH = `/gallery/`
const IMAGES: string[] = new Array(defaultEdition)
for (let index = 0; index < IMAGES.length; index++) {
  IMAGES[index] = `${BASE_PATH}${index + 1}.png`;
}

function App() {
  return (
    <Box className="App">
      <SimpleGrid columns={2}>
        {IMAGES.map(path => (<Center> <Box height="512" m={33} p={33} border="1px solid red" borderRadius={33} boxShadow="0 0 0.75rem crimson"><Image src={path} maxHeight="100%" /></Box></Center>))}
      </SimpleGrid>
    </Box>
  );
}

export default App;
