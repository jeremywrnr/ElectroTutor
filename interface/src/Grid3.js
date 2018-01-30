import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'

class Grid3 extends Component {
  render () {
    return (
      <Grid columns='three' divided>
        <Grid.Row>
          <Grid.Column>
            <div>{this.props.left}</div>
          </Grid.Column>
          <Grid.Column>
            <div>{this.props.middle}</div>
          </Grid.Column>
          <Grid.Column>
            <div>{this.props.right}</div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      )
  }
}

export default Grid3
