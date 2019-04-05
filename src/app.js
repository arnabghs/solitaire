import React from "react";
import cards from "./model/cards";
import Card from "./model/card";
const _ = require("lodash");

const setDataOnDrag = function(card, event) {
  event.dataTransfer.setData("text", card);
};

const allowDrop = function(event) {
  event.preventDefault();
};

const BACKCARD = cards[52];

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stock: [cards[13], cards[17], cards[33], cards[47]],
      waste: [cards[23], cards[37]],
      foundations: {
        spade: [cards[0]],
        club: [cards[13]],
        diamond: [cards[26]],
        heart: [cards[39]]
      },
      tableau: [
        [cards[5]],
        [BACKCARD, cards[15]],
        [BACKCARD, BACKCARD, cards[25]],
        [BACKCARD, BACKCARD, BACKCARD, cards[35]],
        [BACKCARD, BACKCARD, BACKCARD, BACKCARD, cards[45]],
        [BACKCARD, BACKCARD, BACKCARD, BACKCARD, BACKCARD, cards[50]],
        [BACKCARD, BACKCARD, BACKCARD, BACKCARD, BACKCARD, BACKCARD, cards[4]]
      ]
    };
    this.moveTableauToFoundation = this.moveTableauToFoundation.bind(this);
  }

  moveTableauToFoundation(event) {
    event.preventDefault();
    const cardData = JSON.parse(event.dataTransfer.getData("text"));
    const card = new Card(cardData);
    const modifiedFoundationDeck = this.state.foundations[card.type].concat(
      card
    );
    const newFoundations = Object.assign({}, this.state.foundations, {
      [card.type]: modifiedFoundationDeck
    });

    const lastCardsInTable = this.state.tableau.map(x => _.last(x));
    const index = _.findIndex(lastCardsInTable, x => _.isEqual(x, card));
    const modifiedTableauDeck = _.dropRight(this.state.tableau[index]);
    const modifiedTableau = this.state.tableau.slice();
    modifiedTableau[index] = modifiedTableauDeck;

    this.setState({ foundations: newFoundations, tableau: modifiedTableau });
  }

  render() {
    return (
      <section>
        <header />
        <div className={"main"}>
          <div className={"sidebar"} />
          <div className="board">
            <div className={"upper-part"}>
              <Stock cards={this.state.stock} />
              <Waste cards={this.state.waste} />
              <Foundations
                cards={this.state.foundations}
                drop={this.moveTableauToFoundation}
              />
            </div>
            <div className={"lower-part"}>
              <Tableau cards={this.state.tableau} />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

function Stock(props) {
  // const lastCard = _.last(props.cards);
  return (
    <div className={"stock-pile"}>
      <span className={"back-card"}>{BACKCARD.unicode}</span>
    </div>
  );
}

const CardDiv = function(props) {
  return (
    <div
      className={props.card.cls}
      draggable={"true"}
      onDragStart={setDataOnDrag.bind(null, JSON.stringify(props.card))}
    >
      {props.card.unicode}
    </div>
  );
};

function Waste(props) {
  const topCard = _.last(props.cards);
  return <div className={"waste-cards-area"}>{<CardDiv card={topCard} />}</div>;
}

function Foundations(props) {
  const cards = props.cards;
  return (
    <div className={"foundation-area"}>
      <Foundation cards={cards.spade} drop={props.drop} />
      <Foundation cards={cards.club} drop={props.drop} />
      <Foundation cards={cards.diamond} drop={props.drop} />
      <Foundation cards={cards.heart} drop={props.drop} />
    </div>
  );
}

function Foundation(props) {
  let card = _.last(props.cards);
  return (
    <div
      className={"foundation-box"}
      onDrop={props.drop}
      onDragOver={allowDrop}
      draggable={"true"}
      onDragStart={setDataOnDrag.bind(null, JSON.stringify(card))}
    >
      <div className={card.cls}>{card.unicode}</div>
    </div>
  );
}

function TableauPile(props) {
  let key = 0;
  let isDraggable = false;
  function showCard(cards) {
    const cardDivs = [];
    cards.map((card, index) => {
      if (index === cards.length - 1) isDraggable = true;
      return cardDivs.push(
        <div
          key={key++}
          className={card.cls}
          draggable={isDraggable}
          onDragStart={setDataOnDrag.bind(null, JSON.stringify(card))}
        >
          {card.unicode}
        </div>
      );
    });
    return cardDivs;
  }

  return <div className={"tableau-pile"}>{showCard(props.cards)}</div>;
}

function Tableau(props) {
  const tableauCards = props.cards;
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
