/// <reference types="react" />
import * as React from "react";
/**
 * You can pass in a random number generator object if you like.
 * It is assumed to have a random() method.
 */
export interface IProps {
    width: number;
    height: number;
    gridSize: number;
    customRandom?: {
        random(): number;
    };
}
export interface IState {
    image: ImageData;
}
export default class ClassicalNoise extends React.Component<IProps, IState> {
    private canvas;
    private static grad3;
    private perm;
    private randomPoints;
    constructor(props: IProps);
    private updateImage(props);
    private dot(g, x, y, z);
    private mix(a, b, t);
    private fade(t);
    private noise(x, y, z);
    private turbulence(x, y, z, W);
    private renderToCanvas();
    render(): JSX.Element;
}
