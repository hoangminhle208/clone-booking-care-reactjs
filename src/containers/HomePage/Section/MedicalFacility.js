import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Slider from "react-slick";
import { getAllClinic } from '../../../services/userService';
import {withRouter} from 'react-router';

class MedicalFacility extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataClinic: [],

        }
    }

    async componentDidMount() {
        let res = await getAllClinic();
        if(res && res.errCode ===0 ){
            this.setState({
                dataClinic:res.data
            })
        }
    }

    handleViewDetailClinic = (clinic) => {
        if(this.props.history){
            this.props.history.push(`/detail-clinic/${clinic.id}`)
        }
    }

    render() {
        let settings = {
            dots:false,
            infinite:false,
            speed:500,
            slidesToShow:4,
            slidesToScroll:1,
        };
        let {dataClinic}  = this.state;
        //console.log(dataClinic)
        return (
            <div className='section-share section-medical-facility'>
            <div className='section-container'>
                <div className='section-header'>
                    <span className='title-section'>Cơ sở y tế nổi bật</span>
                    <button className='btn-section'>XEM THÊM</button>
                </div>
                <div className='section-body'>
                    <Slider {...settings}>
                        {dataClinic && dataClinic.length> 0 &&
                            dataClinic.map((item,index)=>{
                                return (
                                    <div className='section-customzie' key = {index}>
                                        <div className='bg-image section-medical-facility'
                                            style={{backgroundImage:`url(${item.image})`}}
                                            onClick={()=> this.handleViewDetailClinic(item)}
                                        ></div>
                                        <div className='name-clinic'>{item.name}</div>
                                    </div>
                                )
                            })
                        }
                    </Slider>
                </div>
                
            </div>
        </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
