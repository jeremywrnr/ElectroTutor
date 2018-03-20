/*eslint array-callback-return:0 eqeqeq:0*/

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CodeRunner from './runners/CodeRunner.js';
import ContinuityRunner from './runners/ContinuityRunner.js';
import ResistanceRunner from './runners/ResistanceRunner.js';
import CompileRunner from './runners/CompileRunner.js';
import UploadRunner from './runners/UploadRunner.js';
import DynamicRunner from './runners/DynamicRunner.js';
import NumericRunner from './runners/NumericRunner.js';
import MultipleRunner from './runners/MultipleRunner.js';
import QuestionRunner from './runners/QuestionRunner.js';
import ManualRunner from './runners/ManualRunner.js';
import {Segment, Message, Button} from 'semantic-ui-react';

// TODO cache the users last output to save their answers.
// TODO saving previous user input and output to reference in errors and also
// to help with the suggestion of fixes -> providing tips for fixing errors

class TestRunner extends Component {
  state = {};

  static propTypes = {
    pdata: PropTypes.object.isRequired,
    test: PropTypes.object.isRequired,
  };

  static defaultProps = {
    pdata: {},
    test: {},
  };

  generateTestRunner = tProps => {
    const form = tProps.test.form;
    if (tProps.button || form === 'info') {
      switch (form) {
        case 'code':
          return <CodeRunner {...tProps} />;
        case 'continuity':
          return <ContinuityRunner {...tProps} />;
        case 'resistance':
          return <ResistanceRunner {...tProps} />;
        case 'compile':
          return <CompileRunner {...tProps} />;
        case 'upload':
          return <UploadRunner {...tProps} />;
        case 'dynamic':
          return <DynamicRunner {...tProps} />;
        case 'numeric':
          return <NumericRunner {...tProps} />;
        case 'multiple':
          return <MultipleRunner {...tProps} />;
        case 'question':
          return <QuestionRunner {...tProps} />;
        case 'manual':
          return <ManualRunner {...tProps} />;
        case 'info':
          return <Message info content={this.props.test.description} />;
        default:
          return <Message error content={`unknown: ${tProps.test.form}`} />;
      }
    } else {
      return <Segment basic loading={true} content="Loading..." />;
    }
  };

  // hacky way to get reference to sibling element and pass in as a prop
  // https://stackoverflow.com/questions/38864033

  render() {
    const button = this.state.button;
    const tProps = {button, ...this.props};
    const render = tProps && !tProps.test.info;
    return (
      <div className="full">
        <Segment attached basic color={tProps.color || 'grey'}>
          {this.generateTestRunner(tProps)}
        </Segment>
        {render && (
          <Button
            basic
            attached="bottom"
            content={tProps.rtext}
            ref={button => !this.state.button && this.setState({button})}
          />
        )}
      </div>
    );
  }
}

export default TestRunner;
