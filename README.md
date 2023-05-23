
<!--- These are examples. See https://shields.io for others or to customize this set of shields. You might want to include dependencies, project status and license info here --->
![Github License](https://img.shields.io/github/license/kiel-h-byrne/genJBlayze)
![Node Version](https://img.shields.io/node/v/canary)

![GitHub repo size](https://img.shields.io/github/repo-size/kiel-h-byrne/genJBlayze)
![Github code size](https://img.shields.io/github/languages/code-size/kiel-h-byrne/genJBlayze)
![Github Languages](https://img.shields.io/github/languages/count/kiel-h-byrne/genJBlayze)
![Github Top Language](https://img.shields.io/github/languages/top/kiel-h-byrne/genJBlayze)

![GitHub Issues](https://img.shields.io/github/issues-raw/kiel-h-byrne/genJBlayze)
![GitHub contributors](https://img.shields.io/github/contributors/kiel-h-byrne/genJBlayze)
![Github Last Commit](https://img.shields.io/github/last-commit/kiel-h-byrne/genJBlayze)

# genBlayze
Create generative art by using the canvas api and node js
---


---

<img width="80%" src="https://github.com/tdotholla/genBlayze/blob/main/src/preview.png" />
### [Visit](https://jusblayze.kielbyrne.com/)
<!-- ![Vercel](https://vercelbadge.vercel.app/api/kielbyrne/gen-blayze?style=for-the-badge) -->

## Installation
generate: `yarn gen`
`yarn runit`
_watch out for changes to tsconfig.json and `noEmit: false` changing to true_

## Usage

Create your different layers as folders in the 'layers' directory, and add all the layer assets in these directories. Optionally, append '_r' and '_sr' to the layer file names to make those layer files rare or super rare respectively. 

*Example:* If you had an ball layer you would create a ball directory, and then a file might be called:

- `red_eye_ball_sr.png`
- `red_eye_ball_r.png`
- `red_eye_ball.png`

> Rarity is customizable in `src/config.js`.

Once you have all your layers, go into `src/config.js` and update the `layersOrder` array to be your layer folders name in order of the back layer to the front layer.

*Example:* If you were creating a portrait design, you might have a background, then a head, a mouth, eyes, eyewear, and then headwear, so your `layersOrder` would look something like this:

```
const layersOrder = [
    { name: 'background', number: 1 },
    { name: 'ball', number: 2 },
    { name: 'eye color', number: 12 },
    { name: 'iris', number: 3 },
    { name: 'shine', number: 1 },
    { name: 'bottom lid', number: 3 },
    { name: 'top lid', number: 3 },
];
```

The `name` of each layer object represents the name of the folder (in `/layers/`) that the images reside in. The `number` of each layer object represents the total number of image files you want to select from (possibly including blanks.) For instance, if you have three images in a layer folder and want to pick one of those each time, the `number` should be `3`. If you have a single image in a layer that you want to increase the rarity of to 1 in 100, the `number` for that layer should be `100`. In this case, 99 times out of 100, you will get a completely transparent layer.

Then optionally, update your `format` size, ie the outputted image size, and the defaultEdition, which is the amount of variation outputted.

When you are all ready, run the following command and your outputted art will be in the `build` directory:

```
npm run build

```



# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).



