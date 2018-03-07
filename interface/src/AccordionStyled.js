import React, {Component} from 'react';
import {Accordion, Button, Segment, Label} from 'semantic-ui-react';
import PropTypes from 'prop-types';

class AccordionTestTitle extends Component {
  handlePassColor = {
    test: 'grey',
    pass: 'green',
    fail: 'red',
  };

  render() {
    // quick tip info, no icon
    const i = this.props.test.info;
    const state = this.props.data.state;
    const color = !i && this.handlePassColor[state];
    return (
      <Label size="large" color={color}>
        {this.props.test.title}
      </Label>
    );
  }
}

class AccordionTestItem extends Component {
  static propTypes = {
    handleClick: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    test: PropTypes.object.isRequired,
  };

  handlePassColor = {
    test: 'grey',
    pass: 'green',
    fail: 'red',
  };

  render() {
    // test type and progress status
    const t = this.props.test;
    const i = this.props.test.info;
    const patch = () => this.props.handleClick(this.props.data, t);

    const state = this.props.data.state;
    const color = !i && this.handlePassColor[state];

    return (
      <div className="full">
        <Segment attached basic color={color}>
          {this.props.test.description} <br /> state: {state}
        </Segment>
        {!i && (
          <Button attached="bottom" onClick={patch} content="Check Condition" />
        )}
      </div>
    );
  }
}

export default class AccordionStyled extends Component {
  static propTypes = {
    handleClick: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    run: PropTypes.func,
  };

  static defaultProps = {
    //run: function() {},
    data: [],
  };

  generatePanels(progress) {
    return progress.map((t, i) => ({
      title: {
        content: <AccordionTestTitle {...t} />,
        key: `title-${i}`,
      },
      content: {
        content: <AccordionTestItem key={t.key} {...t} />,
        key: `content-${i}`,
      },
    }));
  }

  render() {
    let tests = this.props.tests;
    let data = this.props.data;
    let activeIndex = tests.map((x, i) => i);
    let progress = tests.map((t, i) => {
      const match = data.find(d => d.test_id === t.id) || {};
      return {
        test: t,
        data: match,
        pass: !t.info && data.state === 'pass',
        fail: !t.info && data.state === 'fail',
        handleClick: this.props.handleClick,
      };
    });

    // Append success state to test list rendering
    let passed = progress.every(p => p.state === 'pass');
    if (passed) {
      progress.push({
        handleClick: this.props.handleClick,
        pass: true,
      });
    }

    const panels = this.generatePanels(progress);

    return (
      <Accordion
        className="test-accordion"
        defaultActiveIndex={activeIndex}
        exclusive={false}
        panels={panels}
        styled
      />
    );
  }
}
