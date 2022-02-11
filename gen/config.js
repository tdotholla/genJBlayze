// const layersOrder = [
//     { name: 'background', number: 1 },
//     { name: 'shine', number: 1 },
//     { name: 'ball', number: 2 },
//     { name: 'iris', number: 3 },
//     { name: 'bottom lid', number: 3 },
//     { name: 'top lid', number: 3 },
//     { name: 'eye color', number: 12 },
// ];
var layersOrder = [
    { name: 'nameplate', number: 1 },
    // { name: 'background', number: 2 },
    { name: 'face', number: 1 },
    { name: 'hair', number: 1 },
    { name: 'moustache', number: 1 },
    { name: 'eyebrows', number: 1 },
    { name: 'goatee', number: 1 },
    { name: 'nose', number: 1 },
    { name: 'eyes', number: 1 },
    { name: 'teeth', number: 1 },
    { name: 'pupils', number: 1 },
    { name: 'lips', number: 1 },
    { name: 'blunt_body', number: 1 },
    { name: 'blunt_smoke', number: 2 },
];
// const format = {
//     width: 230,
//     height: 230
// };
var format = {
    width: 540,
    height: 720 // 14400
};
var rarity = [
    { key: "", val: "original" },
    { key: "_r", val: "rare" },
    { key: "_sr", val: "super rare" },
];
var defaultEdition = 6;
export { layersOrder, format, rarity, defaultEdition };
