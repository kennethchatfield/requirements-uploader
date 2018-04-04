import React from 'react';
import cssModules from 'react-css-modules';
import styles from './addRules.css';
import { handleCsv } from '../../utilities/parseCsv';
import { parseAhjs } from '../../utilities/parseAhjs';
import parseMetaData from '../../utilities/parseMetaData'

class AddRules extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { };
  }

  handleCsvFile(e){
    let multiple = false;
    const { files } = e.target;
    let cb = (results)=>{
      this.setState({ results })
    };
      if( files.length > 1 ){
        multiple = true;
        cb = (resul) => {
          let { results } = this.state;
          results = [...results||[], resul];
          this.setState({ results })
        };
        this.setState({multiple});
      }
    handleCsv(e,cb);
  }
  ruleChange(e){
    console.log('rule change', e.target.value);
    const ruleId = e.target.value;
    this.setState({ruleId});
  }
  parseRuleData(){
    const { results, multiple} = this.state;
    const { definitions } = this.props;

    let newResults = [];

    if(multiple){
      results.map(collection=>{
        const parsed = parseAhjs({ collection, definitions });
        newResults = [...newResults, ...Object.values(parsed)];
      });
      this.setState({results:newResults});
    } else {
      const parsed = parseAhjs({ collection:results, definitions });
      this.setState({results:Object.values(parsed)});
    }
  }
  ruleApplication(){
    const { applyRules } = this.props;
    const { results, multiple } = this.state;
    applyRules(results);
  }
  metaDataParse(){
    const { results } = this.state;
    const parsed = parseMetaData(results);
    this.setState({results:parsed});
  }
  metaDataApplication(){
    const { applyMetaData } = this.props;
    const { results } = this.state;
    applyMetaData(results);
  }

  render(){
    const { definitions, createAhjs, multiple } = this.props;
    const { results,fileName } = this.state;
    console.log('results!!!!!!!!!!!!!!!\n',results);
    // console.log('fileName!!!!!!!!!!!!!!!\n',fileName);
    return (
      <div styleName="add-rules-widget">
        <div styleName="add-rules-header">Add Rules</div>
        <div styleName="add-rules-input">
          <input type="text" placeholder="rule" />
          <input type="text" placeholder="ahj" />
          <input type="text" placeholder="conditionString" />
        </div>


        <div styleName="batch-container">
          <div styleName="batch-header"> Batch Upload </div>
          <div styleName="batch-body">
            <div styleName="file-selector-container">
              <u>Select Rule (CSV) To Upload</u>
              <div styleName="rule-input-container">
                <div>Specify Rule</div>
                <select onChange={(e)=>{this.ruleChange(e)}}>
                  <option value={null}>By File Name</option>
                  {
                    definitions && definitions.rules &&
                    Object.keys(definitions.rules).map(id=>{
                      return <option key={id} value={id}>{definitions.rules[id].name}</option>
                    })
                  }
                </select>
              </div>
              <input type="file" accept=".csv" multiple
                     styleName="file-selector-button"
                     onChange={(e)=>{
                       this.handleCsvFile(e);
                       this.setState({active:'rule-data'});
                     }} />
              { this.state.active === 'rule-data' &&
                <input type="submit" onClick={()=>{
                  this.parseRuleData();
                  this.setState({active:'apply-rule-data'});
                }} />
              }
            </div>
          </div>
        </div>

        <div styleName="meta-data-container">
          <div styleName="meta-data-header"> Meta Data Upload </div>
          <div styleName="meta-data-body">
            <div styleName="file-selector-container">
              <u>Select Meta-Data (CSV)</u>
              <div styleName="meta-data-input-container"></div>
              <input type="file" accept=".csv"
                     styleName="file-selector-button"
                     onChange={(e)=>{
                       this.handleCsvFile(e);
                       this.setState({active:'meta-data'});
                     }} />
              { this.state.active === 'meta-data' &&
                <input type="submit" onClick={() => {
                  this.metaDataParse();
                  this.setState({active:'apply-meta-data'});
                }} />
              }
            </div>
          </div>
        </div>


        {
         results &&
         <div styleName="results-container">
           <div styleName="results-caption">
             Uploaded CSV Results
           </div>
           <div styleName="results">

             <div styleName="results-column">
               <div styleName="result-header">{multiple?'Files':'AHJs'}</div>
               <div styleName="result-value">{results.length}</div>
             </div>
             <div styleName="results-column">
               <div styleName="result-header">Conditions</div>
               <div styleName="result-value">0</div>
             </div>
             <div styleName="results-column">
               <input type="submit" value="Create Ahjs" onClick={()=>{createAhjs(results)}} />
               {
                 this.state.active === 'apply-rule-data' &&
                 <input type="submit" value="Apply Rules"
                        onClick={()=>{
                          this.ruleApplication();
                          this.setState({active:null});
                        }} />
               }
               {
                 this.state.active === 'apply-meta-data' &&
                 <input type="submit" value="Apply Meta Data"
                        onClick={()=>{
                          this.metaDataApplication();
                          this.setState({active:null});
                        }} />
               }
             </div>
           </div>
         </div>
        }
      </div>
    );
  }
}


export default cssModules(AddRules, styles);
