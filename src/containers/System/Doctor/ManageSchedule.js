import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageSchedule.scss';
import Select from 'react-select';
import * as action from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { saveBulkScheduleDoctor } from '../../../services/userService';

class ManageSchedule extends Component {
    constructor(props){
        super(props);
        this.state = {
            listDoctor:[],
            selectedDoctor:{},
            currentDate:'',
            rangeTime:[],
        }
    }
    componentDidMount(){
        this.props.fetchAllDoctor();
        this.props.fetchAllScheduleTime();
    }

    componentDidUpdate(prevProps,prevState,snapshot){
        if(prevProps.allDoctor!==this.props.allDoctor){
            let dataSelect = this.builDataInputSelect(this.props.allDoctor);
            this.setState({
                listDoctor:dataSelect
            })
        }
        if(prevProps.language !== this.props.language){
            let dataSelect = this.builDataInputSelect(this.props.allDoctor);
            this.setState({
                listDoctor:dataSelect
            })
        }
        if(prevProps.allScheduleTime!==this.props.allScheduleTime){
            let data = this.props.allScheduleTime;
            if(data&&data.length>0){
                data = data.map(item=>({...item,isSelected:false}))
            }
            this.setState({
                rangeTime:data
            })
        }
    }

    builDataInputSelect = (inputData) => {
        let result = [];
        let {language} = this.props;
        {inputData&&inputData.length>0&&
        inputData.map((item,index)=>{
            let object = {};
            let labelEN = `${item.lastName} ${item.firstName}`;
            let labelVI = `${item.firstName} ${item.lastName}`;
            object.label = language === LANGUAGES.VI ? labelVI : labelEN;
            object.value = item.id;
            result.push(object);
        })}
        return result;
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedDoctor:selectedOption });
    };

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate:date[0]
        })
    }

    handleClickTime = (time) => {
        let {rangeTime} = this.state;
        if(rangeTime&&rangeTime.length>0){
            rangeTime = rangeTime.map(item=>{
                if(item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            })
        }
        this.setState({
            rangeTime:rangeTime
        })
    }

    handleSaveSchedule = async() => {
        let {rangeTime,selectedDoctor,currentDate} = this.state;
        let result = [];
        if(!currentDate) {
            toast.error('🦄 invalid date!');
            return;
        }
        if(selectedDoctor&& _.isEmpty(selectedDoctor)){
            toast.error('🦄 invalid doctor!');
            return;
        }
        let formatedDate = new Date(currentDate).getTime();
        if(rangeTime&&rangeTime.length>0){
            let selectdTime = rangeTime.filter(item=>item.isSelected===true);
            if(selectdTime&&selectdTime.length>0){
                selectdTime.map((item,index) =>{
                    let obj = {};
                    obj.doctorId = selectedDoctor.value;
                    obj.date = formatedDate;
                    obj.timeType = item.keyMap;
                    result.push(obj);
                })
            }else{
                toast.error('Invalid selected time!');
                return;
            }
        }
        let res = await saveBulkScheduleDoctor({
            arrSchedule:result,
            doctorId:selectedDoctor.value,
            formatedDate:formatedDate
        });
        //console.log('checl res',res);
        if(res && res.infor && res.infor.errCode === 0){
            toast.success('Save schedule success');
        }else{
            toast.error('Error save schedule');
            console.log('check error save schedule',res);
        }
    }
    render() {
        let {rangeTime} = this.state;
        let {language} = this.props;
        return (
            <div className='manage-schedule-container'>
                <div className='m-s-title'>
                    <FormattedMessage id='manage-schedule.title'/>
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id="manage-schedule.chose-doctor"/></label>
                            <Select
                            value={this.state.selectedDoctor}
                            onChange={this.handleChangeSelect}
                            options={this.state.listDoctor}
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id="manage-schedule.chose-date"/></label>
                            <DatePicker 
                                className="form-control"
                                onChange={this.handleOnChangeDatePicker}
                                value={this.state.currentDate}
                                minDate={new Date().setHours(0,0,0,0)} 
                            />
                        </div>
                        <div className='col-12 pick-hour-container'>
                            {rangeTime&&rangeTime.length>0&&
                            rangeTime.map((item,index)=>{
                                return(
                                    <button 
                                        className={item.isSelected===true?'btn btn-schedule active':'btn btn-schedule'} key={index}
                                        onClick={()=>this.handleClickTime(item)}>
                                        {language===LANGUAGES.VI ? item.valueVI : item.valueEN}
                                    </button>
                                )
                            })}
                        </div>
                        <div>
                            <button 
                                className='btn btn-primary btn-save-schedule'
                                onClick={()=>this.handleSaveSchedule()}><FormattedMessage id="manage-schedule.save"/></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctor: state.admin.allDoctor,
        allScheduleTime: state.admin.allScheduleTime,
        userInfor: state.app.userInfor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor:() =>dispatch(action.fetchAllDoctor()),
        fetchAllScheduleTime:() =>dispatch(action.fetchAllScheduleTime())

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
