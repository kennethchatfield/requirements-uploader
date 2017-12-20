import React from 'react';
import cssModules from 'react-css-modules';
import styles from './geocode.css';
import GeocodeApi from '../../api/GeocodeApi';
import { handleCsv } from '../../utilities/parseCsv';
import { buildQueryString } from '../../utilities/utilities';
import Results from './results/Results';

class Geocode extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      addressInfo:{
        street:"",
        city:"",
        county:"",
        state:"",
        zip:""
      }
    };
  }
  updateAddressInput(e){
    const { value, name } = e.target;
    this.setState({
      addressInfo:Object.assign({},this.state.addressInfo,{
        [name]:value
      })
    });
  }
  geocodeAddress(){
    const {addressInfo, type} = this.state;
    const validateAddressInfo = () => {
      const valid = Object.keys(addressInfo).map(key=>{
        return addressInfo[key] !== "";
      });
      return valid.includes(true)
    };
    if(validateAddressInfo()){
      const query = { type, queryString: addressInfo};
      GeocodeApi.geocodeAddress(query).then(result=>{
        this.setState({ results: [result] })
      })
    }
  }
  geocodeThat(){
    let queries = this.state.queries;
    if(queries){
      queries = queries.map(query=>{
        return Object.assign({},{queryString:buildQueryString(query)},query)
      });
      this.props.setProcessing('Batch Geocoding in Progress...');
      GeocodeApi.batchGeocodeAddress(queries).then(results=>{
        console.log('::::::::results:::::::::::',results);
        this.setState({ results });
        this.props.setProcessing(null);
      })
    }
  }
  typeChange(e){
    const { value } = e.target;
    console.log('value::::\n',value);
    this.setState({type:value});
  }
  handleCsvFile(e){
    handleCsv(e,(queries)=>{
      console.log('in callback w/queries:::\n',queries);
      this.setState({queries})
    });
  }


  render(){
    const { results, addressInfo, type, queries } = this.state;
    const { createAhjs } = this.props;
    return (
      <div styleName="geocode-widget" style={results?{}:{maxWidth: "300px"}}>
        <div styleName="geocode-header">
            <u> --- Geocoder --- </u>
        </div>
        <div styleName="geocode-address-container">
          <div styleName="geocode-address-row">
            <input name="street" type="text" placeholder="street" value={addressInfo["street"]} onChange={(e)=>{this.updateAddressInput(e)}} />
            <input name="city" type="text" placeholder="city" value={addressInfo["city"]} onChange={(e)=>{this.updateAddressInput(e)}} />
          </div>
          <div styleName="geocode-address-row">
            <input name="county" type="text" placeholder="county" value={addressInfo["county"]} onChange={(e)=>{this.updateAddressInput(e)}} />
            <input name="state" type="text" placeholder="state" value={addressInfo["state"]} onChange={(e)=>{this.updateAddressInput(e)}} />
          </div>
          <div styleName="geocode-address-row">
            <input name="zip" type="text" placeholder="zip" value={addressInfo["zip"]} onChange={(e)=>{this.updateAddressInput(e)}} />
            <input name="type" type="text" placeholder="type" value={type} onChange={(e)=>{this.typeChange(e)}} />

          </div>
          <div styleName="geocode-address-row">
            <input type="submit" value="Geocode" onClick={()=>{this.geocodeAddress()}} />
          </div>
        </div>
        <div styleName="file-selector-container">
          <u>Select (CSV) To Geocode</u>
          <div styleName="type-input-container">
            <div>Specify Type</div>
            <select onChange={(e)=>{this.typeChange(e)}}>
              <option value="included">Included</option>
              <option value="city">City</option>
              <option value="county">County</option>
              <option value="state">State</option>
              <option value="utility">Utility</option>
              <option value="roc">ROC</option>
            </select>
          </div>
          <input type="file" accept=".csv" onChange={(e)=>{this.handleCsvFile(e)}} styleName="file-selector-button" />
          <input type="submit" onClick={()=>{this.geocodeThat()}} />
        </div>

        <div styleName="create-ahjs-container">
          <input type="file" accept=".csv" onChange={(e)=>{this.handleCsvFile(e)}} styleName="file-selector-button" />
          <input type="submit" onClick={()=>{createAhjs(queries)}} />
        </div>

        <Results results={results} createAhjs={ createAhjs } />
      </div>
    );
  }
}


export default cssModules(Geocode, styles);
