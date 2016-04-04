import {Printer, Justify} from "./abstract-printer";
import {basicWrap} from "./../../utils";

const size2xHeight = "size2xHeight"
const size2xWidth = "size2xWidth"
const size2x = "size2x"
const sizeNormal = "sizeNormal"
const emph = "emph"
const fontA = "fontA"
const fontB = "fontB"
const justifyLeft = "justifyLeft"
const justifyCenter = "justifyCenter"
const justifyRight = "justifyRight"
const invertBw = "invertBw"
const invertBwSpace = "invertBwSpace"

export class HtmlPrinter extends Printer {

  private _html = ""
  private classes: Set<string> = new Set()

  size2xHeight() {
    this.classes.delete(size2x)
    this.classes.add(size2xHeight)
  }

  size2xWidth() {
    this.classes.delete(size2x)
    this.classes.add(size2xWidth)
  }

  size2x() {
    this.classes.delete(size2xWidth)
    this.classes.delete(size2xHeight)
    this.classes.add(size2x)
  }

  sizeNormal() {
    this.classes.delete(size2xWidth)
    this.classes.delete(size2xHeight)
    this.classes.delete(size2x)
  }

  emph(on: boolean) {
    on ? this.classes.add(emph) : this.classes.delete(emph)
  }

  fontA() {
    this.classes.delete(fontB)
    this.classes.add(fontA)
  }

  fontB() {
    this.classes.delete(fontA)
    this.classes.add(fontB)
  }

  justify(value: Justify) {
    this.classes.delete(justifyLeft);
    this.classes.delete(justifyCenter);
    this.classes.delete(justifyRight);
    switch (value) {
      case Justify.LEFT: this.classes.add(justifyLeft); break;
      case Justify.CENTER: this.classes.add(justifyCenter); break;
      case Justify.RIGHT: this.classes.add(justifyRight); break;
    }
  }

  setLineHeight(n: number) {
    // TODO
  }

  resetLineHeight() {
    // TODO
  }

  invertBw(invert: boolean) {
    invert ? this.classes.add(invertBw) : this.classes.delete(invertBw)
  }

  printNvBitmap(i: number) {
    this.print("$$$")
    this.print("BITMAP" + i)
    this.print("$$$")
  }

  print(text: string) {
    const floor = Math.floor
    let s = ""
    s += "<pre class='pre"
    for (const c of this.classes) {
      if (c === invertBw) continue
      s += " " + c
    }
    s += "'"
    if (this.classes.has(size2xWidth) || this.classes.has(size2x)) {
      s += ` style='width:${floor(this.width/2)}ch; margin-left:${floor(this.width/4)}ch;'`
    }
    s += ">"
    if (this.classes.has(invertBw)) {
      for (let char of text.split('')) {
        let cls = invertBw
        if (char === ' ') {
          char = '_'
          cls = invertBwSpace
        }
        s += `<span class='${cls}'>${this.escapeHtml(char)}</span>`
      }
    } else {
      s += this.escapeHtml(text)
    }
    s += "</pre>\n"
    this._html += s
  }

  public get html(): string {
    return `
      <div class='shadow' style='width:${this.width}ch; margin:auto; padding:0 1ch; background:white'>
        <div class='tornTop'></div>
        ${this._html}
        <div class='tornBottom'></div>
      </div>
    `
  }

  private escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  private wrapped(s: string): string[] {
    return basicWrap(s, this.width)
  }
}