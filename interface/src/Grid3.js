import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'

class Grid3 extends Component {
  render ({left, middle, right}) {
    return (
      <Grid columns='three' divided>
        <Grid.Row>
          <Grid.Column>
            <div>{left}</div>
          </Grid.Column>
          <Grid.Column>
            <div>{middle}</div>
          </Grid.Column>
          <Grid.Column>
            <div>{right}</div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      )
  }
}

export default Grid3
