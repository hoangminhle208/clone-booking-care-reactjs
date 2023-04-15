import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
class ModalEditUser extends Component {

    constructor(props){
        super(props);
        this.state = {
            id:'',
            email:'',
            password:'',
            firstName:'',
            lastName:'',
            address:'',
        }
    }

    componentDidMount() {
        // let user = this.props.currentUser (tuong tu nhu) let {currentUser}=this.props
        let user = this.props.currentUser;
        if(user && !_.isEmpty(user)){
            this.setState({
                id:user.id,
                email:user.email,
                password:'hardcode',
                firstName:user.firstName,
                lastName:user.lastName,
                address:user.address,
            })
        }
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

    handleSaveUser = () => {
        let isValid = this.checkValideInput();
        if(isValid ===true){
            this.props.editUser(this.state);
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
                    <ModalHeader toggle={()=>{this.toggle()}}>Edit user</ModalHeader>
                    <ModalBody>
                            <div className='modal-user-body'>
                                <div className='input-container'>
                                    <label>Email</label>
                                    <input type='text' disabled value={this.state.email} onChange={(event)=>{this.handleOnChangeInput(event,"email")}}></input>
                                </div>
                                <div className='input-container'>
                                    <label>Password</label>
                                    <input type='password' disabled value={this.state.password} onChange={(event)=>{this.handleOnChangeInput(event,"password")}}></input>
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
                    <Button color="primary" className='px-3' onClick={()=>{this.handleSaveUser()}}>
                        Save changes
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);

