import { Lexer, Token, TokenType } from './lexer';

export class Parser {
  private tokens: Token[] = [];
  private index = 0;

  constructor(private lexer: Lexer) {
  }

  parse(text: string) {
    this.tokens = this.lexer.lex(text);
    return this.buildJSON();
  }

  private buildJSON() {
    const start = this.tokens[this.index];

    if (start.type !== TokenType.ObjectStart) {
      throw new Error('内容不是以 { 开头！');
    }

    this.index++;

    const json: { [key: string]: any } = {}

    if (this.tokens[this.index].type === TokenType.ObjectEnd) {
      return json;
    }
    while (this.index < this.tokens.length) {
      const key = this.tokens[this.index];
      if (key.type !== TokenType.Key) {
        break;
      }
      this.index++;
      json[key.text] = this.buildValue();
    }
    const end = this.tokens[this.index];
    if (end.type !== TokenType.ObjectEnd) {
      throw new Error('内容不是以 } 结束！');
    }
    this.index++;
    return json;
  }

  private buildValue() {
    const token = this.tokens[this.index];
    switch (token.type) {
      case TokenType.Constant:
        this.index++;
        return token.value;
      case TokenType.ObjectStart:
        return this.buildJSON();
      case TokenType.ArrayStart:
        return this.buildArray();
      default:
        throw new Error('错误的值！');
    }
  }

  private buildArray() {
    const start = this.tokens[this.index];

    if (start.type !== TokenType.ArrayStart) {
      throw new Error('内容不是以 [ 开头！');
    }

    this.index++;

    const arr: any[] = [];

    if (this.tokens[this.index].type === TokenType.ArrayEnd) {
      return arr;
    }
    while (this.index < this.tokens.length) {
      const token = this.tokens[this.index];
      if (![TokenType.Constant, TokenType.ObjectStart, TokenType.ArrayStart].includes(token.type)) {
        break;
      }
      arr.push(this.buildValue());
    }
    const end = this.tokens[this.index];
    if (end.type !== TokenType.ArrayEnd) {
      throw new Error('内容不是以 ] 结束！');
    }
    this.index++;
    return arr;
  }
}
