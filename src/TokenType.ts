export default class TokenType {
    name: string;
    regex: string;

    constructor(name: string, regex: string) {
        this.name = name;
        this.regex = regex;
    }
}

const tokenDict: object = {
    "SPACE": "[ \\n\\t\\r]",
    "ASSIGN": "\\=",
    "PLUS": "\\+",
    "MINUS": "\\-",
    "LPAR": "\\(",
    "RPAR": "\\)",
    "LOG": "log",
    "SEMICOLON": ";",
    "NUMBER": "[0-9]*",
    "VARIABLE": "[a-z]*",
};

export const tokenTypes = Object.fromEntries(
    Object.entries(tokenDict).map(([key, value]) => [key, new TokenType(key, value)])
);