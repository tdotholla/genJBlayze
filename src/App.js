import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, SimpleGrid, Image, Center } from '@chakra-ui/react';
import './App.css';

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
//get length
var BASE_PATH = "/gallery/";
var IMAGES = new Array(20);
for (var index = 0; index < IMAGES.length; index++) {
    IMAGES[index] = "" + BASE_PATH + (index + 1) + ".png";
}
function App() {
    return (_jsx(Box, __assign({ className: "App" }, { children: _jsx(SimpleGrid, __assign({ columns: 2 }, { children: IMAGES.map(function (path) { return (_jsxs(Center, { children: [" ", _jsx(Box, __assign({ height: "512", m: 33, p: 33, border: "1px solid red", borderRadius: 33, boxShadow: "0 0 0.75rem crimson" }, { children: _jsx(Image, { src: path, maxHeight: "100%" }, void 0) }), void 0)] }, void 0)); }) }), void 0) }), void 0));
}
export default App;
