import * as React from "react";
import Igloo, { Program } from "igloo-ts";

// http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
// Read Stefan's excellent paper for details on how this code works.
const vertex = require("!raw-loader!../src/vertex.glsl");
const pixel = require("!raw-loader!../src/shader.glsl");

/**
 * You can pass in a random number generator object if you like.
 * It is assumed to have a random() method.
 */
export interface IProps {
	width: number;
	height: number;
	gridSize: number;
	/** Contrast filter, each color component as a value 0-255. Defaults to {r:16,b;16,g:16} */
	contrast?: { r: number; g: number; b: number };
	/** Brightness filter, each color component as a value 0-255. Defaults to {r:24,b;24,g:24} */
	brightness?: { r: number; g: number; b: number };
	customRandom?: { random(): number };
	scale?: number;
	offset?: { x: number; y: number };
}

export interface IState {
	oldWidth: number;
	oldHeight: number;
}

export default class ClassicalNoise extends React.PureComponent<IProps, IState> {
	private canvas: HTMLCanvasElement;
	private iglooProgram: Program = null;
	private glProgram: WebGLProgram = null;
	private igloo: Igloo;

	constructor(props: IProps) {
		super(props);
		this.state = { oldWidth: props.width, oldHeight: props.height };
	}

	public componentDidUpdate(prevProps: IProps, preState: IState) {
		// now mounted, if the current size is different to the previous size then re-render
		const { height, width, scale, offset } = this.props;
		if (prevProps.height !== this.props.height || prevProps.width !== this.props.width) {
			if (!!this.canvas) this.setupCanvas(this.canvas);
		}
		if (prevProps.scale !== scale || prevProps.offset.x !== offset.x || prevProps.offset.y !== offset.y) {
			if (!!this.canvas) this.updateUniforms();
		}
	}

	private updateUniforms = () => {
		const gl = this.igloo.gl;
		let { brightness, contrast, width, height, offset, scale } = this.props;
		brightness = brightness || { r: 25, g: 25, b: 25 };
		contrast = contrast || { r: 25, g: 20, b: 15 };
		scale = scale || 1;
		offset = offset || { x: 0.0, y: 0.0 };

		this.iglooProgram.uniform("brightness", [brightness.r / 256, brightness.g / 256, brightness.b / 256, 1.0]);
		this.iglooProgram.uniform("contrast", [contrast.r / 256, contrast.g / 256, contrast.b / 256, 1.0]);
		this.iglooProgram.uniform("offset", [offset.x, offset.y]);
		this.iglooProgram.uniform("scale", scale);

		const verticesBuffer = this.igloo.array(
			new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]),
			gl.STATIC_DRAW
		);
		verticesBuffer.bind();

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		const positionLocation = gl.getAttribLocation(this.glProgram, "a_position");
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.TRIANGLES, 0, 6);
		gl.finish();
	};

	private initCanvas = (canvas: HTMLCanvasElement) => {
		let { width, height } = this.props;

		this.igloo = new Igloo(canvas);
		const gl = this.igloo.gl;
		// if we lose context, ignore - no need to restore we're not animating

		// gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
		gl.viewport(0, 0, width, height);
		this.iglooProgram = this.igloo.program(vertex, pixel).use();
		this.glProgram = this.iglooProgram["program"];
	};

	private setupCanvas = (canvas: HTMLCanvasElement) => {
		try {
			if (!this.canvas) {
				canvas.addEventListener("webglcontextlost", event => event.preventDefault(), false);
				this.canvas = canvas;
			}
			this.initCanvas(canvas);
			this.updateUniforms();
		} catch (e) {
			console.error("Set-up Error", e);
		}
	};

	public render() {
		const { width, height, children } = this.props;
		return (
			<div style={{ width: width, height: height, position: "relative" }}>
				<canvas
					key="canvas"
					style={{ position: "absolute", top: 0, left: 0 }}
					width={width}
					height={height}
					ref={this.setupCanvas}
				/>
				<div
					key="content"
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: width,
						height: height
					}}
				>
					{children}
				</div>
			</div>
		);
	}
}
