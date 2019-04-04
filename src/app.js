import React from "react";
import cards from "./cards";

class Main extends React.Component {
  render() {
    let key = 0;
    return cards.map(x => (
      <div key={key++} className={x.color === "red" ? "red-card" : "card"}>
        {x.unicode}
      </div>
    ));
  }
}

export default Main;
