import React, { Component } from 'react'
import { Grid, Header } from 'semantic-ui-react'

class Column extends Component {
  render () {
    return (
      <Grid.Column>
        <Header size='huge'>{this.props.header}</Header>
        <div>{this.props.main}</div>
      </Grid.Column>
      )
  }
}

export default Column
