import React, {Component} from 'react';
import {Icon, Accordion, Header} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import TestRunner from './TestRunner.js';

class AccordionTestTitle extends Component {
  handlePassIcon = {
    test: 'info',
    pass: 'checkmark',
    fail: 'remove',
  };

  handlePassColor = {
    test: 'grey',
    pass: 'green',
    fail: 'red',
  };

  render() {
    // quick tip info, no icon
    const i = this.props.test.info || this.props.test.form === 'info';
    const state = this.props.pdata.state;
    const color = !i && this.handlePassColor[state];
    const pIcon = !i && this.handlePassIcon[state];
    return (
      <Header as="h4" color={color || 'grey'}>
        {!i && <Icon name={pIcon} />}
        {this.props.test.title}
      </Header>
    );
  }
}

class AccordionTestItem extends Component {
  static propTypes = {
    handleClick: PropTypes.func.isRequired,
    pdata: PropTypes.object.isRequired,
    test: PropTypes.object.isRequired,
  };

  handleRunText = {
    code: 'Check Code Selection',
    variable: 'Click to Measure Code Variable',
    dynamic: 'Click to Measure Signal Frequency',
    numeric: 'Click to Measure Voltage Signal',
    compile: 'Click to Attempt Compilation',
    upload: 'Click to Attempt Upload',
    autoupload: 'Click to Setup and Begin Test',
    question: 'Submit Answer',
    multiple: 'Submit Choice',
  };

  handlePassColor = {
    test: 'grey',
    pass: 'green',
    fail: 'red',
  };

  render() {
    // test type and progress status
    const t = this.props.test;
    const d = this.props.pdata;

    // Passing in progress data, and the current state to set.
    // The correctness check is performed in the individual test runner
    const patch = state => this.props.handleClick(d, state);
    const info = t.info;
    const form = t.form;
    const state = d.state;
    const rtext = (!info && this.handleRunText[form]) || 'Run';
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
  constructor(props) {
    super(props);
    this.state = {active: new Set()};
  }

  static propTypes = {
    handleClick: PropTypes.func.isRequired,
    tests: PropTypes.array.isRequired,
    pdata: PropTypes.array.isRequired,
  };

  static defaultProps = {
    tests: [],
    pdata: [],
  };

  generatePanels(progress) {
    return progress.map((t, i) => ({
      title: {
        onClick: this.handleTitleClick,
        content: <AccordionTestTitle {...t} />,
        key: `title-${i}`,
      },
      content: {
        content: <AccordionTestItem key={t.key} {...t} />,
        key: `content-${i}`,
      },
    }));
  }

  componentDidMount = () => {
    setTimeout(() => this.generateActive(), 10);
  };

  generateActive = () => {
    let active = this.state.active;
    const pdata = this.props.pdata;
    this.props.tests.map((t, i) => {
      const match = pdata.find(d => d.test_id === t.id);
      match && match.state !== 'pass' && active.add(i);
      return this.setState({active});
    });
  };

  handleTitleClick = (e, itemProps) => {
    const i = itemProps.index;
    let {active} = this.state;
    active.has(i) ? active.delete(i) : active.add(i);
    this.setState({active});
  };

  render() {
    const {tests, pdata, ...others} = this.props;
    const progress = tests.map((t, i) => {
      const match = pdata.find(d => d.test_id === t.id) || {};
      return {
        test: t,
        pdata: match,
        ...others,
      };
    });

    const active = Array.from(this.state.active);
    const panels = this.generatePanels(progress);
    return (
      <Accordion
        fluid
        styled
        className="test-accordion"
        activeIndex={active}
        exclusive={false}
        panels={panels}
      />
    );
  }
}
