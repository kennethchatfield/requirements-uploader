import React from 'react';
import cssModules from 'react-css-modules';
import styles from './result.css';

const Result = ({result}) => {
  if(result){
    return (
      <div styleName="result-body">
        <div styleName="query-string-container">
          <div styleName="query-string-label"><u>Query String:</u></div>
          <div styleName="query-string">{result.queryString}</div>
        </div>
        <div styleName="results-data">
          <div styleName="formatted-address-container">{result.formattedAddress}</div>
          <div styleName="location-container">{result.lat}</div>
          <div styleName="location-container">{result.lng}</div>
          <div styleName="location-container">{result.type}</div>
        </div>
      </div>
    );
  }
};

export default cssModules(Result, styles);
