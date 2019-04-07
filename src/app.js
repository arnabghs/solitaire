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
        [cards[50]],
        [cards[11], cards[12]],
        [cards[21], cards[22], cards[23]],
        [cards[31], cards[32], cards[33], cards[34]],
        [cards[41], cards[42], cards[43], cards[44], cards[45]],
        [cards[1], cards[2], cards[3], cards[4], cards[5], cards[6]],
        [
          cards[19],
          cards[29],
          cards[39],
          cards[49],
          cards[9],
          cards[14],
          cards[24]
        ]
      ]
    };
    this.moveTableauToFoundation = this.moveTableauToFoundation.bind(this);
    this.onStockClicked = this.onStockClicked.bind(this);
    this.refillStock = this.refillStock.bind(this);
  }

  refillStock() {
		this.setState({
			stock: this.state.waste.slice().reverse(),
			waste: [],

		})
	}

  onStockClicked() {
    if (_.isEmpty(this.state.stock)) {
      this.refillStock();
      return;
    }
    const topStockCard = _.last(this.state.stock);
    const modifiedWaste = this.state.waste.concat(topStockCard);

    this.setState({
      stock: _.dropRight(this.state.stock),
      waste: modifiedWaste
    });
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
              <Stock cards={this.state.stock} onClick={this.onStockClicked} />
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
  let faceDownImg = BACKCARD.unicode;
  if (props.cards.length === 0) {
    faceDownImg = <img src={"./refresh_icon.png"} alt="refresh" />;
  }
  return (
    <div className={"stock-pile"}>
      <span className={"back-card"} onClick={props.onClick}>
        {faceDownImg}
      </span>
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
	let card = <CardDiv card={topCard} />;
	if (!topCard) card = null;
  return <div className={"waste-cards-area"}>{card}</div>;
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
    >
      <div
        className={card.cls}
        draggable={"true"}
        onDragStart={setDataOnDrag.bind(null, JSON.stringify(card))}
      >
        {card.unicode}
      </div>
    </div>
  );
}

function TableauPile(props) {
  let key = 0;
  let uni = BACKCARD.unicode;
  let cls = BACKCARD.cls;
  let isDraggable = false;
  function showCard(cards) {
    const cardDivs = [];
    cards.map((card, index) => {
      if (index === cards.length - 1) {
        isDraggable = true;
        cls = card.cls;
        uni = card.unicode;
      }
      return cardDivs.push(
        <div
          key={key++}
          className={cls}
          draggable={isDraggable}
          onDragStart={setDataOnDrag.bind(null, JSON.stringify(card))}
        >
          {uni}
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
