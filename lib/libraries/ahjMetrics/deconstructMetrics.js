
const getChildren = (metrics,key) => {
  return metrics[key]
}

module.exports = (ruleMetrics, orderBy) => {
  const metrics = ruleMetrics;

  console.log(':::initialization::::::deconstructMetrics::::');
  console.log('metrics:::::',metrics);
  console.log('orderBy:::::',orderBy);
  let currentIndex = orderBy.length - 1;

  orderBy.reverse().map((key, i)=>{
    currentIndex = currentIndex - i;
    const getCurrentObj = () => {
      let curr, current, parents = {all:[]};
      orderBy.map( ( lvl, dex ) => {
        if(dex === 0) curr = metrics;
        if( !current ) {
          parents.all.push(lvl);
          parents[lvl] = curr;
        }
        curr = curr[lvl];
        if( dex === currentIndex ) current = curr;
      });
      return {
        parents,
        current
      }
    };

    // if( index === 0 ) {
    //
    // }

    const { parents, current } = getCurrentObj();

    console.log('::::{ parents, current }:::::\n',{ parents, current })

  })

}
