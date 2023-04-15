import React, { Component } from 'react';
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { LANGUAGES } from '../../../utils';
import { getScheduleDoctorByDate } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';

class DoctorSchedule extends Component {
    constructor(props){
        super(props);
        this.state = {
            allDay:[],
            allAvailableTime:[],
            isOpenModalBooking:false,
            dataScheduleTimeModal: {},

        }
    }
    

    async componentDidMount() {
        let {language} = this.props;
        let allDay = this.getArrDay(language);
        this.setState({
            allDay:allDay,
        });
        if(this.props.doctorIdFromParent){
            let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent,allDay[0].value);
            this.setState({
                allAvailableTime:res.data ? res.data : []
            })
        }
        
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getArrDay = (language) =>{
        let allDay = [];
            for(let i=0;i<7;i++){
                let obj = {};
                if(language === LANGUAGES.VI){
                    if(i===0){
                        let ddMM = moment(new Date()).format('DD/MM');
                        let today = `Hôm nay - ${ddMM}`;
                        obj.label = today;
                    }else{
                        let labelVI = moment(new Date()).add(i,'days').format('dddd - DD/MM');
                        obj.label = this.capitalizeFirstLetter(labelVI);
                    }
                    
                }else{
                    if(i===0){
                        let ddMM = moment(new Date()).format('DD/MM');
                        let today = `Today - ${ddMM}`;
                        obj.label = today;
                    }else{
                        obj.label = moment(new Date()).add(i,'days').locale('en').format('ddd - DD/MM');
                    }
                    
                }
                obj.value = moment(new Date()).add(i,'days').startOf('day').valueOf();
                allDay.push(obj);
        }
        return allDay;
    }

    async componentDidUpdate(prevProps,prevState,snapshot){
        if(prevProps.language !== this.props.language){
            let allDay = this.getArrDay(this.props.language);
            this.setState({
                allDay:allDay
            })
        }
        if(prevProps.doctorIdFromParent !== this.props.doctorIdFromParent){
            let allDay = this.getArrDay(this.props.language);
            let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent,allDay[0].value);
            this.setState({
                allAvailableTime:res.data ? res.data : []
            })
        }
    }

    handleOnChangeSelect = async (event) => {
        if(this.props.doctorIdFromParent&&this.doctorIdFromParent!==-1){
            let doctorId = this.props.doctorIdFromParent;
            let date = event.target.value;
            let res = await getScheduleDoctorByDate(doctorId,date);
            if(res&&res.errCode ===0){
                this.setState({
                    allAvailableTime:res.data ? res.data : []
                })
            }
            console.log('check schedule',res);
        }
    }

    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking : true,
            dataScheduleTimeModal:time
        });
    }
    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking : false
        })
    }

    render() {
        let {allDay,allAvailableTime,isOpenModalBooking,dataScheduleTimeModal} = this.state;
        let {language} = this.props;
        return (
            <>
            <div className='doctor-schedule-container'>
                <div className='all-schedule'>
                    <select onChange={(event)=>{this.handleOnChangeSelect(event)}}>
                        {allDay&&allDay.length>0&&
                        allDay.map((item,index)=>{
                            return (
                                <option value={item.value} key={index}>{item.label}</option>
                            )
                        })}
                    </select>
                </div>
                <div className='all-available-time'>
                    <div className='text-calendar'>
                        <i className='fas fa-calendar-alt'><span> <FormattedMessage id="patient.detail-doctor.schedule"/></span></i>
                    </div>
                    <div className='time-content'>
                        {allAvailableTime&&allAvailableTime.length>0 ? 
                        <>
                            <div className='time-content-btn'>
                                {allAvailableTime.map((item,index)=>{
                                    let timeDisplay = language === LANGUAGES.VI ? item.timeTypeData.valueVI : item.timeTypeData.valueEN;
                                    return (
                                        <button key={index}
                                            onClick={()=>this.handleClickScheduleTime(item)}
                                            className={language===LANGUAGES.VI ?'btn-vie':'btn-en'}
                                        >{timeDisplay}</button>
                                    )
                                })
                                }
                            </div>
                            <div className='book-free'>
                                <span> 
                                    <FormattedMessage id="patient.detail-doctor.chose"/> 
                                    <i className='far fa-hand-point-up'></i> 
                                    <FormattedMessage id="patient.detail-doctor.book-free"/></span>
                            </div>
                        </>
                        : <div className='no-schedule'><FormattedMessage id="patient.detail-doctor.no-schedule"/></div>}
                    </div>
                </div>
            </div>
            <BookingModal
                isOpenModal = {isOpenModalBooking}
                isCloseModal = {this.closeBookingModal}
                dataTime = {dataScheduleTimeModal}
            />
            </>    
            
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
