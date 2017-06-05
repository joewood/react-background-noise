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
var igloo_ts_1 = require("igloo-ts");
var shaders_1 = require("./shaders");
var ClassicalNoise = (function (_super) {
    __extends(ClassicalNoise, _super);
    function ClassicalNoise(props) {
        var _this = _super.call(this, props) || this;
        _this.setupCanvas = function (canvas) {
            try {
                var _a = _this.props, brightness = _a.brightness, contrast = _a.contrast;
                brightness = brightness || { r: 25, g: 25, b: 25 };
                contrast = contrast || { r: 25, g: 20, b: 15 };
                _this.canvas = canvas;
                _this.igloo = new igloo_ts_1.default(canvas);
                var gl = _this.igloo.gl;
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                var iprogram = _this.igloo.program(shaders_1.vertex, shaders_1.pixel).use();
                var program = iprogram["program"];
                iprogram.uniform("brightness", [brightness.r / 256, brightness.g / 256, brightness.b / 256, 1.0]);
                iprogram.uniform("contrast", [contrast.r / 256, contrast.g / 256, contrast.b / 256, 1.0]);
                var buffer = _this.igloo.array(new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]), gl.STATIC_DRAW);
                buffer.bind();
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                var positionLocation = gl.getAttribLocation(program, "a_position");
                gl.enableVertexAttribArray(positionLocation);
                gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }
            catch (e) {
                console.error("GL", e);
            }
        };
        _this.state = {};
        return _this;
    }
    ClassicalNoise.prototype.componentWillMount = function () { };
    ClassicalNoise.prototype.componentWillReceiveProps = function (newProps) {
        // this.setState({ image: this.updateImage(newProps) });
    };
    ClassicalNoise.prototype.render = function () {
        var _a = this.props, width = _a.width, height = _a.height, children = _a.children;
        // var noise = new ClassicalNoise();
        // modify gridSize to get finer or coarser noise
        // write pixel data to destination context
        return (React.createElement("div", { style: { width: width, height: height, position: "relative" } },
            React.createElement("canvas", { key: "canvas", style: { position: "absolute", top: 0, left: 0 }, width: width, height: height, ref: this.setupCanvas }),
            React.createElement("div", { key: "content", style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: width,
                    height: height
                } }, children)));
    };
    return ClassicalNoise;
}(React.PureComponent));
exports.default = ClassicalNoise;
