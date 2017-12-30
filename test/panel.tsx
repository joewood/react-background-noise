import * as React from "react";

export default function Panel(p: { heading: string; contents: string;  }) {
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
        {p.contents}
        <hr />
      </div>
    </div>
  );
}
