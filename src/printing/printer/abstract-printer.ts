import {spaces, dashes} from "./../../utils";

export enum Justify { LEFT, CENTER, RIGHT }
export abstract class Printer {
  public width: number = 32

  // Primitives //////////////////////////////////////////////////////////////////////////////////

  public abstract size2xHeight()
  public abstract size2xWidth()
  public abstract size2x()
  public abstract sizeNormal()
  public abstract emph(on: boolean)
  public abstract fontA()
  public abstract fontB()
  public abstract justify(value: Justify)
  public abstract setLineHeight(n: number)
  public abstract resetLineHeight()
  public abstract invertBw(invert: boolean)
  public abstract print(text: string)
  public abstract printNvBitmap(i: number)

  // Composed ////////////////////////////////////////////////////////////////////////////////////

  public reset() {
    this.justify(Justify.LEFT)
    this.emph(false)
    this.sizeNormal()
    this.fontA()
    this.invertBw(false)
  }
  public newLine() {
    this.setLineHeight(1)
    this.print(" ")
    this.resetLineHeight()
  }
  public divider() {
    this.print(dashes(this.width))
  }
  public center() {
    this.justify(Justify.CENTER)
  }
  public centered(text: string) {
    this.center()
    this.print(text)
    this.reset()
  }
  public centeredEmphasized(text: string) {
    this.center()
    this.emph(true)
    this.print(text)
    this.reset()
  }
  public title(text: string) {
    this.size2x()
    this.emph(true)
    this.center()
    this.print(text)
    this.reset()
  }
  public titleLeftRight(left: string, right: string) {
    const text = left + spaces(this.width / 2 - left.length - right.length) + right;
    this.size2x();
    this.emph(true);
    this.print(text);
    this.reset();
  }
}