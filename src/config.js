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
    { name: 'background', number: 1 },
    { name: 'face', number: 2 },
    { name: 'hair', number: 3 },
    { name: 'moustache', number: 3 },
    { name: 'eyebrows', number: 3 },
    { name: 'goatee', number: 3 },
    { name: 'nose', number: 3 },
    { name: 'eyes', number: 3 },
    { name: 'teeth', number: 3 },
    { name: 'pupils', number: 4 },
    { name: 'lips', number: 4 },
    { name: 'blunt_body', number: 5 },
    { name: 'blunt_smoke', number: 6 },
];
  
// const format = {
//     width: 230,
//     height: 230
// };

const format = {
  width: 10800,
  height: 14400
}

const rarity = [
    { key: "", val: "original" },
    { key: "_r", val: "rare" },
    { key: "_sr", val: "super rare" },
];

const defaultEdition = 5;

module.exports = { layersOrder, format, rarity, defaultEdition };