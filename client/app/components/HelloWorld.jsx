import React, { PropTypes } from 'react';
import 'styles/application.sass';
import imgReact from 'images/react.png'
import imgRor from 'images/ror.png'

export default class HelloWorld extends React.Component {

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);

    // How to set initial state in ES6 class syntax
    // https://facebook.github.io/react/docs/reusable-components.html#es6-classes
    this.state = { name: this.props.name };
  }

  updateName  (name) {
    this.setState({ name });
  }

  render() {
    return (
      <div>
        <img src={imgRor} width="100px" className="ror" />
        <div className="form">
          <h3>
            Hello, {this.state.name}!
          </h3>
          <form >
            <label htmlFor="name">
              Say hello to:
            </label>
            <input
              id="name"
              type="text"
              value={this.state.name}
              onChange={(e) => this.updateName(e.target.value)}
            />
          </form>
        </div>
      </div>
    );
  }
}
