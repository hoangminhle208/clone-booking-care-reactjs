import React, { Component } from 'react';
import { connect } from "react-redux";
import "./ManagePatient.scss";
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import DatePicker from '../../../components/Input/DatePicker';
import { getListPatientForDoctor,postSendRemedy } from '../../../services/userService';
import RemedyModal from './RemedyModal';
import {toast} from 'react-toastify';

class ManagePatient extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentDate:new Date().setHours(0,0,0,0),
            dataPatient:[],
            isOpenRemedyModal:false,
            dataModal:{},
        }
    }
    

    async componentDidMount() {
        //console.log(this.props);
        this.getDataPatient();
        //console.log(this.state.dataPatient)
    }

    getDataPatient = async() => {
        let {user} = this.props;
        let {currentDate} = this.state;
        let formateDate = this.formateDate(currentDate);
        let res = await getListPatientForDoctor({
            doctorId:user.id,
            date:formateDate
        });
        
        if(res && res.errCode === 0 ){
            this.setState({
                dataPatient:res.data
            })
        }
        //console.log(this.state.dataPatient);
    }

    formateDate = (currentDate) =>{
        return new Date(currentDate).getTime();
    } 


    async componentDidUpdate(prevProps,prevState,snapshot){
    
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate:date[0]
        },async()=>{await this.getDataPatient();}
        )
    }

    handleBtnConfirm = () => {

    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal:false,
            dataModal:{}
        })
    }

    handleBtnRemedy = (item) => {
        let data = {
            doctorId:item.doctorId,
            patientId:item.patientId,
            email:item.patientData.email,
            name:item.patientData.firstName,
            timeType:item.timeType,
            patientName:item.patientData.firstName,
            time:item.timeTypeDataBooking.valueVI,
        }
        this.setState({
            isOpenRemedyModal:true,
            dataModal:data
        })
    }

    sendRemedy = async(dataChild)=> {
        let {dataModal} = this.state;
        let res = await postSendRemedy({
            email:dataChild.email,
            imgBase64: dataChild.imgBase64,
            doctorId:dataModal.doctorId,
            patientId:dataModal.patientId,
            timeType:dataModal.timeType,
            language:this.props.language,
            patientName:dataModal.patientName,
            time:dataModal.time,
            
        })
        if(res&&res.errCode===0){
            toast.success('send remedy success!');
            this.closeRemedyModal();
            await this.getDataPatient();
        }else{
            toast.error('Something wrong...');
            console.log('error and check res',res);
        }
    }

    render() {
        let {dataPatient,isOpenRemedyModal,dataModal} = this.state;
        return (
            <>
                <div className='manage-patient-container'>
                <div className='m-p-title'>Quản lý kế hoạch khám bệnh bệnh nhân</div>
                <div className='manage-patient-body row'>
                    <div className='col-3 form-group'>
                        <label>Chọn ngày khám</label>
                        <DatePicker 
                                className="form-control"
                                onChange={this.handleOnChangeDatePicker}
                                value={this.state.currentDate}
                            />
                    </div>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Giờ khám</th>
                            <th scope="col">Họ và tên</th>
                            <th scope="col">Giới tính</th>
                            <th scope="col">Địa chỉ</th>
                            <th scope="col">Handle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataPatient&&dataPatient.length>0 ?
                            dataPatient.map((item,index)=>{
                                return(
                                    <tr key={index}>
                                        <th scope="row">{index+1}</th>
                                        <td>{item.timeTypeDataBooking.valueVI}</td>
                                        <td>{item.patientData.firstName}</td>
                                        <td>{item.patientData.genderData.valueVI}</td>
                                        <td>{item.patientData.address}</td>
                                        <td>
                                            <button className='btn btn-warning' onClick={()=>this.handleBtnConfirm(item)}>Xác nhận</button>
                                            <button className='btn btn-primary' onClick={()=>this.handleBtnRemedy(item)}>Tạo hóa đơn</button>
                                        </td>
                                    </tr>
                                )
                            }) : <tr><td colSpan={6} style={{textAlign:'center'}}>Lịch trống</td></tr>
                            } 
                        </tbody>
                    </table>
                </div>
                </div>
                <RemedyModal
                    isOpenModal={isOpenRemedyModal}
                    dataModal={dataModal}
                    closeRemedyModal={this.closeRemedyModal}
                    sendRemedy={this.sendRemedy}
                />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user:state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
