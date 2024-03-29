import React, {Component} from 'react';
import {Grid} from 'semantic-ui-react';
import Column from './Column.js';

class Grid3 extends Component {
  static defaultProps = {
    mHead: '',
    rHead: '',
  };

  render() {
    return (
      <Grid className="full" columns="three">
        <Grid.Row>
          <Column
            key="left-col"
            main={this.props.left}
            header={this.props.title}
            tLink={this.props.tLink}
          />

          <Column
            id="middle-col"
            key="middle-col"
            header={this.props.mHead}
            main={this.props.middle}
          />

          <Column
            key="right-col"
            main={this.props.right}
            header={this.props.rHead}
          />
        </Grid.Row>
      </Grid>
    );
  }
}

export default Grid3;
