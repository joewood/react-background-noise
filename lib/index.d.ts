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
    /** Contrast filter, each color component as a value 0-255. Defaults to {r:16,b;16,g:16} */
    contrast?: {
        r: number;
        g: number;
        b: number;
    };
    /** Brightness filter, each color component as a value 0-255. Defaults to {r:24,b;24,g:24} */
    brightness?: {
        r: number;
        g: number;
        b: number;
    };
    customRandom?: {
        random(): number;
    };
}
export interface IState {
    oldWidth: number;
    oldHeight: number;
}
export default class ClassicalNoise extends React.PureComponent<IProps, IState> {
    private canvas;
    constructor(props: IProps);
    componentWillReceiveProps(newProps: IProps): void;
    componentDidUpdate(): void;
    private setupCanvas;
    render(): JSX.Element;
}
