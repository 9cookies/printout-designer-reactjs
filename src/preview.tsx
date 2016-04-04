import * as React from 'react'
import "./printing/printer/html-printer.css"

export class ReceiptPreview extends React.Component<{html: string}, {}> {
  render() {
    return <div className="preview" dangerouslySetInnerHTML={{__html: this.props.html}}/>
  }
}