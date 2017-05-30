"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ClassicalNoise = (function (_super) {
    __extends(ClassicalNoise, _super);
    function ClassicalNoise(props) {
        var _this = _super.call(this, props) || this;
        _this.perm = [];
        _this.randomPoints = [];
        var r = props.customRandom || Math;
        _this.randomPoints = [];
        for (var i = 0; i < 256; i++) {
            _this.randomPoints[i] = Math.floor(r.random() * 256);
        }
        // To remove the need for index wrapping, double the permutation table length 
        _this.perm = [];
        for (var i = 0; i < 512; i++) {
            _this.perm[i] = _this.randomPoints[i & 255];
        }
        _this.state = { image: _this.updateImage(props) };
        return _this;
    }
    ClassicalNoise.prototype.componentWillReceiveProps = function (newProps) {
        this.setState({ image: this.updateImage(newProps) });
    };
    ClassicalNoise.prototype.updateImage = function (props) {
        // create a destination canvas. 
        var _a = this.props, contrast = _a.contrast, brightness = _a.brightness;
        this.dstCanvas = document.createElement("canvas");
        this.dstCanvas.width = this.props.width;
        this.dstCanvas.height = this.props.height;
        // get context to work with
        var dstContext = this.dstCanvas.getContext("2d");
        // create image data
        var image = dstContext.getImageData(0, 0, this.dstCanvas.width, this.dstCanvas.height); // createImageData(dstCanvas.width / 2, dstCanvas.height / 2);
        var gridSize = props.gridSize || 16;
        var contrastR = (contrast && contrast.r || 16) / 256;
        var contrastG = (contrast && contrast.g || 16) / 256;
        var contrastB = (contrast && contrast.b || 16) / 256;
        var brightnessR = (brightness && brightness.r || 24);
        var brightnessG = (brightness && brightness.g || 24);
        var brightnessB = (brightness && brightness.b || 24);
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
    };
    ClassicalNoise.prototype.dot = function (vec, x, y, z) {
        return vec[0] * x + vec[1] * y + vec[2] * z;
    };
    ClassicalNoise.prototype.mix = function (a, b, mixFactor) {
        return (1.0 - mixFactor) * a + mixFactor * b;
    };
    ClassicalNoise.prototype.fade = function (t) {
        return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
    };
    ;
    // Classic Perlin noise, 3D version 
    ClassicalNoise.prototype.noise = function (x, y, z) {
        // Find unit grid cell containing point 
        var X = Math.floor(x);
        var Y = Math.floor(y);
        var Z = Math.floor(z);
        // Get relative xyz coordinates of point within that cell 
        x = x - X;
        y = y - Y;
        z = z - Z;
        // Wrap the integer cells at 255 (smaller integer period can be introduced here) 
        X = X & 255;
        Y = Y & 255;
        Z = Z & 255;
        // Calculate a set of eight hashed gradient indices 
        var gi000 = this.perm[X + this.perm[Y + this.perm[Z]]] % 12;
        var gi001 = this.perm[X + this.perm[Y + this.perm[Z + 1]]] % 12;
        var gi010 = this.perm[X + this.perm[Y + 1 + this.perm[Z]]] % 12;
        var gi011 = this.perm[X + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;
        var gi100 = this.perm[X + 1 + this.perm[Y + this.perm[Z]]] % 12;
        var gi101 = this.perm[X + 1 + this.perm[Y + this.perm[Z + 1]]] % 12;
        var gi110 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z]]] % 12;
        var gi111 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;
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
        var n000 = this.dot(ClassicalNoise.grad3[gi000], x, y, z);
        var n100 = this.dot(ClassicalNoise.grad3[gi100], x - 1, y, z);
        var n010 = this.dot(ClassicalNoise.grad3[gi010], x, y - 1, z);
        var n110 = this.dot(ClassicalNoise.grad3[gi110], x - 1, y - 1, z);
        var n001 = this.dot(ClassicalNoise.grad3[gi001], x, y, z - 1);
        var n101 = this.dot(ClassicalNoise.grad3[gi101], x - 1, y, z - 1);
        var n011 = this.dot(ClassicalNoise.grad3[gi011], x, y - 1, z - 1);
        var n111 = this.dot(ClassicalNoise.grad3[gi111], x - 1, y - 1, z - 1);
        // Compute the fade curve value for each of x, y, z 
        var u = this.fade(x);
        var v = this.fade(y);
        var w = this.fade(z);
        // Interpolate along x the contributions from each of the corners 
        var nx00 = this.mix(n000, n100, u);
        var nx01 = this.mix(n001, n101, u);
        var nx10 = this.mix(n010, n110, u);
        var nx11 = this.mix(n011, n111, u);
        // Interpolate the four results along y 
        var nxy0 = this.mix(nx00, nx10, v);
        var nxy1 = this.mix(nx01, nx11, v);
        // Interpolate the two last results along z 
        var nxyz = this.mix(nxy0, nxy1, w);
        return nxyz;
    };
    ;
    ClassicalNoise.prototype.turbulence = function (x, y, z, width) {
        var turbulence = -0.5;
        for (var f = 1; f <= width / 12; f *= 2) {
            turbulence += Math.abs(this.noise(x, y, z) / f);
        }
        return turbulence;
    };
    ClassicalNoise.prototype.renderToCanvas = function () {
        if (!this.canvas || !this.state.image)
            return;
        var context = this.canvas.getContext("2d");
        // context.putImageData(this.state.image, 0, 0, 0, 0, this.props.width, this.props.height);
        context.drawImage(this.dstCanvas, 0, 0, this.dstCanvas.width, this.dstCanvas.height, 0, 0, this.props.width, this.props.height);
    };
    ClassicalNoise.prototype.render = function () {
        var _this = this;
        var _a = this.props, width = _a.width, height = _a.height, children = _a.children;
        // var noise = new ClassicalNoise();
        // modify gridSize to get finer or coarser noise
        // write pixel data to destination context
        this.renderToCanvas();
        return React.createElement("div", { style: { width: width, height: height, position: "relative" } },
            React.createElement("canvas", { key: "canvas", style: { position: "absolute", top: 0, left: 0 }, width: width, height: height, ref: function (canvas) {
                    _this.canvas = canvas;
                    _this.renderToCanvas();
                } }),
            React.createElement("div", { key: "content", style: { position: "absolute", top: 0, left: 0, width: width, height: height } }, children));
    };
    return ClassicalNoise;
}(React.PureComponent));
ClassicalNoise.grad3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
];
exports.default = ClassicalNoise;
