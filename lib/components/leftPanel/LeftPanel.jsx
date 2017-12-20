import React from 'react';
import cssModules from 'react-css-modules';
import styles from './leftPanel.css';
import AnyTable from '../anyTable/AnyTable';
import DynamobdApi from '../../api/DynamobdApi';

class LeftPanel extends React.Component {
  constructor(props, context){
    super(props, context);
    this.toTableChange = this.toTableChange.bind(this);
    this.mergeTables = this.mergeTables.bind(this);
    this.state = {

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

  render(){
    const { tableData } = this.state;
    const { createdAhjs, existingAhjs, tableChange, deleteItems, processing, uploadItems } = this.props;
    const handleDeleteItems = () => {
      const { query } = this.state;
      if(query) deleteItems(query.key,query.value);
      else deleteItems();
    };
    const handleUploadItems = () => {
      const { query } = this.state;
      console.log('handleUploadItems');
      if(query) uploadItems(query.key,query.value);
      else uploadItems();
    };
    const noRules = existingAhjs.filter(ahj=>{ return !ahj.rules });
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
            <div>Table:</div>
            <select onChange={(e)=>{tableChange(e)}}>
              <option value={null}>...</option>
              <option value="ahj-stage">AHJ Stage</option>
              <option value="ahj-prod">AHJ Prod</option>
              <option value="ahj-dev">AHJ Dev</option>
              <option value="ahj-definitions-prod">Definitions Prod</option>
              <option value="ahj-definitions-stage">Definitions Stage</option>
              <option value="ahj-definitions-dev">Definitions Dev</option>
            </select>
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

export default cssModules(LeftPanel, styles)
