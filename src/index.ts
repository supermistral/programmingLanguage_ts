import ApiError from "./ApiError/ApiError";

const { default: Lexer } = require("./Lexer");
const { default: Parser } = require("./Parser");

const code = 
    // `
    // a = ((5 - 3) + 5)
    // log a;
    // `
    "a = ((5 - 3) + 5);" +
    "log a"

const lexer = new Lexer(code);
lexer.analysis();

const apiError  = new ApiError();
const parser    = new Parser(lexer.getTokenList(), apiError);
const rootNode  = parser.parseCode();

parser.runParse(rootNode);