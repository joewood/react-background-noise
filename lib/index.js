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
// http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
// Read Stefan's excellent paper for details on how this code works.
var vertex = require("!raw-loader!../src/vertex.glsl");
var pixel = require("!raw-loader!../src/shader.glsl");
var ClassicalNoise = /** @class */ (function (_super) {
    __extends(ClassicalNoise, _super);
    function ClassicalNoise(props) {
        var _this = _super.call(this, props) || this;
        _this.iglooProgram = null;
        _this.glProgram = null;
        _this.updateUniforms = function () {
            var gl = _this.igloo.gl;
            var _a = _this.props, brightness = _a.brightness, contrast = _a.contrast, width = _a.width, height = _a.height, offset = _a.offset, scale = _a.scale;
            brightness = brightness || { r: 25, g: 25, b: 25 };
            contrast = contrast || { r: 25, g: 20, b: 15 };
            scale = scale || 1;
            offset = offset || { x: 0.0, y: 0.0 };
            _this.iglooProgram.uniform("brightness", [brightness.r / 256, brightness.g / 256, brightness.b / 256, 1.0]);
            _this.iglooProgram.uniform("contrast", [contrast.r / 256, contrast.g / 256, contrast.b / 256, 1.0]);
            _this.iglooProgram.uniform("offset", [offset.x, offset.y]);
            _this.iglooProgram.uniform("scale", scale);
            var verticesBuffer = _this.igloo.array(new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]), gl.STATIC_DRAW);
            verticesBuffer.bind();
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            var positionLocation = gl.getAttribLocation(_this.glProgram, "a_position");
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.finish();
        };
        _this.initCanvas = function (canvas) {
            var _a = _this.props, width = _a.width, height = _a.height;
            _this.igloo = new igloo_ts_1.default(canvas);
            var gl = _this.igloo.gl;
            // if we lose context, ignore - no need to restore we're not animating
            // gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.viewport(0, 0, width, height);
            _this.iglooProgram = _this.igloo.program(vertex, pixel).use();
            _this.glProgram = _this.iglooProgram["program"];
        };
        _this.setupCanvas = function (canvas) {
            try {
                if (!_this.canvas) {
                    canvas.addEventListener("webglcontextlost", function (event) { return event.preventDefault(); }, false);
                    _this.canvas = canvas;
                }
                _this.initCanvas(canvas);
                _this.updateUniforms();
            }
            catch (e) {
                console.error("Set-up Error", e);
            }
        };
        _this.state = { oldWidth: props.width, oldHeight: props.height };
        return _this;
    }
    ClassicalNoise.prototype.componentDidUpdate = function (prevProps, preState) {
        // now mounted, if the current size is different to the previous size then re-render
        var _a = this.props, height = _a.height, width = _a.width, scale = _a.scale, offset = _a.offset;
        if (prevProps.height !== this.props.height || prevProps.width !== this.props.width) {
            if (!!this.canvas)
                this.setupCanvas(this.canvas);
        }
        if (prevProps.scale !== scale || prevProps.offset.x !== offset.x || prevProps.offset.y !== offset.y) {
            if (!!this.canvas)
                this.updateUniforms();
        }
    };
    ClassicalNoise.prototype.render = function () {
        var _a = this.props, width = _a.width, height = _a.height, children = _a.children;
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
//# sourceMappingURL=index.js.map