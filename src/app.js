import React from "react";
import cards from "./model/cards";
const _ = require("lodash");

// const BACKOFCARD = "\u{1F0A0}";

// class Main extends React.Component {
//   render() {
//     let key = 0;
//     return cards.map(card => (
//       <div key={key++} id={key} className={card.cls}>
//         {card.unicode}
//       </div>
//     ));
//   }
// }

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stock: cards,
      waste: [],
      foundations: { spade: [], club: [], diamond: [], heart: [] },
      tableau: [[], [], [], [], [], [], []]
    };
  }

  render() {
    return (
      <section>
        <header />
        <div className={"main"}>
					<div className={"sidebar"}></div>
          <div className="board">
            <div className={"upper-part"}>
              <Stock cards={this.state.stock} />
              <Waste cards={this.state.stock} />
              <Foundations cards={this.state.stock} />
            </div>
            <div className={"lower-part"}>
              <Tableau cards={this.state.stock} />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

function Stock(props) {
  const backCard = _.last(props.cards);
  return (
    <div className={"stock-pile"}>
      <span className={"back-card"}>{backCard.unicode}</span>
    </div>
  );
}

function Waste(props) {
  const card = props.cards[20];
  return (
    <div className={"waste-cards-area"}>
      <div className={card.cls}>{card.unicode}</div>
    </div>
  );
}

function Foundations(props) {
  const cards = props.cards;
  return (
    <div className={"foundation-area"}>
      <Foundation card={cards[3]} />
      <Foundation card={cards[40]} />
      <Foundation card={cards[10]} />
      <Foundation card={cards[35]} />
    </div>
  );
}

function Foundation(props) {
  return (
    <div className={"foundation-box"}>
      <div className={props.card.cls}>{props.card.unicode}</div>
    </div>
  );
}

function TableauPile(props) {
  let key = 0;
  function showCard(cards) {
    const cardDivs = [];
    cards.map(card =>
      cardDivs.push(
        <div key={key++} className={card.cls}>
          {card.unicode}
        </div>
      )
    );
    return cardDivs;
  }

  return <div className={"tableau-pile"}>{showCard(props.cards)}</div>;
}

function Tableau(props) {
  const cards = props.cards;
  const backCard = _.last(props.cards);

  let tableauCards = [];
  tableauCards.push([cards[0]]);
  tableauCards.push([backCard, cards[2]]);
  tableauCards.push([backCard, backCard, cards[20]]);
  tableauCards.push([backCard, backCard, backCard, cards[8]]);
  tableauCards.push([backCard, backCard, backCard, backCard, cards[9]]);
  tableauCards.push([
    backCard,
    backCard,
    backCard,
    backCard,
    backCard,
    cards[9]
  ]);
  tableauCards.push([
    backCard,
    backCard,
    backCard,
    backCard,
    backCard,
    backCard,
    cards[9]
  ]);

  function createTableauPiles(cards) {
    let piles = [];
    for (let index = 0; index < 7; index++) {
      piles.push(<TableauPile key={index} cards={cards[index]} />);
    }
    return piles;
  }

  return (
    <div className={"tableau-area"}>{createTableauPiles(tableauCards)}</div>
  );
}

export default Game;
