import React from "react";
import cards from "./model/cards";

class Main extends React.Component {
  render() {
    let key = 0;
    return cards.map(card => (
      <div key={key++} className={card.class}>
        {card.unicode}
      </div>
    ));
  }
}

export default Main;
