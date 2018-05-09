import React from 'react';
import styles from './mutate.css'
import cssModules from 'react-css-modules';
import { connect } from 'react-redux';
import { setCreatedAhjs } from '../../actions/databaseActions';
import { bindActionCreators } from 'redux';
import MutateApi from '../../api/MutateApi';


import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/mode/json';

import 'brace/theme/chrome';
import 'brace/theme/clouds';
import 'brace/theme/clouds_midnight';
import 'brace/theme/cobalt';
import 'brace/theme/crimson_editor';
import 'brace/theme/dawn';
import 'brace/theme/eclipse';
import 'brace/theme/idle_fingers';
import 'brace/theme/kr_theme';
import 'brace/theme/merbivore';
import 'brace/theme/merbivore_soft';
import 'brace/theme/mono_industrial';
import 'brace/theme/monokai';
import 'brace/theme/pastel_on_dark';
import 'brace/theme/solarized_dark';
import 'brace/theme/solarized_light';
import 'brace/theme/textMate';
import 'brace/theme/tomorrow';
import 'brace/theme/tomorrow_night';
import 'brace/theme/tomorrow_night_blue';
import 'brace/theme/tomorrow_night_bright';
import 'brace/theme/tomorrow_night_eighties';
import 'brace/theme/twilight';
import 'brace/theme/vibrant_ink';

const themesMap =  {
  chrome:"Chrome",
  clouds:"Clouds",
  clouds_midnight:"Clouds Midnight",
  cobalt:"Cobalt",
  crimson_editor:"Crimson Editor",
  dawn:"Dawn",
  eclipse:"Eclipse",
  idle_fingers:"Idle Fingers",
  kr_theme:"Kr Theme",
  merbivore:"Merbivore",
  merbivore_soft:"Merbivore Soft",
  mono_industrial:"Mono Industrial",
  monokai:"Monokai",
  pastel_on_dark:"Pastel On Dark",
  solarized_dark:"Solarized Dark",
  solarized_light:"Solarized Light",
  textMate:"TextMate",
  tomorrow:"Tomorrow",
  tomorrow_night:"Tomorrow Night",
  tomorrow_night_blue:"Tomorrow Night Blue",
  tomorrow_night_bright:"Tomorrow Night Bright",
  tomorrow_night_eighties:"Tomorrow Night Eighties",
  twilight:"Twilight",
  vibrant_ink:"Vibrant Ink",
};


const codeHeader = (
  'import existingAhjs from "data-base-panel";\n\n' +
  'const mutate = ( item, index ) => {\n\t'
);

const codeFooter = (
  '\n\treturn item;\n};\n\n' +
  'const newAhjs = existingAhjs.map(mutate)\n\n' +
  'existingAhjs.set( newAhjs )\n'
);

const Grammar = {
  functionComponents: {
    head: '(function (item,index) {\n\t',
    code: "",
    footer: '\n\treturn item;\n})'
  },
  injectOrder: [ "head", "code", "footer" ],
  reformat: {
    toSimpleString: ( code ) => (
      code.trim().replace(/\s\s+/g, ' ').trim()
    )
  },
  deconstructTo:{
    code:(functionString)=>{
      return functionString.replace(Grammar.functionComponents.head, "")
        .replace(Grammar.functionComponents.footer, "")
    }
  }
};

const createMutateFunction = ( injectObject ) => {
  const {
    functionComponents,
    injectOrder
  } = Grammar;

  let mutateString = "";
  injectOrder.map( key => {
    const toInject = injectObject[ key ];

    if( !toInject && functionComponents[ key ] ) return mutateString += functionComponents[ key ];
    return mutateString += toInject;
  });

  return mutateString;
}


class Mutate extends React.Component {
  constructor(props, context){
    super(props, context);
    this.updateCode = this.updateCode.bind(this);
    this.run = this.run.bind(this);
    this.approveResults = this.approveResults.bind(this);
    this.changeTheme = this.changeTheme.bind(this);
    this.saveCode = this.saveCode.bind(this);
    this.fileNameChange = this.fileNameChange.bind(this);
    this.loadCode = this.loadCode.bind(this);
    this.state = {
      code: "// Code",
      theme: "tomorrow",
      fileName: null
    }
  }

  componentWillMount(){
    MutateApi.getAll()
      .then( fileMap => {
        console.log('componentWillMount:::fileMap:::::::\n',fileMap);
        this.setState({
          fileMap
        })
      })
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
    const { code } = this.state;

    const existingAhjs = JSON.parse(
      JSON.stringify( this.props.existingAhjs )
    );
    const mutateStr = Grammar.reformat.toSimpleString( createMutateFunction( { code } ) );

    console.log('mutateStr',mutateStr);

    console.log('existingAhjs::::::::',existingAhjs.length);

    const mutateFunction = eval(mutateStr);

    console.log('mutateFunction',mutateFunction);

    const newAhjs = existingAhjs.map( ( item, index )=>(
      mutateFunction(JSON.parse(JSON.stringify(item)), index)
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

  changeTheme(e){
    const theme = e.target.value;
    this.setState({
      theme
    })
  }

  saveCode(){
    const { code, fileName } = this.state;

    const mutateStr = createMutateFunction( { code } );
    const reformattedMutateStr = Grammar.reformat.toSimpleString( mutateStr );

    console.log('mutateStr\n',mutateStr);
    console.log('reformattedMutateStr\n',reformattedMutateStr);

    if( fileName && fileName !== "" ){
      MutateApi.saveCode(mutateStr, fileName)
    } else {
      return alert('Missing File Name')
    }

  }

  fileNameChange(e){
    const { value } = e.target;

    this.setState({
      fileName: value
    })

  }

  loadCode(e){
    const activeFile = e.target.value;
    const { fileMap } = this.state;
    console.log('Load::::\t',activeFile);

    const code = Grammar.deconstructTo.code( fileMap[activeFile] );

    this.setState({
      activeFile,
      code
    })
  }

  render(){

    const {
      state: {
        theme,
        code,
        results,
        fileName,
        fileMap,
        activeFile
      },
      run,
      updateCode,
      approveResults,
      changeTheme,
      saveCode,
      fileNameChange,
      loadCode
    } = this;


    return (
      <div styleName="mutate-page">
        <div styleName="mutate-wrapper">
          <div styleName="mutate-caption"> Mutate Stuff </div>
          <div styleName="mutate-body">
            <div styleName="mutate-something-container">
              <div styleName="mutate-something">
                <div styleName="mutate-something-header"> Custom Mutation </div>
                <div styleName="mutate-container">
                  <div styleName="custom-mutate-toolbar">
                    <div styleName="change-theme-container">
                      <div styleName="theme-label">
                        Choose Theme:
                      </div>
                      <select value={ theme } onChange={ changeTheme }>
                        {
                          Object.keys( themesMap ).map( key => (
                            <option key={ key } value={ key }>{ themesMap[ key ] }</option>
                          ))
                        }
                      </select>
                    </div>
                    <div styleName="load-code-container">
                      <div styleName="load-code-label">
                        Load Code:
                      </div>
                      {
                        fileMap &&
                        <select value={ activeFile || "" } onChange={ loadCode }>
                          <option value="">...</option>
                          {
                            Object.keys( fileMap ).map( key => (
                              <option key={ key } value={ key }>{ key }</option>
                            ))
                          }
                        </select>
                      }

                    </div>
                  </div>
                  <AceEditor
                    mode="javascript"
                    theme={ theme }
                    onChange={ updateCode }
                    width="100%"
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{$blockScrolling: true}}
                    value={ codeHeader + code + codeFooter }
                  />
                  <div styleName="submit-container">
                    <input type="submit" value="Run" onClick={ run } />
                    <input type="submit" value="Approve Results" onClick={ approveResults } />
                    <div>
                      <input type="submit" value="Save Code" onClick={ saveCode } />
                      <input type="text" value={ fileName || "" } onChange={ fileNameChange } />
                    </div>
                  </div>
                </div>
                <div styleName="mutate-results-container">
                  { results && 'RESULTS:' }
                  {
                    results &&
                    <AceEditor
                      mode="json"
                      theme="dawn"
                      width="100%"
                      onChange={ updateCode }
                      name="UNIQUE_ID_OF_DIV2"
                      editorProps={{$blockScrolling: true}}
                      value={ JSON.stringify( results, null, 2) }
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

