import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
class ModalUser extends Component {

    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
            firstName:'',
            lastName:'',
            address:'',
        }
        this.listenToEmiteer();
    }

    componentDidMount() {
        
    }

    listenToEmiteer = () => {
        emitter.on('EVENT_CLEAR_MODAL_DATA',()=>{
            //reset state
            this.setState({
                email:'',
                password:'',
                firstName:'',
                lastName:'',
                address:''
            })
        })
    }
    toggle = () => {
        this.props.toggleFromParent();
    }

    handleOnChangeInput = (event,id) =>{
        let copySate = {...this.state};
        copySate[id] = event.target.value;
        this.setState({
            ...copySate
        });
        
    }
    checkValideInput = () => {
        let isValue =  true;
        let arrInput = ['email','password','firstName','lastName','address'];
        for(let i=0;i<arrInput.length;i++){
            if(!this.state[arrInput[i]]){
                isValue = false;
                alert('Missing parameter: '+arrInput[i]);
                break;
            }
        }
        return isValue;
    }

    handleAddNewUser = () => {
        let isValid = this.checkValideInput();
        if(isValid ===true){
            this.props.createNewUser(this.state);
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} 
                    toggle={()=>{this.toggle()}} 
                    className={'modal-user-container'}
                    size='lg'
                    centered
                    >
                    <ModalHeader toggle={()=>{this.toggle()}}>Create new user</ModalHeader>
                    <ModalBody>
                            <div className='modal-user-body'>
                                <div className='input-container'>
                                    <label>Email</label>
                                    <input type='text' value={this.state.email} onChange={(event)=>{this.handleOnChangeInput(event,"email")}}></input>
                                </div>
                                <div className='input-container'>
                                    <label>Password</label>
                                    <input type='password' value={this.state.password} onChange={(event)=>{this.handleOnChangeInput(event,"password")}}></input>
                                </div>
                                <div className='input-container'>
                                    <label>First name</label>
                                    <input type='text' value={this.state.firstName} onChange={(event)=>{this.handleOnChangeInput(event,"firstName")}}></input>
                                </div>
                                <div className='input-container'>
                                    <label>Last name</label>
                                    <input type='text' value={this.state.lastName} onChange={(event)=>{this.handleOnChangeInput(event,"lastName")}}></input>
                                </div>
                                <div className='input-container max-width-input'>
                                    <label>Address</label>
                                    <input type='text' value={this.state.address} onChange={(event)=>{this.handleOnChangeInput(event,"address")}}></input>
                                </div>
                            </div>
                            

                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" className='px-3' onClick={()=>{this.handleAddNewUser()}}>
                        Create user
                    </Button>{' '}
                    <Button color="secondary" className='px-3' onClick={()=>{this.toggle()}}>
                        Close
                    </Button>
                    </ModalFooter>
                </Modal>
        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);

