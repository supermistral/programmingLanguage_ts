import Token from "../Token";
import RootNode from "./RootNode";


export default class UnaryOperationNode extends RootNode {
    operator: Token;
    operand: RootNode;

    constructor(operator: Token, operand: RootNode) {
        super();
        this.operator = operator;
        this.operand = operand;
    }
}