import React from 'react';
import styles from './mutate.css'
import cssModules from 'react-css-modules';
import { connect } from 'react-redux';
import { setCreatedAhjs } from '../../actions/databaseActions';
import { bindActionCreators } from 'redux';


import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/java';
import 'brace/theme/github';


const codeHeader = (
  'import existingAhjs from "data-base-panel";\n\n' +
  'const mutate = (ahj) => {\n\t'
);

const codeFooter = (
  '\n\treturn ahj;\n};\n\n' +
  'const newAhjs = existingAhjs.map(mutate)\n\n' +
  'existingAhjs.set( newAhjs )\n'
);


class Mutate extends React.Component {
  constructor(props, context){
    super(props, context);
    this.updateCode = this.updateCode.bind(this);
    this.run = this.run.bind(this);
    this.approveResults = this.approveResults.bind(this);
    this.state = {
      code: "// Code"
    }
  }

  updateCode(newCode) {
    console.log('newCode',newCode);
    if( newCode.includes(codeHeader) && newCode.includes(codeFooter)){
      newCode = newCode.replace(codeHeader,'').replace(codeFooter,'');
      this.setState({
        code: newCode,
      });
    }
  }

  run(){
    const existingAhjs = JSON.parse(JSON.stringify(this.props.existingAhjs));
    const mutateStr = `(function (ahj) { ${
    this.state.code.split('\t').join('').split('\n').join(' ')
  } return ahj; })`;
    // console.log('mutate',JSON.parse(mutate));
    console.log('existingAhjs::::::::',existingAhjs.length);

    const mutateFunction = eval(mutateStr);

    console.log('mutateFunction',mutateFunction);

    const newAhjs = existingAhjs.map((ahj)=>(
      mutateFunction(JSON.parse(JSON.stringify(ahj)))
    )).filter(ahj=>(ahj));
    console.log('newAhjs COUNT::::::::', newAhjs.length);
    this.setState({ results:newAhjs })
  }

  approveResults(){
    if( this.state.results ){
      this.props.setCreatedAhjs(
        JSON.parse(
          JSON.stringify(
            this.state.results
          )
        )
      );
    }
  }

  render(){


    return (
      <div styleName="mutate-page">
        <div styleName="mutate-wrapper">
          <div styleName="mutate-caption"> Mutate Stuff </div>
          <div styleName="mutate-body">
            <div styleName="mutate-something-container">
              <div styleName="mutate-something">
                <div styleName="mutate-something-header"> Custom Mutation </div>
                <div styleName="mutate-container">
                  <AceEditor
                    mode="javascript"
                    theme="solarized_light"
                    onChange={this.updateCode}
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{$blockScrolling: true}}
                    value={ codeHeader + this.state.code + codeFooter }
                  />
                  <div styleName="submit-container">
                    <input type="submit" value="Run" onClick={this.run} />
                    <input type="submit" value="Approve Results" onClick={this.approveResults} />
                  </div>
                </div>
                <div styleName="mutate-results-container">
                  { this.state.results && 'RESULTS:' }
                  {
                    this.state.results &&
                    <AceEditor
                      theme="github"
                      mode="json"
                      onChange={this.updateCode}
                      name="UNIQUE_ID_OF_DIV2"
                      editorProps={{$blockScrolling: true}}
                      value={ JSON.stringify(this.state.results, null, 2) }
                    />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return Object.assign({},
    bindActionCreators({ setCreatedAhjs }, dispatch)
  )
};

const mapStateToProps = (state) => {
  const { existingAhjs } = state.database;
  return {
    existingAhjs
  }
};

const mutateExport = cssModules(Mutate, styles);


export default connect(mapStateToProps, mapDispatchToProps)(mutateExport);
