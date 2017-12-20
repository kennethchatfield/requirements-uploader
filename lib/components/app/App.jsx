import React from 'react';
import DefinitionsApi from '../../api/DefinitionsApi';
import cssModules from 'react-css-modules';
import styles from './app.css';
import Geocode from '../geocode/Geocode';
import AddRules from '../addRules/AddRules';
import LeftPanel from '../leftPanel/LeftPanel';
import DynamobdApi from '../../api/DynamobdApi'
import { isUnique, pickMetaData, findItem, writeToCollection } from '../../utilities/utilities';

class App extends React.Component {
    constructor(props, context){
      super(props, context);
      this.createAhjs = this.createAhjs.bind(this);
      this.tableChange = this.tableChange.bind(this);
      this.deleteItems = this.deleteItems.bind(this);
      this.setProcessing = this.setProcessing.bind(this);
      this.uploadItems = this.uploadItems.bind(this);
      this.applyRules = this.applyRules.bind(this);
      this.applyMetaData = this.applyMetaData.bind(this);
        this.state = {
          createdAhjs:[],
          existingAhjs:[]
        };
    }
    componentDidMount(){
        DefinitionsApi.getDefinitions().then(definitions=>{
            this.setState({ definitions })
        });
        DefinitionsApi.getDefinitionsMap().then(definitionsMap=>{
            this.setState({ definitionsMap })
        });
    }
  createAhjs(results){
    console.log('create ahjs with results');
    const { existingAhjs, createdAhjs } = this.state;
    const existing = [ ...existingAhjs, ...createdAhjs ];
    const uniqueAhjs = results.filter(result=>{
      const { name, type, id } = result;
      return !result.error && isUnique(result,existing,{id})
    }).map(item=>{
      return pickMetaData(item, true);
    });
    console.log('uniqueAhjs\n',uniqueAhjs);
    this.setState({
      createdAhjs:[...createdAhjs,...uniqueAhjs]
    })

  }
  tableChange(e){
    const { existingAhjs } = this.state;
    const { value } = e.target;
    this.setState({processing:'Loading Table Data...'});
    if( value ) DynamobdApi.scan(value).then(Items=>{
      this.setState({
        processing:null,
        existingAhjs: Items
      })
    });
    else this.setState({ processing:null, existingAhjs:[]});
    this.setState({ tableName:value })
  }
  deleteItems(key,value) {
    const { tableName, existingAhjs } = this.state;
    if(!tableName||existingAhjs.length===0) return null;
    this.setState({processing:'Deleting Items...'});
    if(!key&&!value) DynamobdApi.deleteMultiple(existingAhjs,tableName).then(()=>{
      this.setState({ processing:null, existingAhjs:[] });
    })
  }
  uploadItems(key,value){
    const { tableName, createdAhjs } = this.state;
    if(!key&&!value){
      console.log('uploadItems', createdAhjs);
      this.setState({processing:'Uploading Items...'});
      DynamobdApi.putAll(createdAhjs,tableName)
        .then((data)=>{
          this.setState({processing:null});
          console.log('batch data:::::\n',data);
        })
    }
  }
  setProcessing(processing){
    this.setState({processing})
  }
  applyRules(ahjRuleCollection){
    const { existingAhjs, createdAhjs } = this.state;

    const createdMap = Object.assign({},
      ...createdAhjs.map(ahj=>{return{[ahj.id]:ahj}})
    );
    const existingMap = Object.assign({},
      ...existingAhjs.map(ahj=>{return{[ahj.id]:ahj}})
    );

    let newCreatedAhjs = {};
    ahjRuleCollection.map(ahjRule=>{
      const { id, rules } = ahjRule;
      const existingAhj = newCreatedAhjs[id] || createdMap[id] || existingMap[id];
      if(existingAhj) newCreatedAhjs[id] = Object.assign({},
        existingAhj,
        {rules:Object.assign({},
          existingAhj.rules,
          rules
        )}
      )
    });
    this.setState({createdAhjs:writeToCollection(createdAhjs,Object.values(newCreatedAhjs))});
  }
  applyMetaData(dataCollection){
    const { existingAhjs, createdAhjs } = this.state;

    const createdMap = Object.assign({},
      ...createdAhjs.map(ahj=>{return{[ahj.id]:ahj}})
    );
    const existingMap = Object.assign({},
      ...existingAhjs.map(ahj=>{return{[ahj.id]:ahj}})
    );

    let newCreatedAhjs = {};

    dataCollection.map(item=>{
      const metaData = pickMetaData(item);
      const { id } = metaData;
      if(!id || (metaData.id&&Object.keys(metaData).length===1)) return false;
      const existingAhj = newCreatedAhjs[id] || createdMap[id] || existingMap[id];
      if(existingAhj){
        newCreatedAhjs[id] = Object.assign({},
          existingAhj,
          metaData
        )
      }
    });
    this.setState({createdAhjs:writeToCollection(createdAhjs,Object.values(newCreatedAhjs))});
  }
    render(){
      const { createdAhjs, definitions, definitionsMap, existingAhjs, processing } = this.state;
      console.log('createdAhjs:::::::::::',createdAhjs);
      return (
            <div>
              <div styleName="app-body">
                <div styleName="top-container">
                  <h1>Database Definitions Counts</h1>
                  <h2><u> Total Definitions Count: </u> { definitions?definitions.length:0 }</h2>
                  <h2><u>Conditions Count:</u> { definitionsMap?Object.keys(definitionsMap.conditions).length:0 }</h2>
                  <h2><u>Rules Count:</u> { definitionsMap?Object.keys(definitionsMap.rules).length:0 }</h2>
                </div>
                <div styleName="mid-container">
                  <div styleName="widget-container">
                    <Geocode createAhjs={this.createAhjs} setProcessing={this.setProcessing} />
                  </div>
                  <div styleName="widget-container">
                    <AddRules definitions={definitionsMap}
                              createAhjs={this.createAhjs}
                              applyRules={this.applyRules}
                              applyMetaData={this.applyMetaData}/>
                  </div>
                </div>
              </div>
              <LeftPanel createdAhjs={createdAhjs}
                         existingAhjs={existingAhjs}
                         tableChange={this.tableChange}
                         deleteItems={this.deleteItems}
                         uploadItems={this.uploadItems}
                         processing={processing} />
              <div styleName="header"> this is my header</div>
            </div>
        );
    }
}

export default cssModules(App, styles)
