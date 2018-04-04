import React from 'react';
import cssModules from 'react-css-modules';
import styles from './leftPanel.css';
import AnyTable from '../anyTable/AnyTable';
import DynamobdApi from '../../api/DynamobdApi';
import { deleteItems,
  setTableName,
  uploadItems,
  loadTable } from '../../actions/databaseActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import config from '../../../config'
import { toTitleCase } from '../../utilities/utilities';

class LeftPanel extends React.Component {
  constructor(props, context){
    super(props, context);
    this.toTableChange = this.toTableChange.bind(this);
    this.mergeTables = this.mergeTables.bind(this);
    this.state = {
      filter:null
    };
  }

  toTableChange(e){
    const { value } = e.target;
    if(value) this.setState({toTable:value});
  }

  queryChange(e){
    const { name, value } = e.target;
    const { query } = this.state;
    this.setState({
      query:Object.assign(query||{},{[name]:value})
    })
  }
  mergeTables(){
    const { toTable } = this.state;
    const { existingAhjs } = this.props;
    if(!toTable||!existingAhjs) console.log('missing "to table" or "existing ahjs"');
    this.setState({processing:`Merging Table Items To: ${toTable}`});
    DynamobdApi.putAll(existingAhjs,toTable).then(all=>{
      this.setState({processing:null});
    })
  }
  // updateFilter
  // addFilter(index){
  //   const { filter } = this.state;
  //
  // }

  render(){
    const { tableData, filter } = this.state;
    const {
      createdAhjs,
      existingAhjs,
      setTableName,
      loadTable,
      deleteItems,
      processing,
      uploadItems,
      tableName,
      env
    } = this.props;
    const handleDeleteItems = () => {
      const { query } = this.state;
      if(query) deleteItems(query.key,query.value);
      else deleteItems();
    };
    const handleUploadItems = () => {
      const { query } = this.state;
      console.log('handleUploadItems');
      if(query) uploadItems({key:query.key,value:query.value});
      else uploadItems();
    };
    const noRules = existingAhjs.filter(ahj=>{ return !ahj.rules });
    const getTableOptions = ( !env ? config.dynamo.tables : Object.values(config[env].tables ) ).map( ( table, index ) => {
      return <option key={index} value={table}>{toTitleCase(table)}</option>
    });
    return (
      <div styleName="left-panel-container">
        {
          tableData && tableData.length>0 &&
          <AnyTable collection={tableData}  />
        }
        <div styleName="header">
          <h2 styleName="caption">Database Panel</h2>
          { createdAhjs.length===0 &&
            <div styleName="create-ahjs-text">
              Use the Geocoder to Start Creating AHJs
            </div>
          }
          <div styleName="ahj-counts-container">
            <div styleName="count-container" onClick={()=>{this.setState({tableData:createdAhjs})}}>
              <div styleName="count-label"><u>Created AHJs:</u></div>
              <div styleName="count">{createdAhjs.length}</div>
            </div>
            <div styleName="count-container">
              <div styleName="count-label"><u>Existing AHJs:</u></div>
              <div styleName="count">{existingAhjs.length}</div>
            </div>
            <div styleName="count-container">
              <div styleName="count-label"><u>AHJs Missing Rules</u></div>
              <div styleName="count">{noRules.length}</div>
            </div>
          </div>
        </div>
        <div styleName="database-actions">
          <u>Database Actions</u>
          <div styleName="table-select-container">
            <div style={{display:'flex'}}>
              <div>{tableName?'Active Table:':'Activate Table'}</div>
              <select onChange={(e)=>{setTableName(e.target.value)}}>
                <option value={null}>...</option>
                <option value="ahj-temp">AHJ TEMP</option>
                <option value="ahj-new">AHJ NEW</option>
                { getTableOptions }
              </select>
            </div>
            <input styleName="load-table-button" type="submit" value="Load Table" onClick={loadTable} />
          </div>

          <div styleName="filters-container">
            <u>Build Filters</u>
            <div styleName="items-container">
              { filter &&
                filter.map((item,index)=>{
                  return (
                    <div key={index} styleName="filter-item-container">
                      <input name="key" type="text" placeholder="key" />
                      <input name="value" type="text" placeholder="value" />
                    </div>
                  );
                })
              }

            </div>
            <input type="submit" value="Add Filter" styleName="add-filter-button" />
          </div>

          <div styleName="upload-items-container">
            <u>Upload Items in Table</u>
            <div styleName="upload-query-container">
              <input name="key" type="text" placeholder="key" onChange={(e)=>{this.queryChange(e)}} />
              <input name="value" type="text" placeholder="value" onChange={(e)=>{this.queryChange(e)}} />
            </div>
            <input type="submit" value="Upload Items" styleName="upload-items-button" onClick={()=>{handleUploadItems()}} />
          </div>

          <div styleName="delete-items-container">
            <u>Delete Items in Table</u>
            <div styleName="delete-query-container">
              <input name="key" type="text" placeholder="key" onChange={(e)=>{this.queryChange(e)}} />
              <input name="value" type="text" placeholder="value" onChange={(e)=>{this.queryChange(e)}} />
            </div>
            <input type="submit" value="Delete Items" styleName="clear-table-button" onClick={()=>{handleDeleteItems()}} />
          </div>
          <div styleName="merge-tables-container">
            <u>Merge Tables</u>
            <div styleName="to-table-container">
              <div>To Table:</div>
              <select onChange={this.toTableChange}>
                <option value={null}>...</option>
                <option value="ahj-stage">AHJ Stage</option>
                <option value="ahj-prod">AHJ Prod</option>
                <option value="ahj-dev">AHJ Dev</option>
                <option value="ahj-definitions-prod">Definitions Prod</option>
                <option value="ahj-definitions-stage">Definitions Stage</option>
                <option value="ahj-definitions-dev">Definitions Dev</option>
                <option value="ahj-revisions-prod">Revisions Prod</option>
                <option value="ahj-revisions-stage">Revisions Stage</option>
                <option value="ahj-revisions-dev">Revisions Dev</option>
                <option value="ahj-temp">AHJ TEMP</option>
                <option value="ahj-new">AHJ NEW</option>
              </select>
            </div>
            <input type="submit" value="Merge Tables" styleName="merge-table-button" onClick={this.mergeTables} />
          </div>

        </div>
        {
          (this.state.processing||processing) &&
          <div styleName="processing-container">
            {this.state.processing||processing}
          </div>
        }
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return Object.assign({},
    bindActionCreators({ setTableName }, dispatch),
    bindActionCreators({ loadTable }, dispatch),
    bindActionCreators({ deleteItems }, dispatch),
    bindActionCreators({ uploadItems }, dispatch)
  )
};

const mapStateToProps = (state, ownProps) => {
  const { database, global, definitions, environment  } = state;
  const { createdAhjs, existingAhjs, tableName } = database;
  const { processing } = global;

  return {
    tableName,
    createdAhjs,
    existingAhjs,
    processing,
    definitions,
    env: environment.active
  }
};
const leftPanelExport = cssModules(LeftPanel, styles);

export default connect(mapStateToProps, mapDispatchToProps)(leftPanelExport)
