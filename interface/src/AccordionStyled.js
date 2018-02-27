import React, { Component } from 'react'
import { Accordion, Segment } from 'semantic-ui-react'
import PropTypes from 'prop-types';

class AccordionTestItem extends Component {
  render() {
    return (
      <div className='full'>
        {this.props.desc}
      </div>
      )
  }
}

export default class AccordionStyled extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
  };

  static defaultProps = {
    data: [],
  };

  render() {
    const tests = this.props.tests
    const data = this.props.data
    const activeIndex = tests.map((x, i) => i)

    console.log(data)

    const progress = tests.map((t, i) => {
      const match = data.find(d => d.test_id === t.id)
      return {test: t, data: match}
    })

    console.log(progress)

    const panels = this.props.tests.map((t, i) => {
      return {
        title: { content: t.title, key: `title-${i}`, },
        content: { content: ( <AccordionTestItem desc={t.description} />) },
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
