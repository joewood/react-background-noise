import * as React from "react";
// Ported from Stefan Gustavson's java implementation
// http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
// Read Stefan's excellent paper for details on how this code works.
//

/**
 * You can pass in a random number generator object if you like.
 * It is assumed to have a random() method.
 */
export interface IProps {
    width: number;
    height: number;
    gridSize: number;
    /** Contrast filter, each color component as a value 0-255. Defaults to {r:16,b;16,g:16} */
    contrast?: { r: number, g: number, b: number };
    /** Brightness filter, each color component as a value 0-255. Defaults to {r:24,b;24,g:24} */
    brightness?: { r: number, g: number, b: number };
    customRandom?: { random(): number; };
}

export interface IState {
    image: ImageData;
}


export default class ClassicalNoise extends React.PureComponent<IProps, IState>{
    private canvas: HTMLCanvasElement;
    private dstCanvas: HTMLCanvasElement;

    private static grad3 = [
        [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
        [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
        [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
    ];
    private perm: number[] = [];
    private randomPoints: number[] = [];

    constructor(props: IProps) {
        super(props);
        const r = props.customRandom || Math;
        this.randomPoints = [];
        for (let i = 0; i < 256; i++) {
            this.randomPoints[i] = Math.floor(r.random() * 256);
        }
        // To remove the need for index wrapping, double the permutation table length 
        this.perm = [];
        for (let i = 0; i < 512; i++) {
            this.perm[i] = this.randomPoints[i & 255];
        }
        this.state = { image: this.updateImage(props) };
    }

    public componentWillReceiveProps(newProps: IProps) {
        this.setState({ image: this.updateImage(newProps) });
    }

    private updateImage(props: IProps): ImageData {
        // create a destination canvas. 
        const { contrast, brightness } = this.props;

        this.dstCanvas = document.createElement("canvas");
        this.dstCanvas.width = this.props.width;
        this.dstCanvas.height = this.props.height;

        // get context to work with
        const dstContext = this.dstCanvas.getContext("2d");

        // create image data
        const image = dstContext.getImageData(0, 0, this.dstCanvas.width, this.dstCanvas.height);// createImageData(dstCanvas.width / 2, dstCanvas.height / 2);
        const gridSize = props.gridSize || 16;

        const contrastR = (contrast && contrast.r || 16) / 256;
        const contrastG = (contrast && contrast.g || 16) / 256;
        const contrastB = (contrast && contrast.b || 16) / 256;
        const brightnessR = (brightness && brightness.r || 24);
        const brightnessG = (brightness && brightness.g || 24);
        const brightnessB = (brightness && brightness.b || 24);

        // iterate through pixel data (1 pixels consists of 4 ints in the array)
        for (var i = 0, len = image.data.length; i < len; i += 4) {
            var x = Math.floor((i / 4) % this.dstCanvas.width);
            var y = Math.floor((i / 4) / this.dstCanvas.width);

            // since n is -1..1, add +1 and multiply with 127 to get 0..255
            var n = (this.turbulence(x / gridSize, y / gridSize, 0, this.dstCanvas.width) + 1) * 127;

            image.data[i] = n * contrastR + brightnessR;
            image.data[i + 1] = n * contrastG + brightnessG;
            image.data[i + 2] = n * contrastB + brightnessB;
            image.data[i + 3] = 255;
        }
        dstContext.putImageData(image, 0, 0);
        return image;

    }

    private dot(vec: number[], x: number, y: number, z: number) {
        return vec[0] * x + vec[1] * y + vec[2] * z;
    }

    private mix(a: number, b: number, mixFactor: number) {
        return (1.0 - mixFactor) * a + mixFactor * b;
    }

    private fade(t: number) {
        return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
    };

    // Classic Perlin noise, 3D version 
    private noise(x: number, y: number, z: number) {
        // Find unit grid cell containing point 
        let X = Math.floor(x);
        let Y = Math.floor(y);
        let Z = Math.floor(z);

        // Get relative xyz coordinates of point within that cell 
        x = x - X;
        y = y - Y;
        z = z - Z;

        // Wrap the integer cells at 255 (smaller integer period can be introduced here) 
        X = X & 255;
        Y = Y & 255;
        Z = Z & 255;
        // Calculate a set of eight hashed gradient indices 
        const gi000 = this.perm[X + this.perm[Y + this.perm[Z]]] % 12;
        const gi001 = this.perm[X + this.perm[Y + this.perm[Z + 1]]] % 12;
        const gi010 = this.perm[X + this.perm[Y + 1 + this.perm[Z]]] % 12;
        const gi011 = this.perm[X + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;
        const gi100 = this.perm[X + 1 + this.perm[Y + this.perm[Z]]] % 12;
        const gi101 = this.perm[X + 1 + this.perm[Y + this.perm[Z + 1]]] % 12;
        const gi110 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z]]] % 12;
        const gi111 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;

        // The gradients of each corner are now: 
        // g000 = grad3[gi000]; 
        // g001 = grad3[gi001]; 
        // g010 = grad3[gi010]; 
        // g011 = grad3[gi011]; 
        // g100 = grad3[gi100]; 
        // g101 = grad3[gi101]; 
        // g110 = grad3[gi110]; 
        // g111 = grad3[gi111]; 
        // Calculate noise contributions from each of the eight corners 
        const n000 = this.dot(ClassicalNoise.grad3[gi000], x, y, z);
        const n100 = this.dot(ClassicalNoise.grad3[gi100], x - 1, y, z);
        const n010 = this.dot(ClassicalNoise.grad3[gi010], x, y - 1, z);
        const n110 = this.dot(ClassicalNoise.grad3[gi110], x - 1, y - 1, z);
        const n001 = this.dot(ClassicalNoise.grad3[gi001], x, y, z - 1);
        const n101 = this.dot(ClassicalNoise.grad3[gi101], x - 1, y, z - 1);
        const n011 = this.dot(ClassicalNoise.grad3[gi011], x, y - 1, z - 1);
        const n111 = this.dot(ClassicalNoise.grad3[gi111], x - 1, y - 1, z - 1);
        // Compute the fade curve value for each of x, y, z 
        const u = this.fade(x);
        const v = this.fade(y);
        const w = this.fade(z);
        // Interpolate along x the contributions from each of the corners 
        const nx00 = this.mix(n000, n100, u);
        const nx01 = this.mix(n001, n101, u);
        const nx10 = this.mix(n010, n110, u);
        const nx11 = this.mix(n011, n111, u);
        // Interpolate the four results along y 
        const nxy0 = this.mix(nx00, nx10, v);
        const nxy1 = this.mix(nx01, nx11, v);
        // Interpolate the two last results along z 
        const nxyz = this.mix(nxy0, nxy1, w);

        return nxyz;
    };

    private turbulence(x: number, y: number, z: number, width: number) {
        let turbulence = -0.5;
        for (let f = 1; f <= width / 12; f *= 2) { // W = Image width in pixels
            turbulence += Math.abs(this.noise(x, y, z) / f);
        }
        return turbulence;
    }

    private renderToCanvas() {
        if (!this.canvas || !this.state.image) return;
        const context = this.canvas.getContext("2d");
        // context.putImageData(this.state.image, 0, 0, 0, 0, this.props.width, this.props.height);
        context.drawImage(this.dstCanvas, 0, 0, this.dstCanvas.width, this.dstCanvas.height, 0, 0, this.props.width, this.props.height);
    }


    public render() {
        const { width, height, children } = this.props;
        // var noise = new ClassicalNoise();
        // modify gridSize to get finer or coarser noise
        // write pixel data to destination context
        this.renderToCanvas();
        return <div style={{ width: width, height: height, position: "relative" }}>
            <canvas key="canvas" style={{ position: "absolute", top: 0, left: 0 }} width={width} height={height} ref={(canvas) => {
                this.canvas = canvas;
                this.renderToCanvas();
            }} />
            <div key="content" style={{ position: "absolute", top: 0, left: 0, width: width, height: height }}>
                {children}
            </div>
        </div>;
    }
}