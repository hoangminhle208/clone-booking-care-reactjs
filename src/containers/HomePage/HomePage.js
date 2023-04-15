import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import Specialty from './Section/Specialty';
import MedicalFacility from './Section/MedicalFacility';
import OutStandingDoctor from './Section/OutStandingDoctor';
import './HomePage.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Handbook from './Section/Handbook';
import About from './Section/About';
import HomeFooter from './HomeFooter';

class HomePage extends Component {

    render() {
        return (
            <div>
                <HomeHeader isShowBanner={true}/>
                <Specialty/>
                <MedicalFacility/>
                <OutStandingDoctor/>
                <Handbook/>
                <About/>
                <HomeFooter/>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
