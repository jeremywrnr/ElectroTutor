import React, { Component } from 'react'
import { Card, Container, Header } from 'semantic-ui-react'

// TODO add some progress information for the user

class ListSelector extends Component {
  static defaultProps = {
    items: [],
  }

  render() {
    const items = this.props.items

    return (
      <Container>
        <Header size='huge'> {this.props.title} </Header>
        <Card.Group>
          { items.map(t => (
          <Card
            id={+t.id} // accessible in parent
            image={t.image}
            header={t.title}
            onClick={this.props.onClick}
            description={t.description}
            meta='Progress: '
            key={t.id}
          /> ) ) }
        </Card.Group>
      </Container>
      )
  }
}

export default ListSelector
