import * as React from "react";
import * as ReactDOM from "react-dom";
import Background from "../src";
import Panel from "./panel";

const labelStyle: React.CSSProperties = {
  lineHeight: 3,
  verticalAlign: "center",
  display: "flex",
  width: 800,
  alignItems: "center",
  alignContent: "center"
};

class TestBackground extends React.Component<
  {},
  { scale?: number; offsetX?: number; offsetY?: number }
> {
  public state = { scale: 1, offsetX: 0, offsetY: 0 };
  private scale: HTMLInputElement;
  private offsetX: HTMLInputElement;
  private offsetY: HTMLInputElement;

  public componentDidMount() {
    // this.timer = setInterval(() => {
    //   this.setState({ width: this.state.width % 1500 + 10 });
    // }, 50);
  }

  public render() {
    const { offsetX, offsetY, scale } = this.state;
    return (
      <div
        style={{
          fontFamily: "arial",
          backgroundColor: "black",
          width: "100uw",
          height: "100uh",
          padding: 20,
          margin: 0,
          color: "#e0e0e0"
        }}
      >
        <h2>React Background Noise</h2>
        <Background
          key="root"
          gridSize={24}
          scale={100 * 1 / scale}
          offset={{ x: offsetX, y: offsetY }}
          contrast={{ r: 7, g: 7, b: 7 }}
          brightness={{ r: 48, g: 48, b: 48 }}
          width={800}
          height={500}
        >
          <Panel heading="Scale" contents={Math.round(1/scale * 100 * 100) + "%"} />
          <Panel
            heading="Offset"
            contents={`${this.state.offsetX},${this.state.offsetY}`}
          />
        </Background>
        <div key="scale" style={labelStyle}>
          <span style={{ flex: "0 0 100px" }}>Scale</span>
          <input
            ref={ctrl => (this.scale = ctrl)}
            onChange={x =>
              this.setState({ scale: parseFloat(this.scale.value) })
            }
            type="range"
            value={scale}
            min={1}
            max={1000}
            step={10}
            style={{ margin: 15, flex: 1 }}
          />
        </div>
        <div key="offsetx" style={labelStyle}>
          <span style={{ flex: "0 0 100px" }}>Offset X</span>
          <input
            ref={ctrl => (this.offsetX = ctrl)}
            type="range"
            onChange={x =>
              this.setState({ offsetX: parseFloat(this.offsetX.value) })
            }
            value={offsetX}
            min={0}
            max={100}
            step={1}
            style={{ margin: 15, flex: 1 }}
          />
        </div>
        <div key="offsety" style={labelStyle}>
          <span style={{ flex: "0 0 100px" }}>Offset Y</span>
          <input
            ref={ctrl => (this.offsetY = ctrl)}
            onChange={x =>
              this.setState({ offsetY: parseFloat(this.offsetY.value) })
            }
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
  }
}

ReactDOM.render(<TestBackground />, document.getElementById("root"));
