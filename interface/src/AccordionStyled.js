import React, { Component } from 'react'
import { Accordion, Segment } from 'semantic-ui-react'

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
  static defaultProps = {
    data: [],
  }

  render() {
    const data = this.props.data
    const tests = this.props.tests
    const activeIndex = tests.map((x, i) => i)

    const progress = tests.map((x, i) => {
      const match = data.find(d => d.test_id === x.id)
      return [x, match]
    })

    console.log(this.props, progress)

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
