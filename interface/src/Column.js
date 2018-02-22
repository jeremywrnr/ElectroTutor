import React, { Component } from 'react'
import { Grid, Header } from 'semantic-ui-react'

class Column extends Component {
  static defaultProps = {
    tLink: undefined,
    title: undefined,
  };

  render () {
    var head
    if (this.props.tLink !== undefined) {
      head = <Header size='large'> <a href={this.props.tLink} target="_blank">{this.props.header}</a> </Header>
    } else if (this.props.header) {
      head = <Header>{this.props.header}</Header>
    } else {
      head = null
    }

  return (
    <Grid.Column className="full">
      {head}
      <div className='full column-content'>{this.props.main}</div>
    </Grid.Column>
    )
  }
}

export default Column
