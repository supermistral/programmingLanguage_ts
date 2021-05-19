import TokenType from './TokenType';

export default class Token {
    type: TokenType;
    text: string;
    position: number;
    positionLine: number;

    constructor(type: TokenType, text: string, position: number, positionLine: number) {
        this.type = type;
        this.text = text;
        this.position = position;
        this.positionLine = positionLine;
    }
}