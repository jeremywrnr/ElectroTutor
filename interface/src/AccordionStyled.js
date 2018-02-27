import React, { Component } from 'react'
import { Accordion, Button, Message, Icon } from 'semantic-ui-react'
import PropTypes from 'prop-types';

class AccordionTestItem extends Component {
  static defaultProps = {
    data: {},
    test: {},
  };

  handlePassIcon = {
    newt: 'info',
    pass: 'check',
    fail: 'error',
    info: false,
  };

  render() {
    // test type
    let pass = this.props.test.pass
    const icon = this.handlePassIcon[pass]
    const desc = this.props.test.description

    // user progress
    let comp = this.props.data.completed
    return (
      <div className="full">
        <Message
          compact
          basic
          icon={icon}
          success={icon && comp}
          error={icon && !comp}>{desc}
        </Message>
          <Button fluid>Check Condition</Button>
      </div>
      )
  }
}

export default class AccordionStyled extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    run: PropTypes.func,
  };

  static defaultProps = {
    run: function() {},
    data: [],
  };

  render() {
    let tests = this.props.tests
    let data = this.props.data
    let activeIndex = tests.map((x, i) => i)
    let progress = tests.map((t, i) => {
      const match = data.find(d => d.test_id === t.id)
      return {test: t, data: match}
    })

    const panels = progress.map((t, i) => {
      return {
        title: { content: t.test.title, key: `title-${i}`, },
        content: { content: (<AccordionTestItem {...t} />) },
    }
  })

  return (
    <Accordion
      defaultActiveIndex={activeIndex}
      exclusive={false}
      panels={panels}
      styled
    />)
}
}
