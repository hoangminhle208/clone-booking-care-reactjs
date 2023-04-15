import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import khamchuyenkhoa from '../../assets/icon-banner/khamchuyenkhoa.png';
import dichvuxetnghiem from '../../assets/icon-banner/dichvuxetnghiem.png';
import khamtainha from '../../assets/icon-banner/khamtainha.png';
import icon_lich_su from '../../assets/icon-banner/icon-lich-su.jpg';
import khamnhakhoa from '../../assets/icon-banner/khamnhakhoa.png';
import khamtongquat from '../../assets/icon-banner/khamtongquat.png';
import khamtuxa from '../../assets/icon-banner/khamtuxa.png';
import phauthuat from '../../assets/icon-banner/phau-thuat.jpg';
import suckhoetinhthan from '../../assets/icon-banner/suckhoetinhthan.png';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../utils';
import { changeLanguageApp } from '../../store/actions';
import { withRouter } from 'react-router-dom';
import langVI from '../../assets/vi-VN.png';
import langEN from '../../assets/en-US.png';

class HomeHeader extends Component {

    changeLanguage = (language) =>{
        //fire redux actions
        this.props.changeLanguageAppRedux(language);
    }

    returnHome = () => {
        if(this.props.history){
            this.props.history.push(`/home`);
        }
    }
    render() {
        let language = this.props.language;
        return (
            <React.Fragment>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i className="fas fa-bars"></i>
                            <div className='header-logo' onClick={()=>this.returnHome()}></div>
                        </div>
                        <div className='center-content'>
                            <div className='child-content'>
                                <div>
                                    <b><FormattedMessage id="home-header.speciality"/></b>
                                </div>
                                <div className='subs-title'><FormattedMessage id="home-header.searchdoctor"/></div>
                            </div>
                            <div className='child-content'>
                                <div>
                                    <b><FormattedMessage id="home-header.health-facility"/></b>
                                </div>
                                <div className='subs-title'><FormattedMessage id="home-header.select-room"/></div>
                            </div>
                            <div className='child-content'>
                                <div>
                                    <b><FormattedMessage id="home-header.doctor"/></b>
                                </div>
                                <div className='subs-title'><FormattedMessage id="home-header.select-doctor"/></div>
                            </div>
                            <div className='child-content'>
                                <div>
                                    <b><FormattedMessage id="home-header.fee"/></b>
                                </div>
                                <div className='subs-title'><FormattedMessage id="home-header.check-health"/></div>
                            </div>
                        </div>
                        <div className='right-content'>
                            <div className='support'>
                                <i className='fas fa-question-circle'><FormattedMessage id="home-header.support"/></i>
                            </div>
                            <div className={language===LANGUAGES.VI ? 'language-vi active' : 'language-vi'}>
                                <span onClick={()=>{this.changeLanguage(LANGUAGES.VI)}}>VN
                                    <img style={{height:'22px', width:'22px'}} src={langVI}/>
                                </span>
                            </div>
                            <div className={language===LANGUAGES.EN ? 'language-en active' : 'language-en'}>
                                <span onClick={()=>{this.changeLanguage(LANGUAGES.EN)}}>
                                    <img style={{height:'22px', width:'22px'}} src={langEN}/>EN
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.isShowBanner === true &&
                    <div className='home-header-banner'>
                    <div className='content-up'>
                        <div className='title1'><FormattedMessage id="banner.title1"/></div>
                        <div className='title2'><FormattedMessage id="banner.title2"/></div>
                        <div className='search'>
                            <i className='fas fa-search'></i>
                            <input type='text' placeholder='Tìm chuyên khoa khám bệnh'/>
                        </div>
                    </div>
                    <div className='content-down'>
                        <div className='options'>
                            <div className='options-child'>
                                <div className='icon-child' style={{backgroundImage:`url(${khamchuyenkhoa})`}}></div>
                                <div className='text-child'><FormattedMessage id="banner.child1"/></div>
                            </div>
                            <div className='options-child'>
                                <div className='icon-child' style={{backgroundImage:`url(${khamtuxa})`}}></div>
                                <div className='text-child'><FormattedMessage id="banner.child2"/></div>
                            </div>
                            <div className='options-child'>
                                <div className='icon-child' style={{backgroundImage:`url(${khamtongquat})`}}></div>
                                <div className='text-child'><FormattedMessage id="banner.child3"/></div>
                            </div>
                            <div className='options-child'>
                                <div className='icon-child' style={{backgroundImage:`url(${dichvuxetnghiem})`}}></div>
                                <div className='text-child'><FormattedMessage id="banner.child4"/></div>
                            </div>
                            <div className='options-child'>
                                <div className='icon-child' style={{backgroundImage:`url(${suckhoetinhthan})`}}></div>
                                <div className='text-child'><FormattedMessage id="banner.child5"/></div>
                            </div>
                            <div className='options-child'>
                                <div className='icon-child' style={{backgroundImage:`url(${khamnhakhoa})`}}></div>
                                <div className='text-child'><FormattedMessage id="banner.child6"/></div>
                            </div>
                            <div className='options-child'>
                                <div className='icon-child' style={{backgroundImage:`url(${phauthuat})`}}></div>
                                <div className='text-child'><FormattedMessage id="banner.child7"/></div>
                            </div>
                            <div className='options-child'>
                                <div className='icon-child' style={{backgroundImage:`url(${khamtainha})`}}></div>
                                <div className='text-child'><FormattedMessage id="banner.child8"/></div>
                            </div>
                            <div className='options-child'>
                                <div className='icon-child' style={{backgroundImage:`url(${icon_lich_su})`}}></div>
                                <div className='text-child'><FormattedMessage id="banner.child9"/></div>
                            </div>
                            
                        </div>
                    </div>
                    </div>}
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
