import React, { Component } from 'react';
import { connect } from "react-redux";
import "./ProfileDoctor.scss";
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { getProfileDoctorById } from '../../../services/userService';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import moment from 'moment/moment';

class ProfileDoctor extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataProfile:{},
        }
    }
    

    async componentDidMount() {
        let data = await this.getInforDoctor(this.props.doctorId);
        this.setState({
            dataProfile:data
        })
    }

    getInforDoctor = async (id) => {
        let result = {};
        if(id){
            let res = await getProfileDoctorById(id);
            if(res && res.errCode ===0 ){
                result = res.data;
            }
        }
        return result;
    }


    async componentDidUpdate(prevProps,prevState,snapshot){
        if(this.props.doctorId!==prevProps.doctorId){
            let data = await this.getInforDoctor(this.props.doctorId);
            this.setState({
                dataProfile: data,
            });
        }
    }

    renderTimeBooking = (dataTime) => {
        let {language} = this.props;
        if(dataTime&&!_.isEmpty(dataTime)){
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVI : dataTime.timeTypeData.valueEN;
            let date = language === LANGUAGES.VI ? 
                moment.unix(+dataTime.date/1000).format('dddd - DD/MM/YYYY'):
                moment.unix(+dataTime.date/1000).locale('en').format('ddd - MM/DD/YYYY');
            return (
                <>
                    <div>{time} - {date}</div>
                    <div><FormattedMessage id="patient.booking-modal.free-booking"/></div>
                </>
            )
        }
        return <></>
    }

    render() {
        //console.log('check state profile doctor.js',this.state);
        let {dataProfile} = this.state;
        let {language,isShowDescriptionDoctor,dataTime} = this.props;
        let nameEN =''; let nameVI ='';
        if(dataProfile&&dataProfile.positionData){
            nameVI = `${dataProfile.positionData.valueVI}, ${dataProfile.firstName} ${dataProfile.lastName} `;
            nameEN = `${dataProfile.positionData.valueEN}, ${dataProfile.lastName} ${dataProfile.firstName} `;
        }
        return (
            <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                    <div className='content-left' 
                        style={{backgroundImage:`url(${dataProfile&&dataProfile.image ? dataProfile.image : ''})`}}>
                    </div>
                    <div className='content-right'>
                        <div className='up'>
                            {language === LANGUAGES.VI ? nameVI : nameEN}
                        </div>
                        <div className='down'>
                            {isShowDescriptionDoctor === true ?
                                <>
                                    {dataProfile&&dataProfile.Markdown&&dataProfile.Markdown.description
                                    &&
                                    <span>{dataProfile.Markdown.description}</span>
                                    }
                                </>
                                :
                                <>{this.renderTimeBooking(dataTime)}</>
                            }
                        </div>
                    </div>
                </div>
                <div className='price'><FormattedMessage id="patient.booking-modal.price"/>
                        {dataProfile&&dataProfile.Doctor_Infor&&language===LANGUAGES.VI&&
                            <NumberFormat
                                className='currency'
                                value={dataProfile.Doctor_Infor.priceTypeData.valueVI}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={'đ'}
                            />
                        }
                        {dataProfile&&dataProfile.Doctor_Infor&&language===LANGUAGES.EN&&
                            <NumberFormat
                                className='currency'
                                value={dataProfile.Doctor_Infor.priceTypeData.valueEN}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={'$'}
                            />
                        }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
