# react-background-noise

Simple component that renders a Perlin Noise Classical pattern as a background WebGL pattern. The render uses WebGL shader from [Stefan Gustavson](http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf)

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

See **test** directory for more examples. The below gif is limited by GIF compression artifacts and framerate, see the [mp4](docs/capture.mp4) for a better view. Here's an example of different zoom sizes:

![screen-grab](docs/capture-zoom.gif?raw=true)

And an example of adjusting the vertical offset:

![screen-grab](docs/capture-vert.gif?raw=true)


## Additional Properties

Property       | Description
---------------|------------
gridSize       | The size of the grid for the turbelence pattern. Defaults to 16
contrast       | `{r:number,g:number,b:number}` - each color constituent has a value 0-255. Used to reduce the contrast of the pattern. Defaults to `{r:16,g:16,b:16}`.
brightness     | `{r:number,g:number,b:number}` - each color constituent has a value 0-255. Used to make the pattern lighter. Defaults to `{r:24,g:25,b:24}`
scale          | Fraction as percent (0-1) of the inverse scale pattern. Use the test tool as a guide - 50% is 0.5.
offset         | `{x:number,y:number}` offset into the pattern. Defaults to 0,0. 


