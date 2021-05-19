import Token from './Token';
import { tokenTypes } from './TokenType';


export default class Lexer {
    codeLine: string;
    position: number = 0;
    positionInLine: number = 0; // позиция в строке
    positionLine: number = 1;   // позиция по строкам
    tokens: Token[] = [];

    constructor(codeLine: string) {
        this.codeLine = codeLine;
    }

    analysis(): void {
        while (this.nextTokenExist()) {}

        this.tokens = this.tokens.filter((token) => token.type.name !== tokenTypes.SPACE.name);
    }

    nextTokenExist(): boolean {
        if (this.position >= this.codeLine.length) {
            return false;
        }

        const tokenTypesObjects = Object.values(tokenTypes);

        for (let ind = 0; ind < tokenTypesObjects.length; ++ind) {
            const tokenType = tokenTypesObjects[ind],
                regex       = new RegExp("^" + tokenType.regex),
                result      = this.codeLine.substring(this.position).match(regex);
            
            if (result && result[0]) {
                const token         = new Token(tokenType, result[0], this.positionInLine, this.positionLine),
                    resultLength    = result[0].length;
                console.log(token);
                this.tokens.push(token);
                this.position += resultLength;
                this.positionInLine += resultLength;
                
                if (tokenType.name === tokenTypes.SEMICOLON.name) {
                    ++this.positionLine;
                    this.positionInLine = 0;
                }

                return true;
            }
        }

        throw new Error(`На позиции ${this.position} ошибка!`);
    }

    getTokenList(): Token[] {
        return this.tokens;
    }
}