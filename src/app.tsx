import * as React from 'react'
import Modal from "react-modal"
import SplitPane from 'react-split-pane'
import Codemirror from 'react-codemirror'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/javascript/javascript'
import {saveAs} from "filesaverjs"
import $ from "jquery"
import {debounce} from 'lodash'

import {load, save} from './utils'
import {HtmlPrinter} from "./printing/printer/html-printer";
import {JsTemplateInterpreter} from "./printing/dsl/js-template-interpreter";
import {ReceiptPreview} from "./preview"
import * as examples from "./example-files"


const CODE_EDITOR_OPTIONS = {
  extraKeys: {
    Tab(cm) {
      // Insert spaces when the tab key is pressed
      const spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
      cm.replaceSelection(spaces);
    },
  },
  indentWithTabs: false,
  lineNumbers: true,
  mode: 'javascript',
  tabSize: 2,
  theme: 'solarized light',
};

const TABS = ["Template", "Order", "Messages"]
const SOURCES = ["receipt({width: 32})", "{}", "{}"]
const KEY_SOURCES = "sources"


export class App extends React.Component<{}, any> {

  loadExampleModal: LoadExampleModal

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      value: 1,
      selectedTab: 0,
      sourceCodes: load(KEY_SOURCES) || SOURCES.map(v => v),
      error: "",
      output: ""
    }
  }

  // Lifecycle ////////////////////////////////////////////////////////////////////////////////////////
  
  componentDidMount() {
    this.interpret()
    const preview = $('.preview')
    // Force reflow due to scrollbar bug
    setTimeout(() => preview.hide().show(0), 1)
    preview.parent().css('background', preview.css('background'))
  }

  componentDidUpdate() {
    const errorHintHeight = $('#errorHint').outerHeight()
    $('.ReactCodeMirror').css('bottom', this.state.error ? errorHintHeight + 'px' : '0px')
  }

  // Methods //////////////////////////////////////////////////////////////////////////////////////////

  importData = (event: any) => {
    console.log(event.target.files)
    const r = new FileReader()
    r.onload = (e: any) => {
      const sourceCodes = JSON.parse(e.target.result)
      this.setState({sourceCodes})
    }
    r.readAsText(event.target.files[0])
  }

  exportData = () => {
    const blob = new Blob([JSON.stringify(this.state.sourceCodes)], {type: 'application/json'})
    saveAs(blob, "workspace.json")
  }

  handleTabClick = (i) => {
    this.setState({selectedTab: i})
  }

  updateCode = debounce((newSource) => {
    this.state.sourceCodes[this.state.selectedTab] = newSource
    this.setState({sourceCodes: this.state.sourceCodes})
    save(KEY_SOURCES, this.state.sourceCodes)
    this.interpret()
  }, 300)

  interpret = () => {
    const template = this.state.sourceCodes[0]
    const order = JSON.parse(this.state.sourceCodes[1])
    order.message = JSON.parse(this.state.sourceCodes[2])

    const printer = new HtmlPrinter()
    const interpreter = new JsTemplateInterpreter(printer, template, order, order.message)

    try {
      interpreter.print()
      const output = printer.html
      this.setState({output: output, error: ""})
    } catch (e) {
      this.setState({error: e.toString()})
    }
  }

  showLoadExampleDialog = () => {
    this.loadExampleModal.open()
  }

  handleLoadExample = (template, order, message) => {
    const s = this.state.sourceCodes
    s[0] = template
    s[1] = order
    s[2] = message
    this.setState({})
    save(KEY_SOURCES, s)
    this.interpret()
  }

  public render() {
    const sourceCode = this.state.sourceCodes[this.state.selectedTab]
    const error = this.state.error
    return (
      <div className="rpShell">
        <div style={{background: "#666"}}>
          <button onClick={this.showLoadExampleDialog}>Load Example</button>
          <LoadExampleModal onLoad={this.handleLoadExample} ref={r => this.loadExampleModal = r}/>
          <button onClick={() => $('#upload').trigger('click')}>Import</button>
          <input
            id="upload"
            style={{display: "none"}}
            type="file"
            onChange={this.importData}
            />
          <button onClick={this.exportData}>Export</button>
        </div>
        <SplitPane split="vertical" minSize="50"
          defaultSize={localStorage.getItem('splitPos') || "50%"}
          onChange={size => localStorage.setItem('splitPos', size)}
          >
          <div className="rpCodeEditor">
            <nav className="rpCodeEditorNav">
              {TABS.map((v,i) =>
                  <button
                    key={v}
                    className={this.state.selectedTab === i && 'rpButtonActive'}
                    onClick={() => this.handleTabClick(i)}
                    >
                    {v}
                  </button>
                )}
            </nav>
            <Codemirror
              onChange={this.updateCode}
              value={sourceCode}
              options={CODE_EDITOR_OPTIONS}
              />
            <If condition={error}>
              <div
                id="errorHint"
                style={{
                  position: "absolute",
                  zIndex: "100",
                  bottom: "0",
                  right: "0",
                  left: "0",
                  padding: "1em",
                  fontFamily: "monospace",
                  color: "white",
                  background: "crimson",
                  }}>
                {error}
              </div>
            </If>
          </div>
          <ReceiptPreview html={this.state.output}/>
        </SplitPane>
      </div>
    )
  }
}


class LoadExampleModal extends React.Component<any, any> {

  state = {
    open: false,
    template: Object.keys(examples.TEMPLATES)[0],
    language: Object.keys(examples.MESSAGES)[0],
    order: Object.keys(examples.ORDERS)[0],
  }

  close = () => this.setState({open: false})

  open = () => this.setState({open: true})

  handleOk = () => {
    const {template, language, order} = this.state
    this.props.onLoad(
      examples.TEMPLATES[template],
      examples.ORDERS[order],
      examples.MESSAGES[language])
    this.close()
  }

  mkOptions = (obj) => Object.keys(obj).map(k =>
    <option key={k} value={k}>{k}</option>)

  render() {
    const s = {display: "inline", marginRight: "1em"}
    return (
      <Modal
        isOpen={this.state.open}
        onRequestClose={this.close}
        >
        <h2>Load Example</h2>
        <div>
          <h4 style={s}>Template</h4>
          <select
            value={this.state.template}
            onChange={(event: any) => this.setState({template: event.target.value})}
            >
            {this.mkOptions(examples.TEMPLATES)}
          </select>
        </div>
        <div>
          <h4 style={s}>Language</h4>
          <select
            value={this.state.language}
            onChange={(event: any) => this.setState({language: event.target.value})}
            >
            {this.mkOptions(examples.MESSAGES)}
          </select>
        </div>
        <div>
          <h4 style={s}>Order</h4>
          <select
            value={this.state.order}
            onChange={(event: any) => this.setState({order: event.target.value})}
            >
            {this.mkOptions(examples.ORDERS)}
          </select>
        </div>
        <div style={{marginTop: "2em"}}/>
        <div>
          <button onClick={this.handleOk}>Ok</button>
          <button onClick={this.close}>Cancel</button>
        </div>
      </Modal>
    )
  }
}