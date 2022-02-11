var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as fs from "fs";
import canvasPkg from "canvas";
import console from "console";
import { layersOrder, format, rarity } from "./config";
var createCanvas = canvasPkg.createCanvas, loadImage = canvasPkg.loadImage;
var canvas = createCanvas(format.width, format.height);
var ctx = canvas.getContext("2d");
if (!process.env.PWD) {
    process.env.PWD = process.cwd();
}
var buildDir = process.env.PWD + "/build";
var metDataFile = '_metadata.json';
var layersDir = process.env.PWD + "/layers";
var metadata = [];
var attributes = [];
var hash = [];
var decodedHash = [];
var addRarity = function (_str) {
    var itemRarity;
    rarity.forEach(function (r) {
        if (_str.includes(r.key)) {
            itemRarity = r.val;
        }
    });
    return itemRarity;
};
var cleanName = function (_str) {
    var name = _str.slice(0, -4);
    rarity.forEach(function (r) {
        name = name.replace(r.key, "");
    });
    return name;
};
var getImages = function (path) {
    return fs
        .readdirSync(path)
        .filter(function (item) { return !/(^|\/)\.[^\/\.]/g.test(item); })
        .map(function (i, index) {
        return {
            id: index + 1,
            name: cleanName(i),
            fileName: i,
            rarity: addRarity(i),
        };
    });
};
var layersSetup = function (layersOrder) {
    var layers = layersOrder.map(function (layerObj, index) { return ({
        id: index,
        name: layerObj.name,
        location: layersDir + "/" + layerObj.name + "/",
        images: getImages(layersDir + "/" + layerObj.name + "/"),
        position: { x: 0, y: 0 },
        size: { width: format.width, height: format.height },
        number: layerObj.number
    }); });
    return layers;
};
var buildSetup = function () {
    if (fs.existsSync(buildDir)) {
        fs.rmdirSync(buildDir, { recursive: true });
    }
    fs.mkdirSync(buildDir);
};
var saveLayer = function (_canvas, _edition) {
    fs.writeFileSync(buildDir + "/" + _edition + ".png", _canvas.toBuffer("image/png"));
};
var addMetadata = function (_edition) {
    var dateTime = Date.now();
    var tempMetadata = {
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
var addAttributes = function (_element, _layer) {
    var _a;
    var tempAttr = {
        id: _element.id,
        layer: _layer.name,
        name: _element.name,
        rarity: _element.rarity,
    };
    attributes.push(tempAttr);
    hash.push(_layer.id);
    hash.push(_element.id);
    decodedHash.push((_a = {}, _a[_layer.id] = _element.id, _a));
};
var drawLayer = function (_layer, _edition) { return __awaiter(void 0, void 0, void 0, function () {
    var rand, element, image;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rand = Math.random();
                element = _layer.images[Math.floor(rand * _layer.number)] ? _layer.images[Math.floor(rand * _layer.number)] : null;
                if (!element) return [3 /*break*/, 2];
                addAttributes(element, _layer);
                return [4 /*yield*/, loadImage("" + _layer.location + element.fileName)];
            case 1:
                image = _a.sent();
                ctx.drawImage(image, _layer.position.x, _layer.position.y, _layer.size.width, _layer.size.height);
                saveLayer(canvas, _edition);
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
var createFiles = function (edition) {
    var layers = layersSetup(layersOrder);
    var _loop_1 = function (i) {
        layers.forEach(function (layer) {
            drawLayer(layer, i);
        });
        addMetadata(i);
        console.log("Creating edition " + i);
    };
    for (var i = 1; i <= edition; i++) {
        _loop_1(i);
    }
};
var createMetaData = function () {
    fs.stat(buildDir + "/" + metDataFile, function (err) {
        if (err == null || err.code === 'ENOENT') {
            fs.writeFileSync(buildDir + "/" + metDataFile, JSON.stringify(metadata, null, 2));
            // console.log(JSON.stringify(metadata, null, 2))
        }
        else {
            console.log('Oh no, error: ', err.code);
        }
    });
};
export { buildSetup, createFiles, createMetaData };
