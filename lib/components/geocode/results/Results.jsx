import React from 'react';
import cssModules from 'react-css-modules';
import styles from './results.css'
import Result from '../result/Result'
import { downloadCSV } from '../../../utilities/downloadAsCsv'

const Results = ({results, createAhjs}) => {
  let status = {success:0, fail:0};
  if(results){
    results.map(result=>{
      result.formattedAddress?status.success++:status.fail++;
    });
    return (
      <div styleName="results-body">
        <div styleName="results-container">
          <div styleName="results-caption">
            Results
          </div>
          <div styleName="results-overview-container">
            <div styleName="status-container">
              <div styleName="status-item-container">
                <div styleName="status-success-label">Success:</div>
                <div styleName="status-success-count">{status.success}</div>
              </div>
              <div styleName="status-item-container">
                <div styleName="status-fail-label">Fail:</div>
                <div styleName="status-fail-count">{status.fail}</div>
              </div>
            </div>
            <div styleName="create-ahj-container">
              <input styleName="download-results" type="submit" value="Download" onClick={()=>{downloadCSV(null,results)}} />
              <input styleName="create-ahjs" type="submit" value="Create Ahjs" onClick={()=>{createAhjs(results)}} />
            </div>
          </div>
          <div styleName="result-headers">
            <div styleName="formatted-address-header">Formatted Address</div>
            <div styleName="header">Latitude</div>
            <div styleName="header">Longitude</div>
            <div styleName="header">Type</div>
          </div>
          {
            results.map((result, index)=>{
              if(!result.formattedAddress) return (
                <div key={index} styleName="error-container">
                  <div>{`Query String: ${result.queryString||"Empty"}`}</div>
                  <div>{result.error||result.status||JSON.stringify(result)}</div>
                </div>
              );
              return (
                <div key={index}>
                  <Result result={result} />
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
};

export default cssModules(Results, styles);
