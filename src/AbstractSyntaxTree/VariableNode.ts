import Token from '../Token';
import RootNode from './RootNode';


export default class VariableNode extends RootNode {
    tokenVariable: Token;

    constructor(tokenVariable: Token) {
        super();
        this.tokenVariable = tokenVariable;
    }
}