import React from 'react';
import cssModules from 'react-css-modules';
import styles from './databaseMetrics.css';
import { connect } from 'react-redux';
import { getDefinitions } from '../../actions/definitionsActions';
import { bindActionCreators } from 'redux';
import metrics from '../../libraries/ahjMetrics/index'
import RuleMetrics from'./ruleMetrics/RuleMetrics'

class DatabaseMetrics extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.toActiveRules = this.toActiveRules.bind(this);
    this.state = {
      activeRules:[]
    }
  }

  toActiveRules(id){
    const { activeRules } = this.state;
    if(!activeRules.includes(id)){
      return this.setState({
        activeRules: [...activeRules,id]
      })
    }
    this.setState({
      activeRules:activeRules.filter(ruleId=>{
        return ruleId !== id
      })
    })
  }

  render(){
    const { definitions, env, existingAhjs } = this.props;
    const { activeRules } = this.state;
    // const orderBy = ['ruleId','conditionId','right','attrIndex','type','id'];
    const orderBy = ['type','id'];
    const metricMap = !existingAhjs ? {} : metrics({ ahjs:existingAhjs, orderBy });
    console.log(':::::metricMap:::::\n',metricMap);
    return (
      <div styleName="metrics-container">
        { !env && <div> Select an Environment to Run Metrics </div> }
        { env && <div>{ `Run Metrics For:\t${env.toUpperCase()}\nDefinitions Count:${definitions.all.length} `}</div> }
        { env && !existingAhjs && <div>{ `Select Table to Load Ahj Data For: ${env.toUpperCase()}` }</div> }
        {
          env && definitions.rules && existingAhjs &&
          <div styleName="rules-container">
            {
              definitions.all.map((definition,index)=>{
                if(definition.rule) return (
                  <div key={index} styleName="rule-container">
                    <div styleName="rule-header"
                         onClick={()=>{this.toActiveRules(definition.id)}}>
                      { definition.name }
                    </div>
                    {
                      activeRules.includes(definition.id) &&
                      <div styleName="rule-body">
                        { metricMap[definition.id] && <RuleMetrics orderBy={orderBy} definition={definition} metrics={metricMap[definition.id]}   /> }
                        { Object.keys(metricMap).length === 0 && '...Load Ahj Data' }
                        { Object.keys(metricMap).length > 0 && !metricMap[definition.id] && '...Generating Metric Data For this Rule Has Issues' }
                      </div>
                    }
                  </div>
                )
              })
            }
          </div>
        }
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return Object.assign({},
    bindActionCreators({ getDefinitions }, dispatch)
  )
};

const mapStateToProps = (state) => {
  const { definitions, environment, database } = state;
  const { existingAhjs } = database;
  const env = environment.active;
  return {
    existingAhjs: existingAhjs.length === 0 ? null : existingAhjs,
    definitions,
    env
  }
};

const metricsExport = cssModules(DatabaseMetrics, styles);

export default connect(mapStateToProps, mapDispatchToProps)(metricsExport)
