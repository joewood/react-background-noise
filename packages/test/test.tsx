import * as React from "react";
import { useState } from "react";
import Background from "react-background-noise";
import { createRoot } from "react-dom/client";
import Panel from "./panel";

const labelStyle: React.CSSProperties = {
    lineHeight: 3,
    verticalAlign: "center",
    display: "flex",
    width: 800,
    alignItems: "center",
    alignContent: "center",
};

const TestBackground = () => {
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [scale, setScale] = useState(1);
    return (
        <div
            style={{
                fontFamily: "arial",
                backgroundColor: "black",
                width: "100uw",
                height: "100uh",
                padding: 20,
                margin: 0,
                color: "#e0e0e0",
            }}
        >
            <h2>React Background Noise</h2>
            <Background
                gridSize={24}
                scale={(100 * 1) / scale}
                offset={{ x: offsetX, y: offsetY }}
                contrast={{ r: 7, g: 7, b: 7 }}
                brightness={{ r: 48, g: 48, b: 48 }}
                width={800}
                height={500}
            >
                <Panel heading="Scale" contents={Math.round((1 / scale) * 100 * 100) + "%"} />
                <Panel heading="Offset" contents={`${offsetX},${offsetY}`} />
            </Background>
            <div style={labelStyle}>
                <span style={{ flex: "0 0 100px" }}>Scale</span>
                <input
                    onChange={(x) => setScale(parseFloat(x.target.value))}
                    type="range"
                    value={scale}
                    min={1}
                    max={1000}
                    step={10}
                    style={{ margin: 15, flex: 1 }}
                />
            </div>
            <div style={labelStyle}>
                <span style={{ flex: "0 0 100px" }}>Offset X</span>
                <input
                    type="range"
                    onChange={(x) => setOffsetX(parseFloat(x.target.value))}
                    value={offsetX}
                    min={0}
                    max={100}
                    step={1}
                    style={{ margin: 15, flex: 1 }}
                />
            </div>
            <div style={labelStyle}>
                <span style={{ flex: "0 0 100px" }}>Offset Y</span>
                <input
                    onChange={(x) => setOffsetY(parseFloat(x.target.value))}
                    type="range"
                    value={offsetY}
                    min={0}
                    max={100}
                    step={1}
                    style={{ margin: 15, flex: 1 }}
                />
            </div>
        </div>
    );
};

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<TestBackground />);
