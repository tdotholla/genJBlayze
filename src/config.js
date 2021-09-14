// const layersOrder = [
//     { name: 'background', number: 1 },
//     { name: 'shine', number: 1 },
//     { name: 'ball', number: 2 },
//     { name: 'iris', number: 3 },
//     { name: 'bottom lid', number: 3 },
//     { name: 'top lid', number: 3 },
//     { name: 'eye color', number: 12 },
// ];

const layersOrder = [
    { name: 'nameplate', number: 1 },
    // { name: 'background', number: 2 },
    { name: 'face', number: 3 },
    { name: 'hair', number: 4 },
    { name: 'moustache', number: 5 },
    { name: 'eyebrows', number: 6 },
    { name: 'goatee', number: 7 },
    { name: 'nose', number: 8 },
    { name: 'eyes', number: 9 },
    { name: 'teeth', number: 10 },
    { name: 'pupils', number: 11 },
    { name: 'lips', number: 12 },
    { name: 'blunt_body', number: 13 },
    { name: 'blunt_smoke', number: 14 },
];
  
// const format = {
//     width: 230,
//     height: 230
// };

const format = {
  width: 540,
  height: 720
}

const rarity = [
    { key: "", val: "original" },
    { key: "_r", val: "rare" },
    { key: "_sr", val: "super rare" },
];

const defaultEdition = 12;

module.exports = { layersOrder, format, rarity, defaultEdition };