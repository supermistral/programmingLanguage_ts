import Token from "../Token";


export enum ParseErrors {
    MATCH,
    CODE_LINE,
    UNARY,
    NUM_OR_VAR,
    VAR,
    GENERAL,
};

export default class ApiError {

    getPosString(posLine: number, posInLine: number): string {
        return `${posLine} : ${posInLine}`;
    }

    getMessage(error: ParseErrors, token: Token, ...args: any[]): string {
        const posString = this.getPosString(token.positionLine, token.position);

        switch (error) {
            case ParseErrors.MATCH:
                const tokenLen = token.text.length;
                const posStringForMatch = this.getPosString(token.positionLine, token.position + tokenLen);
                return (
                    `На позиции ${posStringForMatch} ожидаются следующие служебные слова:\n` +
                    `${args.map((tokenType) => tokenType.name).join(" ")}\n`
                );
            case ParseErrors.CODE_LINE:
                return `На позиции ${posString} ожидается присвоение после переменной`;
            case ParseErrors.UNARY:
                return `На позиции ${posString} ожидается оператор вывода`;
            case ParseErrors.NUM_OR_VAR:
                return `На позиции ${posString} ожидается переменная / число`;
            case ParseErrors.VAR:
                return `Отсутствует объявление переменной: ${token.text}`;
        }

        return `Ошибка парсера`;
    }
}