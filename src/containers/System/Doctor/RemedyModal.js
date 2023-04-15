import React, { Component } from 'react';
import { connect } from "react-redux";
import "./RemedyModal.scss";
import { FormattedMessage } from 'react-intl';
import { Modal } from 'reactstrap';
import { Button,ModalBody,ModalFooter } from 'reactstrap';
import { CommonUtils } from '../../../utils';

class RemedyModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            email:'',
            imgBase64:'',
        }
    }
    

    componentDidMount() {
        if(this.props.dataModal){
            this.setState({
                email:this.props.dataModal.email
            })
        }
    }


    async componentDidUpdate(prevProps,prevState,snapshot){
        if(prevProps.dataModal!==this.props.dataModal){
            this.setState({
                email:this.props.dataModal.email
            })
        }
    }

    handleOnChangEmail = (event) => {
        this.setState({
            email:event.target.value
        })
    }

    handleOnChangImage = async(event) => {
        let data = event.target.files;
        let file = data[0];
        if(file){
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imgBase64:base64
            })
        }
    }

    handleSendRemedy = () => {
        this.props.sendRemedy(this.state);
    }

    render() {
        let { dataModal,isOpenModal,closeRemedyModal,sendRemedy } = this.props;
        return (
            <Modal  isOpen={isOpenModal}       
                centered size='lg' className='booking-modal-container'
            >
                <div className='modal-header'>
                    <h5 className='modal-title'>Hóa đơn khám bệnh</h5>
                    <button type='button' className='close' aria-label='Close' onClick={closeRemedyModal}>
                        <span aria-hidden="true">x</span>
                    </button>
                </div>
                <ModalBody>
                    <div className='row'>
                        <div className='col-6 form-group'>
                                <label>Email bệnh nhân</label>
                                <input onChange={(event)=>this.handleOnChangEmail(event)} className='form-control' type="email" value={this.state.email}></input>
                        </div>
                        <div className='col-6 form-group'>
                                <label>Chọn hóa đơn</label>
                                <input onChange={(event)=>this.handleOnChangImage(event)} type="file" className='form-control-file' ></input>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={()=>this.handleSendRemedy()}>Send</Button>
                    <Button color='secondary' onClick={closeRemedyModal}>Close</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
