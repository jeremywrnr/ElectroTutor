import React, { Component } from "react";
import { Accordion, Button, Message } from "semantic-ui-react";
import PropTypes from "prop-types";

class AccordionTestItem extends Component {
  static propTypes = {
    handleClick: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    test: PropTypes.object.isRequired
  };

  handlePassIcon = {
    test: "info",
    pass: "check",
    fail: "error"
  };

  render() {
    if (!this.props.data) {
      return null;
    }

    // test type and progress status
    const data = this.props.data;
    const test = this.props.test;
    const state = data.state;
    const pass = state === "pass";
    const desc = test.description;
    const info = test.info; // quick tip info, no icon
    const icon = !info && this.handlePassIcon[state];
    const patch = () => this.props.handleClick(data, test);

    return (
      <div className="full">
        <Message
          compact
          icon={icon}
          success={icon && pass}
          error={icon && !pass}
        >
          {desc} state: {state} icon: {icon}
        </Message>
        <Button fluid onClick={() => patch(test, data)}>
          Check Condition
        </Button>
      </div>
    );
  }
}

export default class AccordionStyled extends Component {
  static propTypes = {
    handleClick: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    run: PropTypes.func
  };

  static defaultProps = {
    run: function() {},
    data: []
  };

  render() {
    let tests = this.props.tests;
    let data = this.props.data;
    let activeIndex = tests.map((x, i) => i);
    let progress = tests.map((t, i) => {
      const match = data.find(d => d.test_id === t.id);
      return {
        test: t,
        data: match || {},
        handleClick: this.props.handleClick
      };
    });

    const panels = progress.map((t, i) => {
      return {
        title: { content: t.test.title, key: `title-${i}` },
        content: {
          content: <AccordionTestItem key={`test-${i}`} {...t} />
        }
      };
    });

    return (
      <Accordion
        defaultActiveIndex={activeIndex}
        exclusive={false}
        panels={panels}
        styled
      />
    );
  }
}
