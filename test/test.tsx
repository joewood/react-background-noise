import * as React from "react";
import * as ReactDOM from "react-dom";
import Background from "../lib/";

function Panel(p: { heading: string; rate: number }) {
	return (
		<div
			style={{
				color: "white",
				fontFamily: "Arial",
				display: "inline-block"
			}}
		>
			<div
				key="one"
				style={{
					display: "block",
					margin: 20,
					padding: 10
				}}
			>
				{p.heading}
			</div>
			<div
				key="two"
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
				}}
			>
				{p.rate}%
				<hr />
			</div>
		</div>
	);
}

class TestBackground extends React.Component<{}, { width: number }> {
	public state = { width: 100 };
	private timer: any = null;

	public componentDidMount() {
		this.timer = setInterval(() => {
			this.setState({ width: (this.state.width % 1500) + 10 });
		}, 100);
	}

	public render() {
		return (
			<Background
				key="root"
				gridSize={24}
				contrast={{ r: 7, g: 7, b: 7 }}
				brightness={{ r: 48, g: 48, b: 48 }}
				width={this.state.width}
				height={800}
			>
				<Panel heading="Highest" rate={62.31} />
				<Panel heading="Lowest" rate={12.12} />
			</Background>
		);
	}
}

ReactDOM.render(<TestBackground />, document.getElementById("root"));
