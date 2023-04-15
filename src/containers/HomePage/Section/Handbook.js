import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Slider from "react-slick";

class Handbook extends Component {

    render() {
        let settings = {
            dots:false,
            infinite:false,
            speed:500,
            slidesToShow:4,
            slidesToScroll:1,
        };
        return (
            <div className='section-share section-handbook'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>Cẩm nang</span>
                        <button className='btn-section'>XEM THÊM</button>
                    </div>
                    <div className='section-body'>
                        <Slider {...settings}>
                            <div className='section-customzie'>
                                <div className='outer-bg'>
                                    <div className='bg-image section-handbook'></div>
                                </div>
                                <div className='position '>
                                    <div>Cẩm nang 1</div>
                                </div>
                            </div>
                            <div className='section-customzie'>
                                <div className='outer-bg'>
                                    <div className='bg-image section-handbook'></div>
                                </div>
                                <div className='position '>
                                    <div>Cẩm nang 2</div>
                                </div>
                            </div>
                            <div className='section-customzie'>
                                <div className='outer-bg'>
                                    <div className='bg-image section-handbook'></div>
                                </div>
                                <div className='position '>
                                    <div>Cẩm nang 3</div>
                                </div>
                            </div>
                            <div className='section-customzie'>
                                <div className='outer-bg'>
                                    <div className='bg-image section-handbook'></div>
                                </div>
                                <div className='position '>
                                    <div>Cẩm nang 4</div>
                                </div>
                            </div>
                            <div className='section-customzie'>
                                <div className='outer-bg'>
                                    <div className='bg-image section-handbook'></div>
                                </div>
                                <div className='position '>
                                    <div>Cẩm nang 5</div>
                                </div>
                            </div>
                            <div className='section-customzie'>
                                <div className='outer-bg'>
                                    <div className='bg-image section-handbook'></div>
                                </div>
                                <div className='position '>
                                    <div>Cẩm nang 6</div>
                                </div>
                            </div>
                            <div className='section-customzie'>
                                <div className='outer-bg'>
                                    <div className='bg-image section-handbook'></div>
                                </div>
                                <div className='position '>
                                    <div>Cẩm nang 7</div>
                                </div>
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Handbook);
