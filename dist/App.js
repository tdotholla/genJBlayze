import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './App.css';
import { Box, SimpleGrid, Image, Center } from '@chakra-ui/react';
const BASE_PATH = `/gallery/`;
const IMAGES = new Array(4);
for (let index = 0; index < IMAGES.length; index++) {
    IMAGES[index] = `${BASE_PATH}${index + 1}.png`;
}
function App() {
    return (_jsx(Box, Object.assign({ className: "App" }, { children: _jsx(SimpleGrid, Object.assign({ columns: 2 }, { children: IMAGES.map(path => (_jsxs(Center, { children: [" ", _jsx(Box, Object.assign({ height: "512", m: 33, p: 33, border: "1px solid red", borderRadius: 33, boxShadow: "0 0 0.75rem crimson" }, { children: _jsx(Image, { src: path, maxHeight: "100%" }, void 0) }), void 0)] }, void 0))) }), void 0) }), void 0));
}
export default App;
