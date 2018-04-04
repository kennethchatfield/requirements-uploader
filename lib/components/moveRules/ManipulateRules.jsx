import React from 'react';
import cssModules from 'react-css-modules';
import styles from './moveRules.css';
import { connect } from 'react-redux';
import { getAhjs,
  cutAndPastRules,
  ruleDelete,
  ruleExistence,
  setCreatedAhjs } from '../../actions/databaseActions';
import { bindActionCreators } from 'redux';
import { isGuid } from '../../utilities/utilities'
import { downloadCSV } from '../../utilities/downloadAsCsv'

const types = ["City", "County","Utility","ROC","State","National"];

const validateGuids = (guids) => {
  let valid = [];
  if(guids) {
    guids = guids.split(',').map( guid => {
      if( !isGuid(guid) ) valid.push(false);
      return guid;
    });
    if(!valid.includes(false)) return guids;
  }
}

class ManipulateRules extends React.Component {
  constructor(props, context){
    super(props, context);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.moveRule = this.moveRule.bind(this);
    this.deleteRule = this.deleteRule.bind(this);
    this.existenceValidation = this.existenceValidation.bind(this);
    this.deleteInvalidExistence = this.deleteInvalidExistence.bind(this);
    this.generateNotFoundCsv = this.generateNotFoundCsv.bind(this);
    this.initializeEmptyRules = this.initializeEmptyRules.bind(this);
    this.fixAlternativeNames = this.fixAlternativeNames.bind(this);
    this.state = {
      rule: null,
      from: null,
      to: null,
      deleteFrom:null,
      ruleToDelete:null,
      deleteRuleValid:null
    }
  }

  onChangeHandler( e ){
    const { getAhjs, definitions } = this.props;
    const { name, value } = e.target;

    const actions = {
      from:(val)=>{
        if(isGuid(val)) getAhjs([val])
      },
      to:(val)=>{
        if(isGuid(val)) getAhjs([val,this.state.from])
      },
      deleteFrom:(val)=>{
        val = validateGuids(val);
        if(val) getAhjs(val);
      },
      ruleToDelete:(val) => {
        console.log('definitions.rules[val]',definitions.rules[val]);
        if( definitions.rules[val] )  return this.setState({deleteRuleValid:true});
        if( this.state.deleteRuleValid ) this.setState({deleteRuleValid:false});
      }
    };

    if( actions[name] ) actions[name](value);

    this.setState({
      [ name ]: value
    })
  }

  moveRule(){
    const { cutAndPastRules, definitions } = this.props;
    const { from, to, rule } = this.state;
    console.log('------ move rule ------');
    console.log('From:\t',from);
    console.log('Rule:\t',rule);
    console.log('To:\t',to);
    if( from && to && rule && definitions.rules[rule] ){
      cutAndPastRules([{ from, to, rule }])
    }
    if( !rule || !definitions.rules[rule] )console.log('Rule Definition Not Found');
    if( !from || !isGuid(from) )console.log('From Not Valid Id');
    if( !to || !isGuid(to) )console.log('To Not Valid Id');
  }
  deleteRule(){
    const { deleteFrom, ruleToDelete, deleteRuleValid } = this.state;
    const { ruleDelete } = this.props;
    console.log('------ delete rule ------');
    console.log('deleteFrom:\t',deleteFrom);
    console.log('ruleToDelete:\t',ruleToDelete);
    if( deleteRuleValid ) ruleDelete( deleteFrom.split(','), ruleToDelete )
  }

  existenceValidation(){
    const { existingRule, existIn } = this.state;
    const { ruleExistence, definitions,existingAhjs, validationResults } = this.props;
    if(existingAhjs.length>0 && types.includes(existIn) ) return ruleExistence( null, existingRule, existIn );
    const ids =  validateGuids(existIn);
    if( existingAhjs.length>0 && ids && definitions.rules[existingRule] )  return ruleExistence( ids, existingRule);
    if( existingAhjs.length<1 ) alert('remember to load table before validating')
  }

  deleteInvalidExistence(){
    const { validation, ruleDelete } = this.props;
    const { ruleId } = validation.check;
    const { invalidExistence } = validation.results;
    console.log('deleteInvalidExistence', {ruleId,invalidExistence});
    ruleDelete( invalidExistence, ruleId );
  }

  generateNotFoundCsv(){
    const { validation } = this.props;
    const rows = validation.results.notFound.map(id=>{
      return [id];
    });
    if(validation.results.notFound.length>0) downloadCSV(rows);
  }
  initializeEmptyRules(){
    const { existingAhjs, setCreatedAhjs } = this.props;
    let newAhjs = [];
    existingAhjs.map(ahj=>{
      if(!ahj.rules) newAhjs.push(
        Object.assign({},
          newAhjs,
          {rules:{}}
        )
      )
    });
    console.log('newAhjs',newAhjs);
    if(newAhjs.length > 0 ) setCreatedAhjs(newAhjs);
  }

  fixAlternativeNames(){
    console.log('fixAlternativeNames');
    const { existingAhjs, setCreatedAhjs } = this.props;
    const newAhjs = existingAhjs.map( ahj => {
      if( ahj.alternativeNames && typeof ahj.alternativeNames === 'string' ){
        return Object.assign({}, ahj, {
          alternativeNames: ahj.alternativeNames.split(',')
        });
      }
      return ahj;
    });
    console.log('newAhjs\n',newAhjs);
    setCreatedAhjs(newAhjs);
  }


  render(){
    const { onChangeHandler, moveRule, deleteRule, existenceValidation, deleteInvalidExistence, generateNotFoundCsv, initializeEmptyRules } = this;
    const { from, to, rule, deleteFrom, ruleToDelete, existIn, existingRule } = this.state;
    const { validation } = this.props;
    return (
      <div styleName="manip-rules-widget">
        <div styleName="manip-rules-caption">
          <u> Manipulate AHJ's </u>
        </div>
        <div styleName="manip-rules-body">
          <div styleName="move-rule-container">
            <div styleName="move-rule-label">
              <u> Move Rule </u>
            </div>
            <div styleName="cut-paste-container">
              <div styleName="cut-from-container">
                <div styleName="cut-from-label"> Cut From: </div>
                <input name="from" type="text" onChange={ onChangeHandler } value={ from || "" } />
              </div>
              <div styleName="applied-rules-container">
                <div styleName="applied-rules-label"> Applied Rules: </div>
                <input name="rule" type="text" onChange={ onChangeHandler } value={ rule || "" } />
              </div>
              <div styleName="paste-to-container">
                <div styleName="paste-to-label"> Paste To: </div>
                <input name="to" type="text" onChange={ onChangeHandler } value={ to || "" } />
              </div>
            </div>
            <div styleName="submit-button-container">
              <input type="submit" onClick={ moveRule } />
            </div>
          </div>
          <div styleName="delete-rule-container">
            <div styleName="delete-rule-label">
              <u>delete Rule</u>
            </div>
            <div styleName="delete-rule-inputs">
              <div styleName="delete-from-container">
                <div styleName="delete-from-label"> Delete From: </div>
                <input name="deleteFrom" type="text" onChange={ onChangeHandler } value={ deleteFrom || "" } />
              </div>
              <div styleName="rule-to-delete-container">
                <div styleName="rule-to-delete-label"> Rule To Delete </div>
                <input name="ruleToDelete" type="text" onChange={ onChangeHandler } value={ ruleToDelete || "" } />
              </div>
            </div>
            <div styleName="submit-button-container">
              <input type="submit" onClick={ deleteRule } />
            </div>
          </div>
          <div styleName="rule-existence-container">
            <div styleName="rule-existence-label">
              <u>Rule Existence Validation</u>
            </div>
            <div styleName="rule-existence-inputs">
              <div styleName="does-container">
                Does:
              </div>
              <div styleName="existing-rule-container">
                <div styleName="existing-rule-label"> Rule: </div>
                <input name="existingRule" type="text" onChange={ onChangeHandler } value={ existingRule || "" } />
              </div>
              <div styleName="exist-in-container">
                <div styleName="exist-in-label"> Exist In: </div>
                <input name="existIn" type="text" onChange={ onChangeHandler } value={ existIn || "" } />
              </div>
            </div>
            <div styleName="submit-button-container">
              <input type="submit" onClick={ existenceValidation } />
            </div>
          </div>
          {
            validation &&
            <div styleName="validation-results-container">
              <div styleName="validation-results-label">
                <u>Validation Results</u>
              </div>
              <div styleName="validation-results-body">

                <div styleName="found-container">
                  <div styleName="found-rule-label"> Found: </div>
                  <div styleName="found-count">{validation.results.found.length}</div>
                </div>

                <div styleName="not-found-container">
                  <div styleName="not-found-label"> Not Found: </div>
                  <div styleName="not-found-count">{validation.results.notFound.length}</div>
                  <input type="submit" value="Generate List" onClick={generateNotFoundCsv} />
                </div>

                <div styleName="invalid-existence-container">
                  <div styleName="invalid-existence-label"> Invalid Existence: </div>
                  <div styleName="invalid-existence-count">{validation.results.invalidExistence.length}</div>
                  <input type="submit" value="Delete All" onClick={deleteInvalidExistence} />
                </div>


              </div>
            </div>
          }

        </div>
        <div>
          <input type="submit" value="initialize empty rules" onClick={initializeEmptyRules} />
        </div>
        <div styleName="additional-scripts-container">
          <div styleName="scripts-caption"> <u>Additional Scripts</u> </div>
          <div styleName="additional-scripts">
            <div styleName="script-item">
              <div styleName="script-label"> alternativeNames: csv to array </div>
              <input onClick={this.fixAlternativeNames} value="Run Script" type="submit" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return Object.assign({},
    bindActionCreators({ getAhjs }, dispatch),
    bindActionCreators({ cutAndPastRules }, dispatch),
    bindActionCreators({ ruleDelete }, dispatch),
    bindActionCreators({ ruleExistence }, dispatch),
    bindActionCreators({ setCreatedAhjs }, dispatch)
  )
};

const mapStateToProps = (state) => {
  const { definitions, database  } = state;
  const { createdAhjs, existingAhjs, validation } = database;

  const getValidation = () => {
    if( validation.results.found.length > 0  ||
      validation.results.notFound.length > 0 ||
      validation.results.invalidExistence.length > 0
    ) return validation;
  }

  return {
    createdAhjs,
    existingAhjs,
    definitions,
    validation:getValidation()
  }
};


const manipulateRulesExport = cssModules(ManipulateRules, styles);

export default connect(mapStateToProps, mapDispatchToProps)(manipulateRulesExport)

