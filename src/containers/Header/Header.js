import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LANGUAGES, USER_ROLE } from '../../utils';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu , doctorMenu} from './menuApp';
import './Header.scss';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            menuApp:[],
        }
    }
    handleChangLanguage = (language) =>{
        this.props.changLanguageAppRedux(language);
    }
    componentDidMount(){
        let {userInfo} = this.props;
        let menu = [];
        if(userInfo&& !_.isEmpty(userInfo)){
            let role = userInfo.roleId;
            if(role ===USER_ROLE.ADMIN){
                menu = adminMenu;
            }
            if(role ===USER_ROLE.DOCTOR){
                menu = doctorMenu;
            }
            this.setState({
                menuApp:menu
            })
        }
        //console.log('check user infor',this.props.userInfo);
    }
    render() {
        const { processLogout , language, userInfo } = this.props;
        //console.log('check user info: ',this.props.userInfo);
        return (
            <div className="header-container">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>

                <div className='languages'>
                    <span className='welcome'><FormattedMessage id="home-header.welcome"/>
                        , {userInfo && userInfo.firstName ? userInfo.firstName : ''} !
                    </span>
                    <span className={language === LANGUAGES.VI ? "language-vi active" : "language-vi"} onClick={()=>this.handleChangLanguage(LANGUAGES.VI)}>VN</span>
                    <span className={language === LANGUAGES.EN ? "language-en active" : "language-en"} onClick={()=>this.handleChangLanguage(LANGUAGES.EN)}>EN</span>

                    {/* nút logout */}
                    <div className="btn btn-logout" onClick={processLogout} title="Log out">
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changLanguageAppRedux : (language) => dispatch(actions.changeLanguageApp(language)),
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
