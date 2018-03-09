import React, {Component} from 'react';
import {Accordion, Header, Label} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import TestRunner from './TestRunner.js';

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
      <Header as="h4" color={color}>
        {this.props.test.title}
      </Header>
    );
  }
}

class AccordionTestItem extends Component {
  static propTypes = {
    handleClick: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    test: PropTypes.object.isRequired,
  };

  // TODO - check that the expected output matched and pass back true or false
  // from this call rather than computing itin the parent container

  handleRunText = {
    dynamic: 'Examine',
    manual: 'Confirm',
    question: 'Submit',
    multiple: 'Submit',
    numeric: 'Measure',
  };

  handlePassColor = {
    test: 'grey',
    pass: 'green',
    fail: 'red',
  };

  render() {
    // test type and progress status
    const t = this.props.test;
    const d = this.props.data;

    // Passing in progress data, and the current state to set.
    // The correctness check is performed in the individual test runner
    const patch = state => this.props.handleClick(d, state);
    const info = t.info;
    const form = t.form;
    const state = d.state;
    const rtext = !info && this.handleRunText[form];
    const color = !info && this.handlePassColor[state];

    const tProps = {
      ...this.props,
      patch,
      info,
      form,
      rtext,
      color,
    };

    return <TestRunner {...tProps} />;
  }
}

export default class AccordionStyled extends Component {
  static propTypes = {
    handleClick: PropTypes.func.isRequired,
    tests: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
  };

  static defaultProps = {
    tests: [],
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

  // TODO have smarter way for whether the tests are expanded at first

  render() {
    const tests = this.props.tests;
    const data = this.props.data;
    const activeIndex = tests.map((x, i) => i);
    const progress = tests.map((t, i) => {
      const match = data.find(d => d.test_id === t.id) || {};
      return {
        test: t,
        data: match,
        handleClick: this.props.handleClick,
      };
    });

    const panels = this.generatePanels(progress);

    return (
      <Accordion
        fluid
        className="test-accordion"
        defaultActiveIndex={activeIndex}
        exclusive={false}
        panels={panels}
        styled
      />
    );
  }
}
