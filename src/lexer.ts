export enum TokenType {
  ObjectStart,
  ObjectEnd,
  ArrayStart,
  ArrayEnd,
  Key,
  Constant
}

export interface Token {
  text?: string;
  value?: any;
  type: TokenType;
}

const ESCAPE = {
  "n": "\n",
  "f": "\f",
  "r": "\r",
  "t": "\t",
  "v": "\v",
  "'": "'",
  '"': '"'
};

export class Lexer {
  private tokens: Token[] = [];
  private index = 0;

  private text = '';

  lex(text: string) {
    this.text = text;
    this.tokens = [];
    this.index = 0;

    this.ignore();

    this.run(false);
    return this.tokens;
  }

  private run(handleValue = true) {
    const ch = this.text.charAt(this.index);
    if (ch === '{') {
      this.readObject();
      return;
    } else if (ch === '[') {
      this.readArray();
      return;
    }
    if (handleValue) {
      if (ch === '"' || ch === "'") {
        this.tokens.push({
          type: TokenType.Constant,
          value: this.readString(ch)
        })
        return;
      } else if (this.isNumber(ch) || ch === '.' && this.isNumber(this.peek(1))) {
        this.tokens.push({
          type: TokenType.Constant,
          value: this.readNumber()
        })
        return;
      } else if (this.expect('null') || this.expect('true')) {
        const latter = this.peek(4);
        if ([',', ']', '}'].includes(latter) || this.isEmpty(latter) || ['//', '/*'].includes(latter + this.peek(5))) {
          this.tokens.push({
            type: TokenType.Constant,
            value: this.text.slice(this.index, this.index + 4) === 'null' ? null : true
          })
          this.index += 4;
          return;
        }
      } else if (this.expect('false')) {
        const latter = this.peek(5);
        if ([',', ']', '}'].includes(latter) || this.isEmpty(latter) || ['//', '/*'].includes(latter + this.peek(6))) {
          this.tokens.push({
            type: TokenType.Constant,
            value: false
          })
          this.index += 5;
          return;
        }
      }
    }
    throw new Error('错误的格式！');
  }

  private readObject() {
    this.tokens.push({
      type: TokenType.ObjectStart
    })
    this.index++;
    this.ignore();
    if (this.text.charAt(this.index) === '}') {
      this.index++;
    } else {
      while (this.index < this.text.length) {
        this.ignore();
        this.readKey();
        this.ignore();
        if (this.text.charAt(this.index) !== ':') {
          throw new Error('JSON key 后必须为 : 号');
        }
        this.index++;
        this.ignore();
        this.run();
        this.ignore();
        const ch = this.text.charAt(this.index);
        if (ch === '}') {
          this.index++;
          break;
        }
        if (ch === ',') {
          this.index++;
          this.ignore();
          if (this.text.charAt(this.index) === '}') {
            this.index++;
            break;
          }
        } else {
          throw new Error('JSON 没有正确结束！');
        }
      }
    }

    this.tokens.push({
      type: TokenType.ObjectEnd
    })
  }

  private readArray() {
    this.tokens.push({
      type: TokenType.ArrayStart
    });
    this.index++;
    this.ignore();
    if (this.text.charAt(this.index) === ']') {
      this.index++;
    } else {
      while (this.index < this.text.length) {
        this.ignore();
        this.run();
        this.ignore();
        const ch = this.text.charAt(this.index);
        if (ch === ']') {
          this.index++;
          break;
        }
        if (ch === ',') {
          this.index++;
          this.ignore();
          if (this.text.charAt(this.index) === ']') {
            this.index++;
            break;
          }
        } else {
          throw new Error('数组没有正确结束！');
        }
      }
    }

    this.tokens.push({
      type: TokenType.ArrayEnd
    })
  }

  private readKey() {
    const ch = this.text.charAt(this.index);
    if (ch === '"' || ch === '\'') {
      this.tokens.push({
        type: TokenType.Key,
        text: this.readString(ch)
      })
    } else {
      let key = ch;
      while (this.index < this.text.length) {
        const next = this.peek();
        this.index++;
        if (next === ':' || this.isEmpty(next)) {
          break;
        }
        key += next;
      }
      this.tokens.push({
        type: TokenType.Key,
        text: key
      })
    }
  }

  private readNumber() {
    let value = '';
    let appearedDot = false;
    while (this.index < this.text.length) {
      //取当前的字符串，并且转小写，因为有可能是科学计数法，中间会有e;
      const ch = this.text.charAt(this.index).toLowerCase();
      if (ch === '.') {
        //如果是以小数点开头，
        if (!this.isNumber(this.peek())) {
          throw new Error(`解析数字${value}出错，.后面不能为${this.peek()}！`);
        }
        if (appearedDot) {
          throw new Error(`解析数字${value}出错，后面不能为.！`);
        }
        value += ch;
        appearedDot = true;
      } else if (this.isNumber(ch)) {
        value += ch;
      } else {
        const nextText = this.peek();
        if (ch === 'e' && this.isExpOperator(nextText)) {
          //如果当前为e,并且后面一位是数字或+-号，则断定为科学计数法
          value += ch;
        } else if (this.isExpOperator(ch) && nextText && this.isNumber(nextText) && value.charAt(value.length - 1) === 'e') {
          // 如果当前是 +- 号，并且有下一位，且下一位是数字，并且当前值的最后一位是 e，则断定为正确的科学计数法
          // 这里只能是 +- 号，因为数字会走前面的分支
          value += ch;
        } else if (this.isExpOperator(ch) && (!nextText || !this.isNumber(nextText)) && value.charAt(value.length - 1) === 'e') {
          // 如果当前是 +- 号，
          // 并且没有下一位，或者且下一位不是数字，并且当前值的最后一位是 e，则断定数字解析出错
          // 这里只能是 +- 号，因为数字会走前面的分支
          throw new Error(`${value}${ch}不是一个正确的数字！`)
        } else {
          break;
        }
      }
      this.index++;
    }
    return Number(value);
  }

  private readString(quote: string) {
    let value = '';
    // 是否有转义
    let escape = false;
    this.index++;
    while (this.index < this.text.length) {
      let ch = this.text.charAt(this.index);
      if (escape) {
        // 如果有转义
        if (ch === 'u') {
          // 如果是 unicode 编码，向后取 4 位
          const hexCode = this.text.substring(this.index + 1, this.index + 5);
          if (/[\da-f]{4}/i.test(hexCode)) {
            // 如果符合 unicode 编码
            value += String.fromCharCode(parseInt(hexCode, 16));
            // 加 4 是因为后面的 this.index++
            this.index += 4;
          } else {
            throw new Error(`转义 ${hexCode} 失败，或者 ${hexCode} 不是一个合法的 unicode 字符`);
          }
        } else {
          value += ESCAPE[ch] || ch;
        }
        escape = false;
      } else if (ch === '\\') {
        // 如果遇到转义
        escape = true;
      } else if (ch === quote) {
        // 如果遇到和初始引号相同的引号，则字符串读取结束
        this.index++;
        break;
      } else {
        value += ch;
      }
      this.index++;
    }

    return value;
  }

  private expect(text: string) {
    return this.text.slice(this.index, this.index + text.length) === text;
  }

  private peek(count = 1) {
    const index = this.index + count;
    return this.text.charAt(index);
  }

  private skipLineComment() {
    while (this.index < this.text.length) {
      const ch = this.text.charAt(this.index);
      if (ch === '\n') {
        break;
      }
      this.index++;
    }
  }

  private skipBlockComment() {
    while (this.index < this.text.length) {
      const ch = this.text.charAt(this.index);
      if (ch === '*') {
        if (this.peek() === '/') {
          this.index += 2;
          break;
        }
      }
      this.index++;
    }
  }

  private ignore() {
    while (this.index < this.text.length) {
      const ch = this.text.charAt(this.index);
      if (this.isEmpty(ch)) {
        this.index++;
      } else if (ch === '/') {
        if (this.expect('//')) {
          this.index += 2;
          this.skipLineComment();
        } else if (this.expect('/*')) {
          this.index += 2;
          this.skipBlockComment();
        } else {
          throw new Error(`不兼容的 JSON 格式 \`${this.text.substring(this.index)}\``);
        }
      } else {
        break;
      }
    }
  }

  private isExpOperator(text: string) {
    // 主要用于校验科学计数法e后面的内容
    return text === '+' || text === '-' || this.isNumber(text);
  }

  private isNumber(ch: string) {
    return typeof ch === 'string' && ch >= '0' && ch <= '9';
  }

  private isEmpty(ch: string) {
    return [' ', '\n', '\t', '\n', '\v', '\u00A0'].indexOf(ch) > -1;
  }
}
