import {Printer, Justify} from "./abstract-printer";
import {basicWrap, spaces} from "./../../utils";

export class ConsolePrinter extends Printer {

  justification = Justify.LEFT
  width2x = false

  size2xHeight() { }

  size2xWidth() { this.width2x = true }

  size2x() { this.width2x = true }

  sizeNormal() { this.width2x = false }

  emph(on:boolean) { }

  fontA() { }

  fontB() { }

  justify(value: Justify) {
    this.justification = value
  }

  setLineHeight(n: number) { }

  resetLineHeight() { }

  invertBw(invert: boolean) { }

  print(text: string) {
    if (this.width2x) {
      text = text.split('').join(' ')
    }
    if (text.length > 1) text = text.replace(/ /g, "_")
    for (let line of this.wrapped(text)) {
      if (this.justification === Justify.CENTER) {
        line = spaces(Math.floor((this.width - line.length) / 2)) + line
      }
      console.log(line)
    }
  }

  printNvBitmap(i: number) {
    this.print("$$$")
    this.print("BITMAP" + i)
    this.print("$$$")
  }

  private wrapped(s: string): string[] {
    return basicWrap(s, this.width)
  }
}