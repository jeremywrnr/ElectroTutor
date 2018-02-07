import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import Column from './Column.js'

class Grid3 extends Component {
  static defaultProps = {
    mHead: '',
  };

  render () {
    return (
      <Grid className="full" columns='three'>
        <Grid.Row>
          <Column
            key='left-col'
            main={this.props.left}
            header={this.props.title}
            tLink={this.props.tLink} />

          <Column
            key='middle-col'
            main={this.props.middle}
            header={this.props.mHead} />

          <Column
            key='right-col'
            main={this.props.right}
            header='Testing' />
        </Grid.Row>
      </Grid>
      )
  }
}

export default Grid3
