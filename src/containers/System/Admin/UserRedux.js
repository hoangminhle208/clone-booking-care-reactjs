import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import "./UserRedux.scss";
import { LANGUAGES,CRUD_ACTIONS,CommonUtils } from '../../../utils';
import * as actions from "../../../store/actions/";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import TableManageUser from './TableManageUser';


class UserRedux extends Component {

    constructor(props){
        super(props);
        this.state = {
            genderArr:[],
            positionArr:[],
            roleArr:[],
            previewImgURL:'',
            isOpen:false,

            email:'',
            password:'',
            firstName:'',
            lastName:'',
            phoneNumber:'',
            address:'',
            gender:'',
            position:'',
            role:'',
            avatar:'',

            action:'',
            userEditId:'',
        }
    }


    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
    }

    componentDidUpdate(prevProps,prevState,snapshot) {
        if(prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length>0 ? arrGenders[0].keyMap : ''
            })
        }
        if(prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length>0 ? arrRoles[0].keyMap : ''
            })
        }
        if(prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr:arrPositions,
                position: arrPositions && arrPositions.length>0 ? arrPositions[0].keyMap : ''
            })
        }
        if(prevProps.listUsers!==this.props.listUsers){
            let arrGenders = this.props.genderRedux;
            let arrRoles = this.props.roleRedux;
            let arrPositions = this.props.positionRedux;
            this.setState({
                email:'',
                password:'',
                firstName:'',
                lastName:'',
                phoneNumber:'',
                address:'',
                avatar:'',
                previewImgURL:'',
                gender: arrGenders && arrGenders.length>0 ? arrGenders[0].keyMap : '',
                position: arrPositions && arrPositions.length>0 ? arrPositions[0].keyMap : '',
                role: arrRoles && arrRoles.length>0 ? arrRoles[0].keyMap : '',
                action:CRUD_ACTIONS.CREATE
            })
        }
    }

    handleOnChangeImage = async(event) => {
        let data = event.target.files;
        let file = data[0];
        if(file) {
            let base64 = await CommonUtils.getBase64(file);
            //console.log('check base 64 image',base64);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                avatar:base64
            })
        }
    }

    openPreviewImage = () => {
        if(!this.state.previewImgURL) return;
        this.setState({
            isOpen:true
        })
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if(isValid===false) return;
        let action = this.state.action;
        if(action===CRUD_ACTIONS.CREATE){
            //fire redux create user
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar
            });
        }
        if(action === CRUD_ACTIONS.EDIT){
            //fire redux edit user
            this.props.editUserRedux({
                id: this.state.userEditId,
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar : this.state.avatar
            });
        }
        
        
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = ['email','password','firstName','lastName','phoneNumber','address','gender','position','role'];
        for(let i=0 ;i<arrCheck.length;i++){
            if(!this.state[arrCheck[i]]){
                isValid = false;
                alert('Missing parameter: '+ arrCheck[i]);
                //console.log(this.state);
                break;
            }
        }
        return isValid;
    }
    onChangeInput = (event,id) => {
        let copyState = {...this.state};
        copyState[id]=event.target.value;
        this.setState({
            ...copyState
        })
    }

    handleEditUserFromParent = (data) => {
        let imageBase64 ='';
        if(data.image) {
            imageBase64 = new Buffer(data.image,'base64').toString('binary');
        }
        //console.log('check user from parent',data);
        this.setState({
            email:data.email,
            password:'DONTSHOW',
            firstName:data.firstName,
            lastName:data.lastName,
            phoneNumber:data.phonenumber,
            address:data.address,
            gender:data.gender,
            position:data.positionId,
            role:data.roleId,
            avatar:'',
            previewImgURL:imageBase64,
            action:CRUD_ACTIONS.EDIT,
            userEditId:data.id,
        })
    }

    render() {
        let genders = this.state.genderArr;
        let positions = this.state.positionArr;
        let roles = this.state.roleArr;
        let language = this.props.language;
        let isGetGender = this.props.isLoadingGender;
        let {email,password,firstName,lastName,phoneNumber,address,gender,position,role,avatar} = this.state;
        return (
            <div className='user-redux-container'>
                <div className='title'>
                    Manage User Redux with Hoang
                </div>
                <div className="user-redux-body">
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3'><FormattedMessage id="manage-user.add" /></div>
                            <div className='col-12'>{isGetGender === true ? 'Loading gender' : ''}</div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.email"/></label>
                                <input className='form-control' type='email' 
                                value={email} onChange={(event)=>{this.onChangeInput(event,'email')}}
                                disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}/>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.password" /></label>
                                <input className='form-control' type='password' 
                                value={password} onChange={(event)=>{this.onChangeInput(event,'password')}}
                                disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}/>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.first-name" /></label>
                                <input className='form-control' type='text' 
                                value={firstName} onChange={(event)=>{this.onChangeInput(event,'firstName')}}/>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.last-name" /></label>
                                <input className='form-control' type='text' 
                                value={lastName} onChange={(event)=>{this.onChangeInput(event,'lastName')}}/>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.phone-number" /></label>
                                <input className='form-control' type='text' 
                                value={phoneNumber} onChange={(event)=>{this.onChangeInput(event,'phoneNumber')}}/>
                            </div>
                            <div className='col-9'>
                                <label><FormattedMessage id="manage-user.address" /></label>
                                <input className='form-control' type='text' 
                                value={address} onChange={(event)=>{this.onChangeInput(event,'address')}}/>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.gender" /> </label>
                                <select className='form-control' 
                                onChange={(event)=>{this.onChangeInput(event,'gender')}}
                                value={gender}>
                                    {genders && genders.length> 0 &&
                                        genders.map((item,index)=>{
                                            return (
                                                <option key={index} value={item.keyMap}>{language===LANGUAGES.VI ? item.valueVI : item.valueEN}</option>
                                            )
                                            })
                                        }
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.position" /></label>
                                <select className='form-control'
                                onChange={(event)=>{this.onChangeInput(event,'position')}}
                                value={position}>
                                    {positions && positions.length> 0 &&
                                            positions.map((item,index)=>{
                                                return (
                                                    <option key={index} value={item.keyMap}>{language===LANGUAGES.VI ? item.valueVI : item.valueEN}</option>
                                                )
                                                })
                                            }
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.role" /></label>
                                <select className='form-control'
                                onChange={(event)=>{this.onChangeInput(event,'role')}}
                                value={role}>
                                    {roles && roles.length> 0 &&
                                        roles.map((item,index)=>{
                                            return (
                                                <option key={index} value={item.keyMap}>{language===LANGUAGES.VI ? item.valueVI : item.valueEN}</option>
                                            )
                                            })
                                        }
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.image" /></label>
                                <div className='preview-img-container'>
                                    <div>
                                        <input id='previewImg' type='file' hidden
                                        onChange={(event)=>{this.handleOnChangeImage(event)}}
                                        />
                                        <label className='label-upload' htmlFor='previewImg'><FormattedMessage id="manage-user.upload-image"/> <i className="fas fa-upload"></i></label>
                                        <div className='preview-image' style={{backgroundImage:`url(${this.state.previewImgURL})`}}
                                        onClick={()=> this.openPreviewImage()}>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 my-3'>
                                <button className={this.state.action === CRUD_ACTIONS.EDIT ? 'btn btn-warning' :'btn btn-primary'} type='button'
                                onClick={()=>this.handleSaveUser()}>{this.state.action == CRUD_ACTIONS.EDIT ? <FormattedMessage id="manage-user.edit" />: <FormattedMessage id="manage-user.save" />}</button>
                            </div>
                            <div className='col-12 mb-5'>
                                <TableManageUser
                                    handleEditUserFromChild = {this.handleEditUserFromParent}
                                    action={this.state.action}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                

                { this.state.isOpen === true &&
                    <Lightbox
                    mainSrc={this.state.previewImgURL}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        isLoadingGender: state.admin.isLoadingGender,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        editUserRedux: (data) => {dispatch(actions.editUser(data))},
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
