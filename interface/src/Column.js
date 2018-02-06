import React, { Component } from 'react'
import { Grid, Header } from 'semantic-ui-react'

class Column extends Component {
  static defaultProps = {
    tLink: undefined,
  };

  render () {
    var head
    if (this.props.tLink !== undefined) {
      head = <Header size='huge'> <a href={this.props.tLink} target="_blank">{this.props.header}</a> </Header>
    } else {
      head = <Header size='large'>{this.props.header}</Header>
    }

  return (
    <Grid.Column>
      {head}
      <div>{this.props.main}</div>
    </Grid.Column>
    )
  }
}

export default Column
