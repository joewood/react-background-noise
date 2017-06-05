import * as React from "react";
import Igloo from "igloo-ts";
import { vertex, pixel } from "./shaders";

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
	contrast?: { r: number; g: number; b: number };
	/** Brightness filter, each color component as a value 0-255. Defaults to {r:24,b;24,g:24} */
	brightness?: { r: number; g: number; b: number };
	customRandom?: { random(): number };
}

export interface IState {}

export default class ClassicalNoise extends React.PureComponent<IProps, IState> {
	private canvas: HTMLCanvasElement;
	private igloo: Igloo;

	constructor(props: IProps) {
		super(props);
		this.state = {};
	}

	public componentWillMount() {}

	public componentWillReceiveProps(newProps: IProps) {
		// this.setState({ image: this.updateImage(newProps) });
	}

	private setupCanvas = canvas => {
		try {
			let { brightness, contrast } = this.props;
			brightness = brightness || { r: 25, g: 25, b: 25 };
			contrast = contrast || { r: 25, g: 20, b: 15 };
			this.canvas = canvas;

			this.igloo = new Igloo(canvas);
			const gl = this.igloo.gl;

			gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
			const iprogram = this.igloo.program(vertex, pixel).use();
			const program = iprogram["program"];
			iprogram.uniform("brightness", [brightness.r / 256, brightness.g / 256, brightness.b / 256, 1.0]);
			iprogram.uniform("contrast", [contrast.r / 256, contrast.g / 256, contrast.b / 256, 1.0]);

			const buffer = this.igloo.array(
				new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]),
				gl.STATIC_DRAW
			);

			buffer.bind();

			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.clear(gl.COLOR_BUFFER_BIT);

			const positionLocation = gl.getAttribLocation(program, "a_position");
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

			gl.drawArrays(gl.TRIANGLES, 0, 6);
		} catch (e) {
			console.error("GL", e);
		}
	};

	public render() {
		const { width, height, children } = this.props;
		// var noise = new ClassicalNoise();
		// modify gridSize to get finer or coarser noise
		// write pixel data to destination context
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
