import React, { Component } from 'react';
import { connect } from "react-redux";
import "./DetailClinic.scss";
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailClinicById,getAllCodeService } from '../../../services/userService';
import _ from 'lodash';
import { Link } from 'react-router-dom';

class DetailClinic extends Component {
    constructor(props){
        super(props);
        this.state = {
            arrDoctorId: [],
            dataClinic:{},
        }
    }
    

    async componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let id = this.props.match.params.id;
            let res = await getDetailClinicById({
                id:id,
            });
            if(res&&res.errCode ===0){
                let data = res.data;
                let arrDoctorId = [];
                if(data && !_.isEmpty(data)){
                    let arr = data.doctorClinic;
                    if(arr&&arr.length>0){
                        arr.map(item=>{
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }
                this.setState({
                    dataClinic:res.data,
                    arrDoctorId:arrDoctorId,
                })
            }
            
        }
    }

    async componentDidUpdate(prevProps,prevState,snapshot){
    
    }

    handleOnChangSelect = async(event) => {
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let id = this.props.match.params.id;
            let res = await getDetailClinicById({
                id:id,
            });
            if(res&&res.errCode === 0){
                let data = res.data;
                let arrDoctorId = [];
                if(data && !_.isEmpty(data)){
                    let arr = data.doctorSpecialty;
                    if(arr&&arr.length>0){
                        arr.map(item=>{
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }
                this.setState({
                    dataSpecialty:res.data,
                    arrDoctorId:arrDoctorId,
                })
            }
        }
    }

    render() {
        let {arrDoctorId,dataClinic} = this.state;
        let {language} = this.props;
        let img = dataClinic.image;
        return (
            <div className='detail-specialty-container'>
                <HomeHeader/>
                <div className='detail-specialty-body'>
                    <div className='description-specialty'>
                        {dataClinic&& !_.isEmpty(dataClinic)
                        &&
                        <>
                            <div className='background-img'>
                                <div className='header-clinic'>
                                    <div
                                        className='content-left'
                                        style={{backgroundImage: `url(${img})`}}
                                    ></div>
                                    <div className='content-right'>
                                        <div className='up'>{dataClinic.name}</div>
                                        <div className='down'>{dataClinic.address}</div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div dangerouslySetInnerHTML={{__html:dataClinic.descriptionHTML}}></div>
                        </>
                        }
                    </div>
                    {arrDoctorId&&arrDoctorId.length>0&&
                    arrDoctorId.map((item,index)=>{
                        return(
                            <div className='each-doctor' key={index}>
                                <div className='dt-content-left'>
                                    <div className='profile-doctor'>
                                        <ProfileDoctor
                                            doctorId={item}
                                            isShowDescriptionDoctor={true}
                                            //dataTime={dataTime}
                                        />
                                    </div>
                                    <div className='more-infor'><Link to={`/detail-doctor/${item}`}>{language === LANGUAGES.VI ? 'Xem thêm': 'More infor'}</Link></div>
                                </div>
                                <div className='dt-content-right'>
                                    <div className='doctor-schedule'>
                                        <DoctorSchedule doctorIdFromParent={item} />
                                    </div>
                                    <div className='doctor-extra-infor'>
                                        <DoctorExtraInfor doctorIdFromParent={item}/>
                                    </div>
                                    
                                </div>
                            </div>
                        )
                    })
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
