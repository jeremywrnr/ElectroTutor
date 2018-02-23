/**
 * Rendering and running tests
 */

import React from 'react';
import PropTypes from 'prop-types';
import Test from './Test.js'

class TestGroup extends React.Component {
  static propTypes = {
    tests: PropTypes.array.isRequired,
  }

  static defaultProps = {
    tests: [],
  }

  render() {
    const tests = this.props.tests

    return (
      <div>
      { tests.map( (t, i) => { return <Test task={t.description} pass={t.pass} output={t.output} key={i+1} i={i+1} /> }) }
      </div>
    )
  }
}

export default TestGroup
