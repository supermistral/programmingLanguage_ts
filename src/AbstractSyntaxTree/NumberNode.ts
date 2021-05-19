import Token from '../Token';
import RootNode from './RootNode';


export default class NumberNode extends RootNode {
    tokenNumber: Token;

    constructor(tokenNumber: Token) {
        super();
        this.tokenNumber = tokenNumber;
    }
}