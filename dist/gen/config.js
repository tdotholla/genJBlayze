const layersOrder = [
    { name: 'nameplate', number: 1 },
    { name: 'face', number: 1 },
    { name: 'hair', number: 1 },
    { name: 'moustache', number: 1 },
    { name: 'eyebrows', number: 1 },
    { name: 'goatee', number: 2 },
    { name: 'nose', number: 1 },
    { name: 'eyes', number: 1 },
    { name: 'teeth', number: 1 },
    { name: 'pupils', number: 1 },
    { name: 'lips', number: 1 },
    { name: 'blunt_body', number: 4 },
    { name: 'blunt_smoke', number: 4 },
];
const format = {
    width: 540,
    height: 720
};
const rarity = [
    { key: "", val: "original" },
    { key: "_r", val: "rare" },
    { key: "_sr", val: "super rare" },
];
const defaultEdition = 4;
export { layersOrder, format, rarity, defaultEdition };
