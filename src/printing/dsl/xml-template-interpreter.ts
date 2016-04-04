import sax from "sax"
import * as moment from "moment"
import {Printer} from "./../printer/abstract-printer";
import * as utils from "./../../utils"
import {wrapped, basicWrap} from "./../../utils";
import {spaces} from "./../../utils";
import numeral from "numeral"

const ID_RECEIPT = "receipt";
const ID_BITMAP = "bitmap";
const ID_TITLE = "title";
const ID_ROW = "row";
const ID_COL = "col";
const ID_NEWLINE = "n";
const ID_TEXT = "text";
const ID_DIVIDER = "divider";
const ID_F_ID = "f-id";
const ID_F_TRIM = "f-trim";
const ID_F_BEANSHELL = "f-beanshell";
const ID_F_UPPERCASE = "f-uppercase";
const ID_F_DATE = "f-date";
const ID_F_DECIMAL = "f-decimal";
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

class Elem {
  text = ""
  constructor(public id: string, public attrs: {[key: string]: string}) {}
}

class Col {
  text = ""
  computedWidth: number
  constructor(
    public width: string,
    public align: string,
    public wrapped: boolean,
    public trimmed: boolean
  ) {}
}

export class XmlTemplateInterpreter {

  parser = sax.parser(true)
  elems: Elem[] = []
  cols: Col[] = []
  printerWidth: number
  locale: string

  constructor(private printer: Printer, private template: string) {
    this.initParser()
  }

  public print() {
    this.parser.write(this.template).close()
  }

  private get current(): Elem {
    return this.elems[this.elems.length - 1]
  }

  private get parent(): Elem {
    if (this.elems.length < 2) return null
    return this.elems[this.elems.length - 2]
  }

  private addParentText = (text: string) => {
    const parent = this.parent
    if (parent === null) return
    parent.text += text
    if (parent.id === ID_COL) {
      this.cols[this.cols.length - 1].text += text
    }
  }

  private initParser() {
    const p = this.parser

    p.onopentag = node => {
      this.elems.push(new Elem(node.name, node.attributes))
      const c = this.current

      switch (c.id) {
        case ID_RECEIPT:
          this.printerWidth = parseInt(node.attributes[ATTR_WIDTH])
          this.locale = node.attributes[ATTR_LOCALE]
          this.printer.width = this.printerWidth
          break
        case ID_COL:
          this.cols.push(new Col(
            c.attrs[ATTR_WIDTH],
            c.attrs[ATTR_ALIGN],
            c.attrs[ATTR_WRAPPED] === 'true',
            c.attrs[ATTR_TRIM] === 'true'
          ))
          break
      }
      if (this.isTrimmedByDefault(c.id)) {
        if (c.attrs[ATTR_TRIM] === undefined) c.attrs[ATTR_TRIM] = "true"
      }
    }

    p.ontext = text => {
      const c = this.current
      if (!c || c.id === ID_RECEIPT) return

      c.text += c.id === ID_F_TRIM ? text.trim() : text
      if (c.id === ID_COL) {
        this.cols[this.cols.length - 1].text += text
      }
    }

    p.onclosetag = () => {
      const c = this.current

      const trim = !!c.attrs[ATTR_TRIM]
      const wrapped = !!c.attrs[ATTR_WRAPPED]
      const width = this.parseWidth(c.attrs[ATTR_WIDTH], this.printerWidth)
      const align = c.attrs[ATTR_ALIGN]
      const style = c.attrs[ATTR_STYLE]

      const c_text = trim ? c.text.trim() : c.text

      switch (c.id) {
        case ID_BITMAP:
          this.applyAlign(align)
          this.printer.printNvBitmap(parseInt(c.attrs[ATTR_BITMAP_INDEX]))
          break

        case ID_F_ID:
          this.addParentText(c_text)
          break
        case ID_F_TRIM:
          this.addParentText(c_text)
          break
        case ID_F_BEANSHELL:
          this.addParentText(this.evalJs(c_text))
          break
        case ID_F_UPPERCASE:
          this.addParentText(c_text.toUpperCase())
          break
        case ID_F_DATE:
          const dateFormat = c.attrs[ATTR_FORMAT]
          const date = moment.unix(parseInt(c_text) / 1000).locale(this.locale).format(dateFormat)
          this.addParentText(date)
          break
        case ID_F_DECIMAL:
          const decimalFormat = c.attrs[ATTR_FORMAT]
          try {
            numeral.language(this.locale)
          } catch (e) {
            numeral.language("en")
            console.log('WARN: Unknown locale for decimal formatting. Fallback to "en".')
          }
          const n = numeral(parseFloat(c_text)).format(decimalFormat)
          this.addParentText(n)
          break

        case ID_NEWLINE:
          this.printer.newLine()
          break
        case ID_TITLE:
          this.applyStyles(STYLE_TITLE)
          this.write(c_text, this.printerWidth, wrapped)
          break
        case ID_TEXT:
          this.applyStyles(style)
          this.applyAlign(align)
          this.write(c_text, width, true)
          break
        case ID_DIVIDER:
          this.printer.divider()
          break

        case ID_ROW:
          this.applyStyles(style)

          let remainingWidth = this.printerWidth
          if (this.isDoubleWidth(style)) remainingWidth = Math.floor(remainingWidth / 2);
          const flexible: Col[] = []
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
          flexible[flexible.length - 1].computedWidth = remainingWidth

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
          this.cols.clear()
          break
      }

      this.elems.pop()
    }

    p.onerror = e => {
      // TODO
      console.log(e)
    }
  }

  private parseWidth = (width: string, defaultWidth: number): number => {
    if (!width || !this.isInt(width)) return defaultWidth
    return parseInt(width)
  }

  private isInt = (i: string): boolean => !isNaN(parseInt(i))

  private write = (text: string, width: number, shouldWrap: boolean) => {
    if (shouldWrap) {
      for (const line of wrapped(text, width)) {
        this.printer.print(line)
      }
    } else {
      this.printer.print(text)
    }
    this.printer.reset()
  }

  private applyStyles = (styles: string) => {
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

  private applyAlign = (align: string) => {
    if (!align) return false
    switch (align) {
      case ALIGN_CENTER: this.printer.center(); return
    }
  }

  private evalJs = (expr: string): string => {
    return eval(expr)
  }

  private isDoubleWidth = (styles: string): boolean => {
    if (!styles) return false
    for (const style of styles.split(" ")) {
      switch (style) {
        case STYLE_TITLE: return true
      }
    }
    return false
  }

  private isTrimmedByDefault = (id: string): boolean => {
    switch (id) {
      case ID_TITLE:
      case ID_TEXT:
      case ID_F_UPPERCASE:
        return true
    }
    return false
  }
}