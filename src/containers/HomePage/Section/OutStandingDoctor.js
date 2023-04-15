import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import {LANGUAGES} from "../../../utils/constant"; 
import { withRouter } from 'react-router';


class OutStandingDoctor extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            arrDoctors:[]
        }
    }

    componentDidUpdate(prevProps,prevState,snapshot){
        if(prevProps.topDoctorRedux!==this.props.topDoctorRedux){
            this.setState({
                arrDoctors:this.props.topDoctorRedux
            })
        }
    }

    componentDidMount() {
        this.props.loadTopDoctors();
    }

    handleViewDetailDoctor = (doctor) => {
        //console.log('detail: ',doctor);
        this.props.history.push(`/detail-doctor/${doctor.id}`);
    }

    render() {
        let doctors = this.state.arrDoctors;
        let language = this.props.language;
        let settings = {
            dots:false,
            infinite:false,
            speed:500,
            slidesToShow: 4,
            slidesToScroll:1,
        };
        //console.log('check doctor:',this.props.topDoctorRedux);
        return (
            <div className='section-share section-outstanding-doctor'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id="home-page.out-standing-doctor"/></span>
                        <button className='btn-section'><FormattedMessage id="home-page.more-infor"/></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...settings}>
                            {doctors && doctors.length>0
                            && doctors.map((item,index)=>{
                                let imageBase64 = '';
                                if(item.image) {
                                    imageBase64 = new Buffer(item.image,'base64').toString('binary');
                                }
                                let nameVI = `${item.positionData.valueVI}, ${item.firstName} ${item.lastName} `;
                                let nameEN = `${item.positionData.valueEN}, ${item.lastName} ${item.firstName} `;
                                return (
                                    <div className='section-customzie' key={index} onClick={()=>this.handleViewDetailDoctor(item)}>
                                        <div className='customzie-border'>
                                            <div className='outer-bg'>
                                                <div className='bg-image section-outstanding-doctor'
                                                style={{backgroundImage: `url(${imageBase64})`}}></div>
                                            </div>
                                            <div className='position text-center'>
                                                <div>{language === LANGUAGES.VI ? nameVI : nameEN}</div>
                                                <div>Cơ xương khớp</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </Slider>
                    </div>
                    
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        topDoctorRedux: state.admin.topDoctor,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
