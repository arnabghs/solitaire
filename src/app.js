import React from "react";
import cards from "./model/cards";
import Card from "./model/card";
const _ = require("lodash");

const setDataOnDrag = function(card, fromPlace, event) {
  let data = JSON.stringify({ cardData: card, fromPlace });
  event.dataTransfer.setData("text", data);
};

const allowDrop = function(event) {
  event.preventDefault();
};

const BACKCARD = _.last(cards);

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stock: [cards[7], cards[2], cards[3], cards[4]],
      waste: [cards[5], cards[6]],
      foundations: {
        spade: [cards[0]],
        club: [cards[13]],
        diamond: [cards[26]],
        heart: [cards[39]]
      },
      tableau: [
        [cards[11]],
        [cards[12], cards[50]],
        [cards[14], cards[15], cards[16]],
        [cards[17], cards[18], cards[19], cards[20]],
        [cards[21], cards[22], cards[23], cards[24], cards[25]],
        [cards[49], cards[27], cards[28], cards[29], cards[30], cards[31]],
        [
          cards[32],
          cards[33],
          cards[34],
          cards[35],
          cards[37],
          cards[38],
          cards[48]
        ]
      ]
    };
    this.moveToFoundation = this.moveToFoundation.bind(this);
    this.onStockClicked = this.onStockClicked.bind(this);
    this.refillStock = this.refillStock.bind(this);
    this.moveToTableau = this.moveToTableau.bind(this);
    this.moveFromWasteToTableau = this.moveFromWasteToTableau.bind(this);
    this.moveFromFoundationToTableau = this.moveFromFoundationToTableau.bind(
      this
    );
    this.moveFromTableauToTableau = this.moveFromTableauToTableau.bind(this);
  }

  refillStock() {
    this.setState({
      stock: this.state.waste.slice().reverse(),
      waste: []
    });
  }

  onStockClicked() {
    if (_.isEmpty(this.state.stock)) {
      this.refillStock();
      return;
    }
    const topStockCard = _.last(this.state.stock);

    this.setState({
      stock: _.dropRight(this.state.stock),
      waste: this.state.waste.concat(topStockCard)
    });
  }

  updateInsertedDeck(cards, pileIndex) {
    const insertedTableauDeck = this.state.tableau[pileIndex].concat(cards);
    const modifiedTableau = this.state.tableau.slice();
    modifiedTableau[pileIndex] = insertedTableauDeck;
    return modifiedTableau;
  }

  moveFromWasteToTableau(card, pileIndex) {
    const modifiedTableau = this.updateInsertedDeck(card, pileIndex);
    const modifiedWaste = _.dropRight(this.state.waste);

    this.setState({
      tableau: modifiedTableau,
      waste: modifiedWaste
    });
  }

  moveFromFoundationToTableau(card, pileIndex) {
    const modifiedTableau = this.updateInsertedDeck(card, pileIndex);
    const modifiedDeck = _.dropRight(this.state.foundations[card.type]);
    const modifiedFoundations = Object.assign({}, this.state.foundations, {
      [card.type]: modifiedDeck
    });

    this.setState({
      tableau: modifiedTableau,
      foundations: modifiedFoundations
    });
  }

  ignoreOpenCondition(objVal, othVal, key) {
    return key === "open" ? true : undefined;
  }

  doesContain(deck, card) {
    return deck.some(c => _.isEqualWith(c, card, this.ignoreOpenCondition));
  }

  getSenderDecksIndex(card) {
    const tableauDecks = this.state.tableau.slice();
    const deck = tableauDecks.filter(deck => this.doesContain(deck, card));
    return _.findIndex(tableauDecks, d => _.isEqual(d, _.head(deck)));
  }

  moveFromTableauToTableau(card, pileIndex) {
    const index = this.getSenderDecksIndex(card);
    const cardIndex = _.findIndex(this.state.tableau[index], x =>
      _.isEqualWith(x, card, this.ignoreOpenCondition)
    );

    const numberOfCards = this.state.tableau[index].length - cardIndex;
    const cards = _.takeRight(this.state.tableau[index], numberOfCards);
    const modifiedTableau = this.updateInsertedDeck(cards, pileIndex);

    const withdrawnDeck = _.dropRight(modifiedTableau[index], numberOfCards);
    modifiedTableau[index] = withdrawnDeck;

    this.setState({ tableau: modifiedTableau });
  }

  moveToTableau(index, event) {
    event.preventDefault();
    const receivedData = JSON.parse(event.dataTransfer.getData("text"));

    const card = new Card(receivedData.cardData);

    if (receivedData.fromPlace === "waste") {
      this.moveFromWasteToTableau(card, index);
      return;
    }

    if (receivedData.fromPlace === "tableau") {
      this.moveFromTableauToTableau(card, index);
      return;
    }

    if (receivedData.fromPlace === "foundation") {
      this.moveFromFoundationToTableau(card, index);
      return;
    }
  }

  getModifiedFoundationAfterInsertion(card) {
    const modifiedDeck = this.state.foundations[card.type].concat(card);
    return Object.assign({}, this.state.foundations, {
      [card.type]: modifiedDeck
    });
  }

  moveFromTableauToFoundation(card) {
    let modifiedTableau = this.state.tableau.slice();
    const index = this.getSenderDecksIndex(card);
    const modifiedTableauDeck = _.dropRight(this.state.tableau[index]);
    modifiedTableau[index] = modifiedTableauDeck;
    const modifiedFoundation = this.getModifiedFoundationAfterInsertion(card);
    this.setState({
      foundations: modifiedFoundation,
      tableau: modifiedTableau
    });
  }

  moveFromWasteToFoundation(card) {
    let modifiedWaste = this.state.waste.slice();
    modifiedWaste = _.dropRight(modifiedWaste);
    const modifiedFoundation = this.getModifiedFoundationAfterInsertion(card);
    this.setState({
      foundations: modifiedFoundation,
      waste: modifiedWaste
    });
  }

  moveToFoundation(event) {
    event.preventDefault();
    const receivedData = JSON.parse(event.dataTransfer.getData("text"));
    const card = new Card(receivedData.cardData);

    if (receivedData.fromPlace === "tableau") {
      this.moveFromTableauToFoundation(card);
      return;
    }

    if (receivedData.fromPlace === "waste") {
      this.moveFromWasteToFoundation(card);
      return;
    }
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
                drop={this.moveToFoundation}
              />
            </div>
            <div className={"lower-part"}>
              <Tableau cards={this.state.tableau} drop={this.moveToTableau} />
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

function Waste(props) {
  const topCard = _.last(props.cards);
  let card = null;
  if (topCard) {
    topCard.open = true;
    card = <CardDiv card={topCard} from={"waste"} onDrop={null} />;
  }
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

const CardDiv = function(props) {
  const draggable = props.card.open ? true : false;
  const cls = props.card.open ? props.card.cls : BACKCARD.cls;
  const unicode = props.card.open ? props.card.unicode : BACKCARD.unicode;
  const onDragOverMethod = props.onDrop ? allowDrop : null;
  return (
    <div
      className={cls}
      draggable={draggable}
      onDragStart={setDataOnDrag.bind(null, props.card, props.from)}
      onDrop={props.onDrop}
      onDragOver={onDragOverMethod}
    >
      {unicode}
    </div>
  );
};

const EmptyCardHolder = function(props) {
  const onDragOverMethod = props.onDrop ? allowDrop : null;
  return (
    <div
      className={"base-card-holder"}
      onDrop={props.onDrop}
      onDragOver={onDragOverMethod}
    />
  );
};

function Foundation(props) {
  let topCard = _.last(props.cards);
  let card = null;
  if (topCard) {
    topCard.open = true;
    card = <CardDiv card={topCard} from={"foundation"} onDrop={null} />;
  }
  return (
    <div
      className={"foundation-box"}
      onDrop={props.drop}
      onDragOver={allowDrop}
    >
      {card}
    </div>
  );
}

function TableauPile(props) {
  let key = 0;

  const showCard = function(cards) {
    if (_.isEmpty(cards)) return <EmptyCardHolder onDrop={props.drop} />;

    const allCardsinDiv = [];
    cards.map(card => {
      card.open = _.isEqual(_.last(cards), card) ? true : card.open;
      const dropMethod = _.isEqual(_.last(cards), card) ? props.drop : null;
      return allCardsinDiv.push(
        <CardDiv key={key++} card={card} from={"tableau"} onDrop={dropMethod} />
      );
    });
    return allCardsinDiv;
  };

  return <div className={"tableau-pile"}>{showCard(props.cards)}</div>;
}

function Tableau(props) {
  const tableauCards = props.cards;
  function createTableauPiles(cards) {
    let piles = [];
    for (let index = 0; index < 7; index++) {
      piles.push(
        <TableauPile
          key={index}
          cards={cards[index]}
          drop={props.drop.bind(null, index)}
        />
      );
    }
    return piles;
  }

  return (
    <div className={"tableau-area"}>{createTableauPiles(tableauCards)}</div>
  );
}

export default Game;
