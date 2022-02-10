var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from "fs";
import { createCanvas, loadImage } from "canvas";
import console from "console";
import { layersOrder, format, rarity } from "./config";
const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");
if (!process.env.PWD) {
    process.env.PWD = process.cwd();
}
const buildDir = `../${process.env.PWD}/build`;
const metDataFile = '_metadata.json';
const layersDir = `${process.env.PWD}/layers`;
let metadata = [];
let attributes = [];
let hash = [];
let decodedHash = [];
const addRarity = (_str) => {
    let itemRarity;
    rarity.forEach((r) => {
        if (_str.includes(r.key)) {
            itemRarity = r.val;
        }
    });
    return itemRarity;
};
const cleanName = (_str) => {
    let name = _str.slice(0, -4);
    rarity.forEach((r) => {
        name = name.replace(r.key, "");
    });
    return name;
};
const getElements = (path) => {
    return fs
        .readdirSync(path)
        .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
        .map((i, index) => {
        console.log(i);
        return {
            id: index + 1,
            name: cleanName(i),
            fileName: i,
            rarity: addRarity(i),
        };
    });
};
const layersSetup = (layersOrder) => {
    const layers = layersOrder.map((layerObj, index) => ({
        id: index,
        name: layerObj.name,
        location: `${layersDir}/${layerObj.name}/`,
        elements: getElements(`${layersDir}/${layerObj.name}/`),
        position: { x: 0, y: 0 },
        size: { width: format.width, height: format.height },
        number: layerObj.number
    }));
    return layers;
};
const buildSetup = () => {
    if (fs.existsSync(buildDir)) {
        fs.rmdirSync(buildDir, { recursive: true });
    }
    fs.mkdirSync(buildDir);
};
const saveLayer = (_canvas, _edition) => {
    fs.writeFileSync(`${buildDir}/${_edition}.png`, _canvas.toBuffer("image/png"));
};
const addMetadata = (_edition) => {
    let dateTime = Date.now();
    let tempMetadata = {
        hash: hash.join(""),
        decodedHash: decodedHash,
        edition: _edition,
        date: dateTime,
        attributes: attributes,
    };
    metadata.push(tempMetadata);
    attributes = [];
    hash = [];
    decodedHash = [];
};
const addAttributes = (_element, _layer) => {
    let tempAttr = {
        id: _element.id,
        layer: _layer.name,
        name: _element.name,
        rarity: _element.rarity,
    };
    attributes.push(tempAttr);
    hash.push(_layer.id);
    hash.push(_element.id);
    decodedHash.push({ [_layer.id]: _element.id });
};
const drawLayer = (_layer, _edition) => __awaiter(void 0, void 0, void 0, function* () {
    const rand = Math.random();
    let element = _layer.elements[Math.floor(rand * _layer.number)] ? _layer.elements[Math.floor(rand * _layer.number)] : null;
    if (element) {
        addAttributes(element, _layer);
        const image = yield loadImage(`${_layer.location}${element.fileName}`);
        ctx.drawImage(image, _layer.position.x, _layer.position.y, _layer.size.width, _layer.size.height);
        saveLayer(canvas, _edition);
    }
});
const createFiles = (edition) => {
    const layers = layersSetup(layersOrder);
    for (let i = 1; i <= edition; i++) {
        layers.forEach((layer) => {
            drawLayer(layer, i);
        });
        addMetadata(i);
        console.log("Creating edition " + i);
    }
};
const createMetaData = () => {
    fs.stat(`${buildDir}/${metDataFile}`, (err) => {
        if (err == null || err.code === 'ENOENT') {
            fs.writeFileSync(`${buildDir}/${metDataFile}`, JSON.stringify(metadata, null, 2));
            // console.log(JSON.stringify(metadata, null, 2))
        }
        else {
            console.log('Oh no, error: ', err.code);
        }
    });
};
export { buildSetup, createFiles, createMetaData };
//# sourceMappingURL=main.js.map