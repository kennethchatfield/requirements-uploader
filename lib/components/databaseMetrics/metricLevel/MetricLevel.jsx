import React from 'react';
import cssModules from 'react-css-modules';
import styles from './metricLevel.css';

const metricItem = ({ metric, map, lvl, orderBy }) => {
  const current = map[orderBy[lvl]];

  return (
    <div styleName="lvl-container">
      <div styleName="lvl-label">{`${current.name}:${ definition.name } Contains ${ map[current.child].name }`}</div>
      <div styleName="lvl-metrics">
        {`${ map[current.child].name } Count: ${Object.keys(metrics).length}`}
      </div>
    </div>
  )
}



// const orderBy = ['ruleId','conditionId','attrIndex','id'];

const MetricLevel = ({ metrics, orderBy, map }) => {
  const parseCurrentMetric = () => {

  }
  const current = map[orderBy[lvl]];
  const { child, name } = current;
  return (
    <div styleName="container">
      { Object.keys(metrics).map(key=>{
        return (
          <div styleName="lvl-one-container">

          </div>
        )
      })}
    </div>
  )
}

export default cssModules(MetricLevel,styles);
