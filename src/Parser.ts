import BinaryOperationNode from './AbstractSyntaxTree/BinaryOperationNode';
import NumberNode from './AbstractSyntaxTree/NumberNode';
import RootNode from './AbstractSyntaxTree/RootNode';
import StatementsNode from './AbstractSyntaxTree/StatementsNode';
import UnaryOperationNode from './AbstractSyntaxTree/UnaryOperationNode';
import VariableNode from './AbstractSyntaxTree/VariableNode';
import ApiError, { ParseErrors } from './ApiError/ApiError';
import Token from './Token';
import TokenType, { tokenTypes } from './TokenType';


export default class Parser {
    tokens: Token[];
    position: number = 0;
    scope: any = {};
    apiError: ApiError;

    constructor(tokens: Token[], apiError: ApiError) {
        this.tokens = tokens;
        this.apiError = apiError;
    }

    findToken(...foundTokens: TokenType[]): Token | null {
        if (this.position < this.tokens.length) {
            const currentToken = this.tokens[this.position];
            if (foundTokens.find((tokenType) => tokenType.name === currentToken.type.name)) {
                ++this.position;
                return currentToken;
            }
        }

        return null;
    }

    matchToken(...foundTokens: TokenType[]): Token {
        const token = this.findToken(...foundTokens);

        if (token == null) {
            throw new Error(this.apiError.getMessage(ParseErrors.MATCH, this.tokens[this.position - 1], ...foundTokens));
        }

        return token;
    }

    // Парсинг кода - возврат корневого узла дерева
    parseCode(): RootNode {
        const root = new StatementsNode();

        while (this.position < this.tokens.length) {
            const codeNode = this.parseCodeLine();
            root.add(codeNode); 
            this.matchToken(tokenTypes.SEMICOLON);
        }

        return root;
    }

    // Парсер отдельной строки кода
    parseCodeLine(): RootNode {
        // найденный токен - вывод
        if (this.findToken(tokenTypes.VARIABLE) == null) {
            return this.parseLog();
        }

        --this.position;
        const variableNode = this.parseNumberOrVariable(),
            operatorAssign = this.findToken(tokenTypes.ASSIGN);

        if (operatorAssign != null) {
            const secondOperation   = this.parseOperation();
            return new BinaryOperationNode(operatorAssign, variableNode, secondOperation);
        }

        throw new Error(this.apiError.getMessage(ParseErrors.CODE_LINE, this.tokens[this.position]));
    }

    // Парсер вывода
    parseLog(): RootNode {
        const operatorLog = this.findToken(tokenTypes.LOG);

        if (operatorLog != null) {
            return new UnaryOperationNode(operatorLog, this.parseOperation());
        }
        
        throw new Error(this.apiError.getMessage(ParseErrors.UNARY, this.tokens[this.position]));
    }

    // Парсер переменной / числа
    parseNumberOrVariable(): RootNode {
        const number = this.findToken(tokenTypes.NUMBER);
        if (number != null) {
            return new NumberNode(number);
        }

        const variable = this.findToken(tokenTypes.VARIABLE);
        if (variable != null) {
            return new VariableNode(variable);
        }

        throw new Error(this.apiError.getMessage(ParseErrors.NUM_OR_VAR, this.tokens[this.position]));
    }

    // Парсер скобок
    parseParentheses(): RootNode {
        if (this.findToken(tokenTypes.LPAR) != null) {
            const node = this.parseOperation();
            this.findToken(tokenTypes.RPAR);
            return node;
        }

        return this.parseNumberOrVariable();
    }

    // Парсер операций
    parseOperation(): RootNode {
        let firstNode = this.parseParentheses(),
            operator = this.findToken(tokenTypes.MINUS, tokenTypes.PLUS);

        while (operator != null) {
            const secondNode = this.parseParentheses();
            firstNode = new BinaryOperationNode(operator, firstNode, secondNode);
            operator = this.findToken(tokenTypes.MINUS, tokenTypes.PLUS);
        }

        return firstNode;
    }

    // обход дерева
    runParse(node: RootNode): any {
        if (node instanceof NumberNode) {
            return parseInt(node.tokenNumber.text);
        }

        if (node instanceof UnaryOperationNode) {
            switch (node.operator.type.name) {
                case tokenTypes.LOG.name:
                    console.log(this.runParse(node.operand));
                    return;
            }
        }

        if (node instanceof BinaryOperationNode) {
            switch (node.operator.type.name) {
                case tokenTypes.PLUS.name:
                    return this.runParse(node.firstOperand) + this.runParse(node.secondOperand);
                case tokenTypes.MINUS.name:
                    return this.runParse(node.firstOperand) - this.runParse(node.secondOperand);
                case tokenTypes.ASSIGN.name:
                    const result        = this.runParse(node.secondOperand),
                        variableNode    = <VariableNode>node.firstOperand;
                    this.scope[variableNode.tokenVariable.text] = result;
                    return result;
            }
        }

        if (node instanceof VariableNode) {
            if (this.scope[node.tokenVariable.text]) {
                return this.scope[node.tokenVariable.text];
            }

            throw new Error(this.apiError.getMessage(ParseErrors.VAR, node.tokenVariable));
        }

        if (node instanceof StatementsNode) {
            node.codeLines.forEach((line) => {
                this.runParse(line);
            });
            return;
        }

        throw new Error(this.apiError.getMessage(ParseErrors.GENERAL, this.tokens[0]));
    }
}