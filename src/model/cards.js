import cardsData from "../cardsData";
import Card from './card';

const cards = cardsData.map(
  data => new Card(data)
);

export default cards;
