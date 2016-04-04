export function load(key) {
  const item = localStorage.getItem(key)
  if (!item) return undefined
  return JSON.parse(item)
}

export function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function clear<T>(array: T[]) {
  while (array.length > 0) array.pop()
}
Array.prototype.clear = function() { return clear(this) }

export function nullOrBlank(s: string): boolean {
  return !s || !s.trim()
}

function nullToEmptyHelper(s: string, space: string): string {
  if (nullOrBlank(s)) return ""
  return s + space
}

export function nullToEmpty(s: string, space?: string): string {
  if (space == undefined) return nullToEmptyHelper(s, "")
  if (nullOrBlank(s)) return ""
  return s + space
}

export function repeated(n: number, char: string): string {
  let s = ""
  for (let i = 0; i < n; i++) {
    s += char
  }
  return s
}

export function spaces(n: number): string {
  return repeated(n, " ")
}

export function dashes(n: number): string {
  return repeated(n, "-")
}

export function basicWrap(s: string, width: number): string[] {
  const numOfLines = Math.floor((s.length + width - 1) / width)
  const lines = []
  for (let i = 0; i < numOfLines; i++) {
    const start = i * width
    const end = Math.min(s.length, start + width)
    lines.push(s.substring(start, end))
  }
  return lines
}

export function wrapped(s: string, width: number): string[] {
  const wrapped = wrap(s, width, "\n", true)
  return wrapped.split("\n")
}

// From Apache Commons
/**
 * <p>Wraps a single line of text, identifying words by <code>' '</code>.</p>
 *
 * <p>Leading spaces on a new line are stripped.
 * Trailing spaces are not stripped.</p>
 *
 * <pre>
 * WordUtils.wrap(null, *, *, *) = null
 * WordUtils.wrap("", *, *, *) = ""
 * </pre>
 *
 * @param str  the String to be word wrapped, may be null
 * @param wrapLength  the column to wrap the words at, less than 1 is treated as 1
 * @param newLineStr  the string to insert for a new line,
 *  <code>null</code> uses the system property line separator
 * @param wrapLongWords  true if long words (such as URLs) should be wrapped
 * @return a line with newlines inserted, <code>null</code> if null input
 */
export function wrap(str: string, wrapLength: number, newLineStr: string, wrapLongWords: boolean): string {
  if (str == null) return null
  if (newLineStr == null) newLineStr = "\n"
  if (wrapLength < 1) wrapLength = 1
  const inputLineLength = str.length
  let offset = 0
  let wrappedLine = ""

  while ((inputLineLength - offset) > wrapLength) {
    if (str.charAt(offset) === ' ') {
      offset++
      continue
    }
    let spaceToWrapAt = str.lastIndexOf(' ', wrapLength + offset)
    if (spaceToWrapAt >= offset) {
      // normal case
      wrappedLine += str.substring(offset, spaceToWrapAt)
      wrappedLine += newLineStr
      offset = spaceToWrapAt + 1
    } else {
      // really long word or URL
      if (wrapLongWords) {
        // wrap really long word one line at a time
        wrappedLine += str.substring(offset, wrapLength + offset)
        wrappedLine += newLineStr
        offset += wrapLength
      } else {
        // do not wrap really long word, just extend beyond limit
        spaceToWrapAt = str.indexOf(' ', wrapLength + offset)
        if (spaceToWrapAt >= 0) {
          wrappedLine += str.substring(offset, spaceToWrapAt)
          wrappedLine += newLineStr
          offset = spaceToWrapAt + 1
        } else {
          wrappedLine += str.substring(offset)
          offset = inputLineLength
        }
      }
    }
  }
  // Whatever is left in line is short enough to just pass through
  wrappedLine += str.substring(offset)
  return wrappedLine
}