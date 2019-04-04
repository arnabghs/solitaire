class Card {
  constructor(type,number,unicode,color) {
		this.type = type;
		this.number = number;
		this.unicode = unicode;
		this.color = color;
		this.class = `${this.color}-card`;
	}
}

export default Card;
