import React, {Component} from 'react';
import {Card, Header} from 'semantic-ui-react';

// TODO add some progress information for the user

class ListSelector extends Component {
  static defaultProps = {
    items: [],
  };

  render() {
    const items = this.props.items;

    return (
      <div>
        <Header size="huge"> {this.props.title} </Header>
        <Card.Group>
          {items.map(t => (
            <Card
              id={+t.id} // accessible in parent
              image={t.image}
              header={t.title}
              onClick={this.props.onClick}
              description={t.description}
              meta="Progress: "
              key={t.id}
            />
          ))}
        </Card.Group>
      </div>
    );
  }
}

export default ListSelector;
