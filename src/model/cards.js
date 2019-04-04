import cardsData from "../cardsData";
import Card from './card';

const cards = cardsData.map(
  data => new Card(data.type, data.number, data.unicode, data.color)
);

export default cards;
