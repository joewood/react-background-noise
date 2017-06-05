import * as React from "react";
import Igloo from "igloo-ts";
import { vertex, pixel } from "./shaders";

// http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
// Read Stefan's excellent paper for details on how this code works.

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
}

export interface IState {
	oldWidth: number;
	oldHeight: number;
}

export default class ClassicalNoise extends React.PureComponent<IProps, IState> {
	private canvas: HTMLCanvasElement;

	constructor(props: IProps) {
		super(props);
		this.state = { oldWidth: props.width, oldHeight: props.height };
	}

	public componentWillReceiveProps(newProps: IProps) {
		// if the size has changed then store the new size in the state
		if (newProps.width !== this.props.width || newProps.height !== this.props.height) {
			this.setState({ oldWidth: this.props.width, oldHeight: this.props.height });
		}
	}

	public componentDidUpdate() {
		// now mounted, if the current size is different to the previous size then re-render
		if (this.state.oldHeight !== this.props.height || this.state.oldWidth !== this.props.width) {
			if (!!this.canvas) this.setupCanvas(this.canvas);
		}
	}

	private setupCanvas = (canvas:HTMLCanvasElement) => {
		try {
			if (!this.canvas) {
				canvas.addEventListener("webglcontextlost", event => event.preventDefault(), false);
				this.canvas = canvas;
			}
			let { brightness, contrast } = this.props;
			brightness = brightness || { r: 25, g: 25, b: 25 };
			contrast = contrast || { r: 25, g: 20, b: 15 };

			const igloo = new Igloo(canvas);
			const gl = igloo.gl;
			// if we lose context, ignore - no need to restore we're not animating

			// gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
			gl.viewport(0, 0, this.props.width, this.props.height);
			const iglooProgram = igloo.program(vertex, pixel).use();
			const glProgram = iglooProgram["program"];
			iglooProgram.uniform("brightness", [brightness.r / 256, brightness.g / 256, brightness.b / 256, 1.0]);
			iglooProgram.uniform("contrast", [contrast.r / 256, contrast.g / 256, contrast.b / 256, 1.0]);

			const verticesBuffer = igloo.array(
				new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]),
				gl.STATIC_DRAW
			);
			verticesBuffer.bind();

			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.clear(gl.COLOR_BUFFER_BIT);

			const positionLocation = gl.getAttribLocation(glProgram, "a_position");
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

			gl.drawArrays(gl.TRIANGLES, 0, 6);
			gl.finish();
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
