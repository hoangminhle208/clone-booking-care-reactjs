import React, { Component } from 'react';
import { connect } from "react-redux";
import "./DetailSpecialty.scss";
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailSpecialtyById,getAllCodeService } from '../../../services/userService';
import _ from 'lodash';
import { Link } from 'react-router-dom';

class DetailSpecialty extends Component {
    constructor(props){
        super(props);
        this.state = {
            arrDoctorId: [],
            dataSpecialty:{},
            listProvince:[],
        }
    }
    

    async componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let id = this.props.match.params.id;
            let res = await getDetailSpecialtyById({
                id:id,
                location:'ALL'
            });
            let resProvince = await getAllCodeService('PROVINCE');
            //console.log('check res frm',resProvince);
            if(res&&res.errCode ===0&&resProvince&&resProvince.errCode===0){
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
                let dataProvince = resProvince.data;
                if(dataProvince&&dataProvince.length>0){
                    dataProvince.unshift({
                        createAt:null,
                        keyMap:"ALL",
                        type:"PROVINCE",
                        valueEN:"ALL",
                        valueVI:"Toàn quốc"
                    });
                }
                this.setState({
                    dataSpecialty:res.data,
                    arrDoctorId:arrDoctorId,
                    listProvince:dataProvince ? dataProvince : []
                })
            }
        }
    }

    async componentDidUpdate(prevProps,prevState,snapshot){
    
    }

    handleOnChangSelect = async(event) => {
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let id = this.props.match.params.id;
            let location = event.target.value;
            let res = await getDetailSpecialtyById({
                id:id,
                location:location
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
        let {arrDoctorId,dataSpecialty,listProvince} = this.state;
        let {language} = this.props;
        return (
            <div className='detail-specialty-container'>
                <HomeHeader/>
                <div className='detail-specialty-body'>
                    <div className='description-specialty'>
                        {dataSpecialty&& !_.isEmpty(dataSpecialty)
                        &&<div dangerouslySetInnerHTML={{__html:dataSpecialty.descriptionHTML}}></div>
                        }
                    </div>
                    <div className='search-sp-doctor'>
                        <select onChange={(event)=>this.handleOnChangSelect(event)}>
                            {listProvince&&listProvince.length>0&&
                                listProvince.map((item,index)=>{
                                    return (
                                        <option value={item.keyMap} key={index}>
                                            {language === LANGUAGES.VI ? item.valueVI : item.valueEN}
                                        </option>
                                    )
                                })
                            }
                        </select>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
