import React from 'react';
import cssModules from 'react-css-modules';
import styles from './app.css';
import LeftPanel from './leftPanel/LeftPanel';
import AppHeader from './appHeader/AppHeader';
// import { connect } from 'react-redux';
// import { applyMetaData, deleteItems, createAhjs, tableChange, applyRules, uploadItems } from '../actions/databaseActions';
// import { setProcessing } from '../actions/globalActions';
// import { getDefinitions } from '../actions/definitionsActions';
// import { bindActionCreators } from 'redux';
import Routes from './Routes';
// import 'codemirror/lib/codemirror.css';

class App extends React.Component {
  constructor(props, context){
    super(props, context);
  }

  render(){
    const { location } = this.props;
    return (
          <div styleName="app-main">
            <Routes />
            <LeftPanel />
            <AppHeader path={ location.pathname } />
          </div>
      );
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return Object.assign({},
//     bindActionCreators({ applyMetaData }, dispatch),
//     bindActionCreators({ setProcessing }, dispatch),
//     bindActionCreators({ deleteItems }, dispatch),
//     bindActionCreators({ createAhjs }, dispatch),
//     bindActionCreators({ tableChange }, dispatch),
//     bindActionCreators({ applyRules }, dispatch),
//     bindActionCreators({ getDefinitions }, dispatch),
//     bindActionCreators({ uploadItems }, dispatch)
//   )
// };
//
// const mapStateToProps = (state, ownProps) => {
//   const { database, global, definitions  } = state;
//   const { createdAhjs, existingAhjs, tableName } = database;
//   const { processing, view } = global;
//
//   return {
//     tableName,
//     createdAhjs,
//     existingAhjs,
//     processing,
//     definitions,
//     view
//   }
// };


const appExport = cssModules(App, styles);

// export default connect(mapStateToProps, mapDispatchToProps)(appExport)
export default appExport
