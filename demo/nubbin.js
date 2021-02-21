/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';

class Nubbin extends PureComponent {
  state = { active: false };

  render() {
    const { active } = this.state;
    const { children } = this.props;

    return (
      <div
        className={ `ddd-drag ${active ? 'ddd-drag--active' : ''}` }
        tabIndex="0"
        role="button"
        onClick={ () => this.setState({ active: !active }) }
        onKeyPress={ () => {} }>
        {children}
      </div>
    );
  }
}

export default Nubbin;
