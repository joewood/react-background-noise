# react-background-noise

Simple component that renders a Perlin Noise Classical pattern as a background image. The render is cached to speed re-renders.

Taken from Sean McCullough's [port](https://gist.github.com/banksean/304522). Which was based off of Stefan Gustavson's [Java implementation and Paper](http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf)

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

See **test** directory for more examples.

![screen-grab](test/react-background.png)

## Additional Properties

Property       | Description
---------------|------------
gridSize       | The size of the grid for the turbelence pattern. Defaults to 16
contrast       | `{r:number,g:number,b:number}` - each color constituent has a value 0-255. Used to reduce the contrast of the pattern. Defaults to `{r:16,g:16,b:16}`.
brightness     | `{r:number,g:number,b:number}` - each color constituent has a value 0-255. Used to make the pattern lighter. Defaults to `{r:24,g:25,b:24}`


