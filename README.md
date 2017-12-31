# React Background Noise

Simple component that renders a Perlin Noise Classical pattern as a background WebGL pattern. The render uses WebGL shader from [Stefan Gustavson](http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf)

See [demo here](https://joewood.github.com/react-background-noise).

The below gif is limited by GIF compression artifacts and framerate, see the [mp4](https://github.com/joewood/react-background-noise/raw/master/docs/capture.mp4?raw=true) for a better view. Here's an example of different zoom sizes:

<video width="600" height="600" controls> 
  <source src="https://github.com/joewood/react-background-noise/raw/master/docs/capture.mp4?raw=true" type="video/mp4">
</video>

![screen-grab](https://github.com/joewood/react-background-noise/raw/master/docs/capture-zoom.gif?raw=true)

And an example of adjusting the vertical offset:

![screen-grab](https://github.com/joewood/react-background-noise/raw/master/docs/capture-vert.gif?raw=true)

## Installation

```
npm install react-background-noise
```

## Usage

```jsx
import Background from "react-background-noise"

<Background gridSize={32}>
  <div style={{color:"white"}}>Hello World</div>
</Background>
```

## Additional Properties

| Property   | Description                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| gridSize   | The size of the grid for the turbelence pattern. Defaults to 16                                                                                        |
| contrast   | `{r:number,g:number,b:number}` - each color constituent has a value 0-255. Used to reduce the contrast of the pattern. Defaults to `{r:16,g:16,b:16}`. |
| brightness | `{r:number,g:number,b:number}` - each color constituent has a value 0-255. Used to make the pattern lighter. Defaults to `{r:24,g:25,b:24}`            |
| scale      | Fraction as percent (0-1) of the inverse scale pattern. Use the test tool as a guide - 50% is 0.5.                                                     |
| offset     | `{x:number,y:number}` offset into the pattern. Defaults to 0,0.                                                                                        |
