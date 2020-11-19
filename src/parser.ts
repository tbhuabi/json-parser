import { Lexer, Token, TokenType } from './lexer';

/**
 * 非标 JSON Parser 类，通过调用 Parser 类实例的 parse 方法，可以解析一段非标的 JSON 字符串
 *
 * Parser 类兼容标准的 JSON 字符串和 Javascript 对象和数组格式。即支持行注释和块注释、支持无引号的 key、单引号 key、双引号 key、
 * 单引号字符串、双引号字符串，以及尾逗号。
 */
export class Parser {
  private tokens: Token[] = [];
  private index = 0;
  private lexer = new Lexer();

  parse(text: string): any {
    this.index = 0;
    this.tokens = this.lexer.lex(text);
    switch (this.tokens[0].type) {
      case TokenType.ObjectStart:
        return this.buildJSON();
      case TokenType.ArrayStart:
        return this.buildArray();
    }
  }

  private buildJSON() {
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
    }
  }

  private buildArray() {
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
    this.index++;
    return arr;
  }
}
