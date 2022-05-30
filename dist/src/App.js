import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, SimpleGrid, Image, Center } from "@chakra-ui/react";
import "./App.css";
//get length
const BASE_PATH = `/gallery/`;
const IMAGES = new Array(10);
for (let index = 0; index < IMAGES.length; index++) {
    IMAGES[index] = `${BASE_PATH}${index + 1}.png`;
}
function App() {
    return (_jsxs(Box, Object.assign({ className: "App" }, { children: [_jsxs(Center, { children: [_jsx("input", { type: "file", accept: ".png, .jpg, .tiff, .tif, .gif" }), _jsx("button", { children: "Upload" })] }), _jsx(SimpleGrid, Object.assign({ columns: 2 }, { children: IMAGES.map((path) => (_jsx(Center, { children: _jsx(Box, Object.assign({ height: "512", m: 33, p: 33, border: "1px solid red", borderRadius: 33, boxShadow: "0 0 0.75rem crimson" }, { children: _jsx(Image, { src: path, maxHeight: "100%", onError: (event) => (event.currentTarget.style.display = "none") }) })) }))) }))] })));
}
export default App;
//# sourceMappingURL=App.js.map