import React from 'react';
import cssModules from 'react-css-modules';
import styles from './anyTable.css';


class AnyTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { };
  }

  render(){
    const { collection } = this.props;
    const headers = Object.keys(collection[0]);
    const columns = headers.map((header,key)=>{
      return (
        <div key={key} styleName="any-table-column">
          <div styleName="table-header">{header}</div>
          {
            collection.map((item,index)=>{
              return <div key={index} styleName="data-cell">{item[header]}</div>
            })
          }
        </div>
      )
    });
    return (
      <div styleName="any-table-container">
        <div styleName="any-table">
          { columns }
        </div>
      </div>
    );
  }
}


export default cssModules(AnyTable, styles);
