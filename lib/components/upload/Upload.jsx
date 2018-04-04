import React from 'react';
import cssModules from 'react-css-modules';
import styles from './upload.css';
import Geocode from '../geocode/Geocode';
import AddRules from '../addRules/AddRules';
import ManipulateRules from '../moveRules/ManipulateRules';
import Mutate from '../mutate/Mutate';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { applyMetaData,
  createAhjs,
  applyRules } from '../../actions/databaseActions';
import { setProcessing } from '../../actions/globalActions';
import { getDefinitions } from '../../actions/definitionsActions';

class Upload extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render(){
    const {
      createAhjs,
      setProcessing,
      definitions,
      definitionsMap,
      applyRules,
      applyMetaData,
      env
    } = this.props;
    return (
      <div styleName="app-body">
        { !env && "Please Select an Environment Before Continuing" }
        {
          env &&
          <div>
            <div styleName="top-container">
              <h1>Database Definitions Counts</h1>
              <h2><u> Total Definitions Count: </u> { definitions?definitions.length:0 }</h2>
              <h2><u>Conditions Count:</u> { definitionsMap?Object.keys(definitionsMap.conditions).length:0 }</h2>
              <h2><u>Rules Count:</u> { definitionsMap?Object.keys(definitionsMap.rules).length:0 }</h2>
            </div>
            <div styleName="mid-container">
              <div styleName="widget-container">
                <ManipulateRules />
              </div>
              <div styleName="widget-container">
                <Geocode createAhjs={createAhjs}
                         setProcessing={setProcessing} />
              </div>
              <div styleName="widget-container">
                <AddRules definitions={definitionsMap}
                          createAhjs={createAhjs}
                          applyRules={applyRules}
                          applyMetaData={applyMetaData}/>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return Object.assign({},
    bindActionCreators({ applyMetaData }, dispatch),
    bindActionCreators({ setProcessing }, dispatch),
    bindActionCreators({ createAhjs }, dispatch),
    bindActionCreators({ applyRules }, dispatch),
    bindActionCreators({ getDefinitions }, dispatch)
  )
};

const mapStateToProps = (state) => {
  const {  definitions, environment  } = state;
  const { rules, conditions } = definitions;
  const definitionsMap = { rules, conditions };

  const env = environment.active;

  return {
    definitionsMap,
    definitions,
    env
  }
};

const uploadExport = cssModules(Upload, styles);


export default connect(mapStateToProps, mapDispatchToProps)(uploadExport)

