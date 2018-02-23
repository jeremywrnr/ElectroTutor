import React, { Component } from 'react'
import { Accordion } from 'semantic-ui-react'

export default class AccordionStyled extends Component {
  render() {
    const pullData = t => ({ title: t.title , content: t.description, })

    const renderTests = this.props.tests.map(pullData)

    return <Accordion panels={renderTests} defaultActiveIndex={[]} exclusive={false} styled />
}
}
