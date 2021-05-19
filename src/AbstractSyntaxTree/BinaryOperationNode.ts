import Token from "../Token";
import RootNode from "./RootNode";


export default class BinaryOperationNode extends RootNode {
    operator: Token;
    firstOperand: RootNode;
    secondOperand: RootNode;

    constructor(operator: Token, firstOperand: RootNode, secondOperand: RootNode) {
        super();
        this.operator = operator;
        this.firstOperand = firstOperand;
        this.secondOperand = secondOperand;
    }
}