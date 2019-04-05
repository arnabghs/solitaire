class Card {
  constructor(data) {
		this.type = data.type;
		this.number = data.number;
		this.unicode = data.unicode;
		this.color = data.color;
		this.cls = `${this.color}-card`;
	}
}

export default Card;
