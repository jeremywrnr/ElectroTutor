import React, { Component } from "react";
import { Accordion, Button, Message } from "semantic-ui-react";
import PropTypes from "prop-types";

class AccordionTestItem extends Component {
  static defaultProps = {
    data: {},
    test: {}
  };

  handlePassIcon = {
    test: "info",
    pass: "check",
    fail: "error"
  };

  render() {
    // test type and progress status
    const info = this.props.test.info;
    const state = this.props.data.state;
    const pass = state === "pass";
    const icon = !info && this.handlePassIcon[state];
    const desc = this.props.test.description;

    return (
      <div className="full">
        <Message
          compact
          basic
          icon={icon}
          success={icon && pass}
          error={icon && !pass}
        >
          {desc} {pass}
        </Message>
        <Button fluid onClick={() => this.props.onClick(this.props.data)}>
          Check Condition
        </Button>
      </div>
    );
  }
}

export default class AccordionStyled extends Component {
  static propTypes = {
    patchData: PropTypes.func.isRequired,
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
      return { test: t, data: match };
    });

    const panels = progress.map((t, i) => {
      return {
        title: { content: t.test.title, key: `title-${i}` },
        content: {
          content: <AccordionTestItem {...t} onClick={this.props.patchData} />
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
