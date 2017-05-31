import * as React from "react";
import * as ReactDOM from "react-dom"
import Background from "../lib/"

function Panel(p: { heading:string, rate: number }) {
    return (
        <div style={{
            color: "white",
            fontFamily: "Arial",
            display: "inline-block"
        }}>
            <div key='one' style={{
                display: "block",
                margin: 20,
                padding: 10
            }}>{p.heading}</div>
            <div key='two'
                style={{
                    fontSize: 38,
                    borderRadius: 10,
                    width: 200,
                    margin: 20,
                    display: "block",
                    boxShadow: "0px 0px 76px 7px rgba(0,0,0,0.7)",
                    height: 200,
                    padding: 20,
                    backgroundColor: "#282828"
                }}>
                {p.rate}%
            <hr />
            </div>
        </div>);
}


ReactDOM.render((
    <Background gridSize={24} contrast={{ r: 30, g: 7, b: 7 }} brightness={{ r: 18, g: 18, b: 18 }} width={1000} height={800}  >
        <Panel heading="Highest" rate={62.31} />
        <Panel heading="Lowest" rate={12.12} />
    </Background>), document.getElementById("root"));
