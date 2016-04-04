import * as moment from "moment"
import numeral from "numeral"
import {flattenDeep} from "lodash"
import {Printer} from "./../printer/abstract-printer";
import * as utils from "./../../utils"
import {wrapped, basicWrap, spaces} from "./../../utils";

export class JsTemplateInterpreter {

  constructor(private printer: Printer,
              private template: string,
              private order: {[key:string]:any},
              private message) {}

  public print() {
    const order = this.order
    fillOrder(order)
    const printer = this.printer
    const template = this.template
    const message = this.message
    const locale = message.locale ? message.locale : "en";
    (function() {
      // Structural functions
      const receipt = (...args): Receipt => {
        let opts = {}
        const children = flattenDeep(args)
        if (isOpts(args[0])) {
          opts = args[0]
          children.shift()
        }
        return new Receipt(printer, opts, children)
      }
      const n = (times): NewLine =>
        new NewLine(printer, {}, typeof times === "number" ? times : 1)
      const divider = (): Divider =>
        new Divider(printer, {})
      const title = (f, s): Title =>
        new Title(printer, f instanceof Object ? f : {}, f instanceof Object ? s : f)
      const text = (f, s): Text =>
        new Text(printer, f instanceof Object ? f : {}, f instanceof Object ? s : f)
      const row = (...args): Row => {
        let opts = {}
        let cols = flattenDeep(args)
        if (isOpts(args[0])) {
          opts = args[0]
          cols.shift()
        }
        return new Row(printer, opts, cols)
      }
      const col = (f, s): Column =>
        new Column(printer, f instanceof Object ? f : {}, f instanceof Object ? s : f)
      const bitmap = (f, s): Bitmap =>
        new Bitmap(printer, f instanceof Object ? f : {}, f instanceof Object ? s : f)

      // Textual functions
      const upperCase = (s: string): string => s.toUpperCase()
      const formatDate = (ts: number, f: string, l: string): string => {
        return moment.unix(ts / 1000).locale(l ? l : locale).format(f)
      }
      const formatDecimal = (d: number, f: string, l: string): string => {
        if (!l) l = locale
        try {
          numeral.language(locale)
        } catch (e) {
          numeral.language("en")
          console.log('WARN: Unknown locale for decimal formatting. Fallback to "en".')
        }
        return numeral(d).format(f)
      }

      // Iteration helpers
      const walkItems = (f): Node[] => walkOrder(order, f)

      // Order shortcuts
      let orderVars = ""
      for (const property in order) {
        if (order.hasOwnProperty(property)) {
          orderVars += `const ${property} = order.${property};\n`
        }
      }
      // Computed properties
      const isPickup = order["dispatchState"] === 1

      const result: Receipt = eval(orderVars + template)
      result.interpret()
    })()
  }
}

function fillOrder(order) {
  if (!order.items) order.items = []
  for (const item of order.items) {
    if (!item.modifiers) item.modifiers = []
  }
}

function isOpts(arg) {
  return !(arg instanceof Node) && arg instanceof Object
}

function walkOrder(order, f) {
  let result = []
  walkItems(order.items, f, 0, [], result)
  return result
}

function walkItems(items, f, depth, parents, acc) {
  if (!items || items.length == 0) return
  for (const item of items) {
    walkItems(item.modifiers, f, depth + 1, parents.concat(item), acc)
    acc.push(f(item, depth, parents))
  }
}


const ATTR_BITMAP_INDEX = "i";
const ATTR_LOCALE = "locale";
const ATTR_WIDTH = "width";
const ATTR_STYLE = "style";
const ATTR_ALIGN = "align";
const ATTR_TRIM = "trim";
const ATTR_WRAPPED = "wrapped";
const ATTR_FORMAT = "format";
const STYLE_BOLD = "bold";
const STYLE_TITLE = "title";
const STYLE_INVERTED = "inverted";
const ALIGN_LEFT = "left";
const ALIGN_CENTER = "center";
const ALIGN_RIGHT = "right";

type Opts = {[key:string]:any}

abstract class Node {
  public printerWidth = 0
  public locale = "en"

  constructor(protected printer: Printer, protected opts: Opts) {}

  interpret() {
    const opts = this.opts || {}
    this.applyStyles(opts["style"])
    this.applyAlign(opts["align"])
  }

  protected write = (text: string, width: number, shouldWrap: boolean) => {
    if (shouldWrap) {
      for (const line of wrapped(text, width)) {
        this.printer.print(line)
      }
    } else {
      this.printer.print(text)
    }
    this.printer.reset()
  }

  protected applyStyles = (styles: string) => {
    if (!styles) return
    for (const style of styles.split(" ")) {
      switch (style) {
        case STYLE_BOLD:
          this.printer.emph(true)
          break
        case STYLE_INVERTED:
          this.printer.invertBw(true)
          break
        case STYLE_TITLE:
          this.printer.size2x()
          this.printer.emph(true)
          this.printer.center()
          break
      }
    }
  }

  protected applyAlign = (align: string) => {
    if (!align) return false
    switch (align) {
      case ALIGN_CENTER: this.printer.center(); return
    }
  }

  protected isDoubleWidth = (styles: string): boolean => {
    if (!styles) return false
    for (const style of styles.split(" ")) {
      switch (style) {
        case STYLE_TITLE: return true
      }
    }
    return false
  }
}

class Receipt extends Node {
  constructor(printer: Printer, opts: Opts, private children: Node[]) {
    super(printer, opts)
    this.printerWidth = this.opts["width"]
    this.locale = this.opts["locale"]
  }
  interpret() {
    super.interpret()
    flattenDeep(this.children).map((c: Node) => {
      if (c === null) return
      c.printerWidth = this.printerWidth
      c.locale = this.locale
      c.interpret()
    })
  }
}

class NewLine extends Node {
  constructor(printer: Printer, opts: Opts, private amount: number) {
    super(printer, opts)
  }
  interpret() {
    for (let i = 0; i < this.amount; i++) this.printer.newLine()
  }
}

class Divider extends Node {
  interpret() {
    this.printer.divider()
  }
}

class Title extends Node {
  constructor(printer: Printer, opts: Opts, private text: string) {
    super(printer, opts)
    this.text = this.text.toString()
  }
  interpret() {
    super.interpret()
    this.applyStyles(STYLE_TITLE)
    this.write(this.text, this.printerWidth, this.opts[ATTR_WRAPPED])
  }
}

class Text extends Node {
  constructor(printer: Printer, opts: Opts, private text: string) {
    super(printer, opts)
    this.text = this.text.toString()
  }
  interpret() {
    super.interpret()
    this.write(this.text, this.printerWidth, this.opts[ATTR_WRAPPED])
  }
}

class Row extends Node {
  constructor(printer: Printer, opts: Opts, private cols: Column[]) {
    super(printer, opts)
  }
  interpret() {
    super.interpret()
    let remainingWidth = this.printerWidth
    if (this.isDoubleWidth(this.opts["style"])) remainingWidth = Math.floor(remainingWidth / 2);
    const flexible: Column[] = []
    for (const col of this.cols) {
      if (col.width === "*") {
        flexible.push(col)
      } else {
        if (col.trimmed) {
          col.text = col.text.trim()
        }
        col.computedWidth = this.parseWidth(col.width, col.text.length)
        remainingWidth -= col.computedWidth
      }
    }
    const remainingPart = Math.floor(remainingWidth / flexible.length)
    for (let i = 0; i < flexible.length - 1; i++) {
      flexible[i].computedWidth = remainingPart
      remainingWidth -= remainingPart
    }
    if (flexible.length > 0) flexible[flexible.length - 1].computedWidth = remainingWidth

    const matrix: string[][] = []
    let maxLines = 0
    for (const col of this.cols) {
      const w = col.computedWidth
      const lines = col.wrapped ? utils.wrapped(col.text, w) : basicWrap(col.text, w)
      matrix.push(lines)
      if (lines.length > maxLines) maxLines = lines.length
    }
    for (const lines of matrix) {
      const d = maxLines - lines.length
      for (let i = 0; i < d; i++) lines.push("")
    }
    for (let i = 0; i < maxLines; i++) {
      let result = ""
      for (let j = 0; j < this.cols.length; j++) {
        const col = this.cols[j]
        const line = matrix[j][i]
        const w = col.computedWidth
        const remaining = w - line.length
        let s
        if (col.align === ALIGN_CENTER) {
          const l = Math.floor(remaining / 2)
          const r = remaining - l
          s = spaces(l) + line + spaces(r)
        } else if (col.align === ALIGN_RIGHT) {
          s = spaces(remaining) + line
        } else {
          s = line + spaces(remaining)
        }
        result += s
      }
      this.printer.print(result)
    }
    this.printer.reset()
  }
  private parseWidth = (width: string, defaultWidth: number): number => {
    if (!width || !this.isInt(width)) return defaultWidth
    return parseInt(width)
  }
  private isInt = (i: string): boolean => !isNaN(parseInt(i))
}

class Column extends Node {
  width = this.opts["width"]
  align = this.opts["align"]
  wrapped = this.opts["wrapped"]
  trimmed = this.opts["trimmed"]
  computedWidth: number
  constructor(printer: Printer, opts: Opts, public text: string) {
    super(printer, opts)
    if (!this.text) this.text = ""
    this.text = this.text.toString()
  }
  interpret() {
    // Parent does the interpretation
  }
}

class Bitmap extends Node {
  constructor(printer: Printer, opts: Opts, private i: number) {
    super(printer, opts)
  }
  interpret() {
    super.interpret()
    this.printer.printNvBitmap(this.i)
  }
}