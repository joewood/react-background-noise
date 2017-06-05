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
                if (!_this.canvas) {
                    canvas.addEventListener("webglcontextlost", function (event) { return event.preventDefault(); }, false);
                    _this.canvas = canvas;
                }
                var _a = _this.props, brightness = _a.brightness, contrast = _a.contrast;
                brightness = brightness || { r: 25, g: 25, b: 25 };
                contrast = contrast || { r: 25, g: 20, b: 15 };
                var igloo = new igloo_ts_1.default(canvas);
                var gl = igloo.gl;
                // if we lose context, ignore - no need to restore we're not animating
                // gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                gl.viewport(0, 0, _this.props.width, _this.props.height);
                var iglooProgram = igloo.program(shaders_1.vertex, shaders_1.pixel).use();
                var glProgram = iglooProgram["program"];
                iglooProgram.uniform("brightness", [brightness.r / 256, brightness.g / 256, brightness.b / 256, 1.0]);
                iglooProgram.uniform("contrast", [contrast.r / 256, contrast.g / 256, contrast.b / 256, 1.0]);
                var verticesBuffer = igloo.array(new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]), gl.STATIC_DRAW);
                verticesBuffer.bind();
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                var positionLocation = gl.getAttribLocation(glProgram, "a_position");
                gl.enableVertexAttribArray(positionLocation);
                gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
                gl.finish();
            }
            catch (e) {
                console.error("Set-up Error", e);
            }
        };
        _this.state = { oldWidth: props.width, oldHeight: props.height };
        return _this;
    }
    ClassicalNoise.prototype.componentWillReceiveProps = function (newProps) {
        // if the size has changed then store the new size in the state
        if (newProps.width !== this.props.width || newProps.height !== this.props.height) {
            this.setState({ oldWidth: this.props.width, oldHeight: this.props.height });
        }
    };
    ClassicalNoise.prototype.componentDidUpdate = function () {
        // now mounted, if the current size is different to the previous size then re-render
        if (this.state.oldHeight !== this.props.height || this.state.oldWidth !== this.props.width) {
            if (!!this.canvas)
                this.setupCanvas(this.canvas);
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