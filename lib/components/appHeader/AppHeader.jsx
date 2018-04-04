import React from 'react';
import cssModules from 'react-css-modules';
import styles from './appHeader.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setActiveEnvironment } from '../../actions/environmentActions'
import { setView } from '../../actions/globalActions'
import config from '../../../config';
import { Link } from 'react-router-dom';


class AppHeader extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.toggleEnvDropDown = this.toggleEnvDropDown.bind(this);
    this.toggleViewDropDown = this.toggleViewDropDown.bind(this);
    this.state = {
      envDropDown: false,
      viewDropDown:false
    }
  }
  componentWillReceiveProps( nextProps ){
    const nextView = nextProps.path.replace(/\//gi, '');
    const { view, setView } = this.props;
    console.log('nextView:::',nextView);
    if( view !== nextView ){
      setView( nextView );
    }
  }
  toggleEnvDropDown(){
    const envDropDown = !this.state.envDropDown;
    this.setState({
      envDropDown
    })
  }
  toggleViewDropDown(){
    const viewDropDown = !this.state.viewDropDown;
    this.setState({
      viewDropDown
    })
  }

  render(){

    const {
      props:{
        active,
        all,
        setActiveEnvironment,
        setView,
        view
      },
      state:{
        envDropDown,
        viewDropDown
      }
    } = this;


    const views = ['upload','metrics', 'mutate'];
    console.log( 'this.props.path', this.props.path );
    return(
      <div styleName="header">
        <div styleName="toggle-view-container">
          <div styleName="toggle-view-label">
            Current View:
          </div>
          <div styleName="change-view-container">
            <div styleName="selected-env" onClick={this.toggleViewDropDown}>
              { view ? view : "None" }
            </div>
            <div styleName="env-drop-down-container" hidden={ !viewDropDown }>
              <div styleName="env-drop-down">
                {
                  views.map( (v, index) => {
                    return (
                      <Link key={index} to={`/${v}`}>
                        <div styleName="env-option"
                             onClick={()=>{ setView(v) }} >
                          { v }
                        </div>
                      </Link>

                    );
                  })
                }
              </div>
            </div>
          </div>
        </div>
        <div styleName="active-env-container">
          <div styleName="active-env-label">
            Active Environment:
          </div>
          <div styleName="change-active-env">
            <div styleName="selected-env" onClick={this.toggleEnvDropDown}>
              { active ? config[active].name : "None" }
            </div>
            <div styleName="env-drop-down-container" hidden={ !envDropDown }>
              <div styleName="env-drop-down">
                {
                  all.map((env,index)=>{
                    return (
                      <div key={index}
                           styleName="env-option"
                           onClick={()=>{ setActiveEnvironment(env) }} >
                        { config[env].name }
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return Object.assign({},
    bindActionCreators( { setActiveEnvironment }, dispatch ),
    bindActionCreators( { setView }, dispatch )
  )
};

const mapStateToProps = (state) => {
  const { active, all } = state.environment;
  const { view } = state.global;
  console.log('all',all);
  return {
    active,
    all,
    view
  }
};

const appHeaderExport = cssModules(AppHeader, styles);

export default connect(mapStateToProps, mapDispatchToProps)(appHeaderExport)
