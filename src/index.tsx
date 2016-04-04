import './main.css'
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './app';

class Main extends React.Component<{}, {}> {
  public render(): React.ReactElement<{}> {
    return (
      <App />
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('app'));
