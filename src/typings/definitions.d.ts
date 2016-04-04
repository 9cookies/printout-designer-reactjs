// Monkey-patch built-in types https://github.com/Microsoft/TypeScript/issues/5944
interface Array<T> {
  clear(): void
}

// https://www.npmjs.com/package/jsx-control-statements
declare function If (condition: any): any;
declare function For(each: string, index: string, of: any): any;
declare var Else: any;
declare var Choose: any;
declare function When (condition: any): any;

// https://gitlab.com/Thecavepeanut/material-react-ts/blob/master/ws-global-typings/react-tap-event-plugin/react-tap-event-plugin.d.ts
declare module 'react-tap-event-plugin' {
  var exports:()=>any;
  export = exports;
}

declare module 'sax' {
  var exports: any
  export default exports
}

declare module 'react-split-pane' {
  var exports: any
  export default exports
}

declare module 'react-codemirror' {
  var exports: any
  export default exports
}

declare module 'numeral' {
  var exports: any
  export default exports
}

declare module 'jquery' {
  var exports: any
  export default exports
}

declare module 'react-modal' {
  var exports: any
  export default exports
}

declare module 'filesaverjs' {
  export var saveAs: any
}
