import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import Column from './Column.js'

class Grid3 extends Component {
  render () {
    return (
      <Grid columns='three' divided>
        <Grid.Row>
          <Column
            main={this.props.left}
            header='Test Driven Tutorial' />

          <Column
            main={this.props.middle}
            header='Software' />

          <Column
            main={this.props.right}
            header='Hardware' />
        </Grid.Row>
      </Grid>
      )
  }
}

export default Grid3
