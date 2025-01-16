import Igloo from "igloo-ts";
import * as React from "react";
import { PropsWithChildren, useCallback, useEffect, useLayoutEffect, useRef } from "react";
// http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
// Read Stefan's excellent paper for details on how this code works.
import pixel from "../shaders/shader.glsl";
import vertex from "../shaders/vertex.glsl";

/**
 * You can pass in a random number generator object if you like.
 * It is assumed to have a random() method.
 */
export interface Props {
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

function ClassicalNoise({ width, height, brightness, contrast, offset, scale, children }: PropsWithChildren<Props>) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const iglooRef = useRef<Igloo>(undefined);

    const updateUniforms = useCallback(
        (igloo: Igloo | undefined) => {
            if (!igloo) return;
            const gl = igloo.gl;
            // if we lose context, ignore - no need to restore we're not animating
            gl.viewport(0, 0, width, height);
            const iglooProgram = igloo.program(vertex, pixel).use();

            const _brightness = brightness || { r: 25, g: 25, b: 25 };
            const _contrast = contrast || { r: 25, g: 20, b: 15 };
            const _scale = scale || 1;
            const _offset = offset || { x: 0.0, y: 0.0 };

            iglooProgram.uniform("brightness", [_brightness.r / 256, _brightness.g / 256, _brightness.b / 256, 1.0]);
            iglooProgram.uniform("contrast", [_contrast.r / 256, _contrast.g / 256, _contrast.b / 256, 1.0]);
            iglooProgram.uniform("offset", [_offset.x, _offset.y]);
            iglooProgram.uniform("scale", _scale);

            const verticesBuffer = igloo.array(
                new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]),
                gl.STATIC_DRAW,
            );
            verticesBuffer.bind();

            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            const positionLocation = gl.getAttribLocation(iglooProgram.program, "a_position");
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.finish();
        },
        [brightness, contrast, height, offset, scale, width],
    );
    useLayoutEffect(() => {
        const canvasCurrent = canvasRef.current;
        const canvas = canvasCurrent;
        if (!canvas) return;
        if (!iglooRef.current) iglooRef.current = new Igloo(canvas);
        updateUniforms(iglooRef.current);
    }, [updateUniforms]);
    useEffect(() => {
        updateUniforms(iglooRef.current);
    }, [updateUniforms]);

    return (
        <div style={{ width: width, height: height, position: "relative" }}>
            <canvas style={{ position: "absolute", top: 0, left: 0 }} width={width} height={height} ref={canvasRef} />
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: width,
                    height: height,
                }}
            >
                {children}
            </div>
        </div>
    );
}

export default ClassicalNoise;
