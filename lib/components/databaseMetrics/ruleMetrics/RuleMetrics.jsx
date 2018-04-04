import React from 'react';
import cssModules from 'react-css-modules';
import styles from './ruleMetrics.css';
import { connect } from 'react-redux';
import Dot from '../../assets/Dot';
import { toTitleCase } from '../../../utilities/utilities'
import downloadAsCSV from '../../../utilities/downloadAsCsv';
import deconstructMetrics from '../../../libraries/ahjMetrics/deconstructMetrics';


// const orderBy = ['ruleId','conditionId','attrIndex','id'];

const RuleMetrics = ({ metrics, definition, orderBy, conditionDefinitions }) => {
  let map = {
    id:{
      name:'AHJ'
    },
    type:{
      name:'Type',
      getName:(type)=>{
        return type
      }
    },
    conditionId:{
      name:'Condition',
      getName:(id)=>{
        if(id==='undefined') return 'default';
        return conditionDefinitions[id].name;
      }
    },
    ruleId:{
      name:'Rule',
      getName:()=>{
        return definition.name
      }
    },
    attrIndex:{
      name:'Value Attribute',
      getName:(attrIndex)=>{
        const { template } = definition;
        if(template.dataType==='object'){
          if(attrIndex==='undefined'||attrIndex===undefined)return 'default';
          if(attrIndex==='mechanicalUnit') attrIndex = 'mechanicalUnits';

          console.log('attrIndex',attrIndex);
          console.log('template.item',template.item);
          return template.item[attrIndex].name
        }
        return definition.name
      }
    },
    right:{
      name:'Condition Value',
      getName:(id)=>{
        if(id==='undefined'||id===undefined)return 'default';
        return id;
      }
    },
    fullCondition:{
      name:'Condition',
      getName:(id)=>{
        return toTitleCase(id);
      }
    }
  };
  orderBy.map((key,index)=>{
    if(index>0)map[ key ].parent = orderBy[ index - 1 ];
    if(index < orderBy.length - 1 ){
      map[ key ].child = orderBy[ index + 1 ];
    }
  });
  console.log('definition:::\n',definition);
  // console.log('conditionDefinitions:::\n',conditionDefinitions);
  console.log('map::::\n',map);
  console.log('orderBy::::\n',orderBy);
  const { id, template, allowableConditions } = definition;

  const downloadResults = () => {
    console.log('::::::::::dowload csv metrics::::::\n', metrics);
    console.log('::::::::::dowload csv orderBy::::::\n', orderBy);
    deconstructMetrics( metrics, orderBy.splice(1) );
    // Object.keys(metrics)
    // downloadAsCSV()
  }

  return (
    <div styleName="rule-metrics-container">
      <div styleName="lvl-container" style={{color:"#aaa7aa"}}>
        <div styleName="lvl-header-container">
          <div><Dot /></div>
          <div styleName="lvl-header">
            <div styleName="lvl-label-container">
              <div styleName="lvl-name">
                { definition.name }
              </div>
              <div styleName="lvl-label">
                {`, Rule: Contains ${ map[map[orderBy[0]].child].name }s`}
              </div>
            </div>
            <div styleName="lvl-metrics-container">
              <div styleName="lvl-metrics">
                <div styleName="count-label">{`${ map[map[orderBy[0]].child].name } Count:`}</div>
                <div styleName="count-text"><u>{Object.keys(metrics).length}</u></div>
              </div>
            </div>
          </div>
        </div>



        <div styleName="children-container" style={{paddingLeft:'20px', color:'#7a787a'}}>
          { map[orderBy[1]].child &&
            Object.keys(metrics).map((two,index)=>{
              const lvl2metric = metrics[two];
              return (
              <div key={index} styleName="lvl-container">
                <div styleName="lvl-header-container">
                  <div><Dot /></div>
                  <div styleName="lvl-header">
                    <div styleName="lvl-label-container">
                      <div styleName="lvl-name">
                        { map[orderBy[1]].getName(two) }
                      </div>
                      <div styleName="lvl-label">
                        {`, ${map[orderBy[1]].name} Contains ${ map[map[orderBy[1]].child].name }s`}
                      </div>
                    </div>
                    <div styleName="lvl-metrics-container">
                      <div styleName="lvl-metrics">
                        <div styleName="count-label">{`${ map[map[orderBy[1]].child].name } Count:`}</div>
                        <div styleName="count-text"><u>{Object.keys(lvl2metric).length}</u></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div styleName="children-container" style={{paddingLeft:'40px',color:"#3C3B3C"}}>
                  { map[orderBy[2]].child &&
                    Object.keys(lvl2metric).map((three,ind)=>{
                      const lvl3metric = lvl2metric[three];
                      return (
                        <div key={ind} styleName="lvl-container">
                          <div styleName="lvl-header-container">
                            <div><Dot /></div>
                            <div styleName="lvl-header">
                              <div styleName="lvl-label-container">
                                <div styleName="lvl-name">
                                  { map[orderBy[2]].getName(three) }
                                </div>
                                <div styleName="lvl-label">
                                  {`, ${map[orderBy[2]].name} Contains ${ map[map[orderBy[2]].child].name }s`}
                                </div>
                              </div>
                              <div styleName="lvl-metrics-container">
                                <div styleName="lvl-metrics">
                                  <div styleName="count-label">{`${ map[map[orderBy[2]].child].name } Count:`}</div>
                                  <div styleName="count-text"><u>{Object.keys(lvl3metric).length}</u></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div styleName="children-container" style={{paddingLeft:'60px',color:"#3C3B3C"}}>
                            { map[orderBy[3]].child &&
                            Object.keys(lvl3metric).map((four,i)=>{
                              const lvl4metric = lvl3metric[four];
                              return (
                                <div key={i} styleName="lvl-container">
                                  <div styleName="lvl-header-container">
                                    <div><Dot /></div>
                                    <div styleName="lvl-header">
                                      <div styleName="lvl-label-container">
                                        <div styleName="lvl-name">
                                          { map[orderBy[3]].getName(four) }
                                        </div>
                                        <div styleName="lvl-label">
                                          {`, ${map[orderBy[3]].name} Contains ${ map[map[orderBy[3]].child].name }s`}
                                        </div>
                                      </div>
                                      <div styleName="lvl-metrics-container">
                                        <div styleName="lvl-metrics">
                                          <div styleName="count-label">{`${ map[map[orderBy[3]].child].name } Count:`}</div>
                                          <div styleName="count-text"><u>{Object.keys(lvl4metric).length}</u></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>


                                  <div styleName="children-container" style={{paddingLeft:'60px',color:"#923d2a"}}>
                                    { map[orderBy[4]].child &&
                                    Object.keys(lvl4metric).map((five,dex)=>{
                                      const lvl5metric = lvl4metric[five];
                                      return (
                                        <div key={dex} styleName="lvl-container">
                                          <div styleName="lvl-header-container">
                                            <div><Dot /></div>
                                            <div styleName="lvl-header">
                                              <div styleName="lvl-label-container">
                                                <div styleName="lvl-name">
                                                  { map[orderBy[4]].getName(five) }
                                                </div>
                                                <div styleName="lvl-label">
                                                  {`, ${map[orderBy[4]].name} Contains ${ map[map[orderBy[4]].child].name }s`}
                                                </div>
                                              </div>
                                              <div styleName="lvl-metrics-container">
                                                <div styleName="lvl-metrics">
                                                  <div styleName="count-label">{`${ map[map[orderBy[4]].child].name } Count:`}</div>
                                                  <div styleName="count-text"><u>{Object.keys(lvl5metric).length}</u></div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    })
                                    }
                                  </div>


                                </div>
                              )
                            })
                            }
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              )
            })
          }
        </div>
      </div>
      <div styleName="export-results-container">
        <input type="submit" value="Download Results as .CSV" onClick={()=>{downloadResults()}} />
      </div>
    </div>
  )
};

const mapStateToProps = (state,ownProps) => {
  const { definitions } = state;
  const { allowableConditions } = ownProps.definition;
  let conditionDefinitions;
  if( allowableConditions && allowableConditions !== "none" ){
    allowableConditions.map(condition=>{
      if(!conditionDefinitions) conditionDefinitions = {};
      conditionDefinitions[condition] = definitions.conditions[condition];
    })
  }
  return {
    conditionDefinitions
  }

};
const ruleMetricsExport = cssModules(RuleMetrics,styles);

export default connect( mapStateToProps, null )(ruleMetricsExport);
