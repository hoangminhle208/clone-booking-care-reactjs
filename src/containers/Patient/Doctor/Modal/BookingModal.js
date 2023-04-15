import React, { Component } from 'react';
import { connect } from "react-redux";
import "./BookingModal.scss";
import { FormattedMessage } from 'react-intl';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';
import { data, event } from 'jquery';
import DatePicker from '../../../../components/Input/DatePicker';
import * as action from '../../../../store/actions';
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { postPatientBookingAppointment } from '../../../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment/moment';

class BookingModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            fullName:'',
            phoneNumber:'',
            email:'',
            address:'',
            reason:'',
            birthday:'',
            gender:'',
            doctorId:'',
            selectedGender:'',
            timeType:'',
        }
    }
    

    componentDidMount() {
        this.props.fetchGender();
    }

    builDataGender = (data) => {
        let result = [];
        let language = this.props.language;
        if(data && data.length>0){
            data.map((item,index)=>{
                let obj = {};
                obj.label = language === LANGUAGES.VI ? item.valueVI : item.valueEN;
                obj.value = item.keyMap;
                result.push(obj);
            })
        }
        return result;
    }

    async componentDidUpdate(prevProps,prevState,snapshot){
        if(prevProps.language!==this.props.language){
            let option = this.builDataGender(this.props.genderRedux);
            this.setState({
                gender:option
            })
        }
        if(prevProps.genderRedux!==this.props.genderRedux){
            let option = this.builDataGender(this.props.genderRedux);
            this.setState({
                gender:option
            })
        }
        if(prevProps.dataTime!==this.props.dataTime){
            if(this.props.dataTime&& !_.isEmpty(this.props.dataTime)){
                let doctorId = this.props.dataTime.doctorId;
                let timeType = this.props.dataTime.timeType;
                this.setState({
                    doctorId:doctorId,
                    timeType:timeType
                })
            }
        }
    }

    handleOnChangeInput = (event,id) => {
        let valueInput = event.target.value;
        let stateCopy = {...this.state};
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        })
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday:date[0]
        });
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({
            selectedGender:selectedOption
        });
    }

    buildTimeBooking = (dataTime) => {
        let {language} = this.props;
        if(dataTime&&!_.isEmpty(dataTime)){
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVI : dataTime.timeTypeData.valueEN;
            let date = language === LANGUAGES.VI ? 
                moment.unix(+dataTime.date/1000).format('dddd - DD/MM/YYYY'):
                moment.unix(+dataTime.date/1000).locale('en').format('ddd - MM/DD/YYYY');
            return `${time} - ${date}`
        }
        return ``
    }

    buildDoctorName = (dataTime) => {
        let {language} = this.props;
        if(dataTime&&!_.isEmpty(dataTime)){
            let name = language === LANGUAGES.VI ? `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
            : `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`;
            return name;
        }
        return ``
    }

    handleConfirmBooking = async() => {
        let date = new Date(this.state.birthday).getTime();
        let timeString = this.buildTimeBooking(this.props.dataTime);
        let doctorName = this.buildDoctorName(this.props.dataTime);
        let res = await postPatientBookingAppointment({
            fullName:this.state.fullName,
            phoneNumber:this.state.phoneNumber,
            email:this.state.email,
            address:this.state.address,
            reason:this.state.reason,
            date:date,
            selectedGender:this.state.selectedGender.value,
            doctorId:this.state.doctorId,
            timeType:this.state.timeType,
            language:this.props.language,
            timeString:timeString,
            doctorName:doctorName
        });
        if(res&&res.errCode === 0 ){
            toast.success('Booking a new appointment success!');
            this.props.isCloseModal();
        }else{
            toast.error('Booking a new appointment error!');
        }
        //console.log(this.state);
    }

    render() {
        let {isOpenModal,isCloseModal,dataTime} = this.props;
        let doctorId ='';
        if(dataTime&& !_.isEmpty(dataTime)){
            doctorId = dataTime.doctorId;
        }
        return (
            <Modal  isOpen={isOpenModal}       
                    centered size='lg' className='booking-modal-container'
            >
                <div className='booking-modal-content'>
                    <div className='booking-modal-header'>
                        <span className='left'><FormattedMessage id="patient.booking-modal.title"/></span>
                        <span className='right' onClick={isCloseModal}><i className='fas fa-times'></i></span>
                    </div>
                    <div className='booking-modal-body'>
                        {/*JSON.stringify(dataTime)*/}
                        <div className='doctor-infor'>
                            <ProfileDoctor
                                doctorId={doctorId}
                                isShowDescriptionDoctor={false}
                                dataTime={dataTime}
                            />
                        </div>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.name"/></label>
                                <input className='form-control'
                                    value={this.state.fullName}
                                    onChange={(event)=>this.handleOnChangeInput(event,'fullName')}
                                ></input>
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.phone"/></label>
                                <input className='form-control'
                                    value={this.state.phoneNumber}
                                    onChange={(event)=>this.handleOnChangeInput(event,'phoneNumber')}
                                ></input>
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.email"/></label>
                                <input className='form-control'
                                    value={this.state.email}
                                    onChange={(event)=>this.handleOnChangeInput(event,'email')}
                                ></input>
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.address"/></label>
                                <input className='form-control'
                                    value={this.state.address}
                                    onChange={(event)=>this.handleOnChangeInput(event,'address')}
                                ></input>
                            </div>
                            <div className='col-12 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.reason"/></label>
                                <input className='form-control'
                                    value={this.state.reason}
                                    onChange={(event)=>this.handleOnChangeInput(event,'reason')}
                                ></input>
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.birthday"/></label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className='form-control'
                                    value={this.state.birthday}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.gender"/></label>
                                <Select
                                    value={this.state.selectedGender}
                                    options={this.state.gender}
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='booking-modal-footer'>
                        <button className='btn-booking-confirm' onClick={()=>this.handleConfirmBooking()}><FormattedMessage id="patient.booking-modal.confirm"/></button>
                        <button className='btn-booking-cancel' onClick={isCloseModal}><FormattedMessage id="patient.booking-modal.cancel"/></button>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGender: () => dispatch(action.fetchGenderStart()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
