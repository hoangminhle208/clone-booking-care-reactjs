import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './ManageDoctor.scss';
import Select from "react-select";
import { CRUD_ACTIONS, LANGUAGES } from '../../../utils';
import { getDetailInforDoctor } from '../../../services/userService';

const mdParser = new MarkdownIt(/* options */);

class ManageDoctor extends Component {

    constructor(props){
        super(props);
        this.state = {
            //save to Markdown table
            contentMarkdown: '',
            contentHTML: '',
            selectedOption: '',
            description:'',
            listDoctor:'',
            hasOldData:false,
            //save to doctor_infor table
            listPrice:[],
            listPayment:[],
            listProvince:[],
            selectedPrice:'',
            selectedPayment:'',
            selectedProvince:'',
            nameClinic:'',
            addressClinic:'',
            note:'',
            //
            selectedClinic:'',
            selectedSpecialty:'',
            listClinic:[],
            listSpecialty:[],
            clinicId:'',
            specialtyId:'',
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctorRedux();
        this.props.getRequiredDoctorInforRedux();
    }

    componentDidUpdate(prevProps,prevState,snapshot){
        if(prevProps.allDoctor!==this.props.allDoctor){
            let dataSelect = this.builDataInputSelect(this.props.allDoctor,'USERS');
            this.setState({
                listDoctor:dataSelect
            })
        }
        if(prevProps.language !== this.props.language){
            let dataSelect = this.builDataInputSelect(this.props.allDoctor,'USERS');
            let {resPrice,resPayment,resProvince} = this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.builDataInputSelect(resPrice,'PRICE');
            let dataSelectPayment = this.builDataInputSelect(resPayment,'PAYMENT');
            let dataSelectProvince = this.builDataInputSelect(resProvince,'PROVINCE');
            this.setState({
                listDoctor:dataSelect,
                listPrice:dataSelectPrice,
                listPayment:dataSelectPayment,
                listProvince:dataSelectProvince
            })
        }
        if(prevProps.allRequiredDoctorInfor!==this.props.allRequiredDoctorInfor){
            let {resPrice,resPayment,resProvince,resSpecialty,resClinic} = this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.builDataInputSelect(resPrice,'PRICE');
            let dataSelectPayment = this.builDataInputSelect(resPayment,'PAYMENT');
            let dataSelectProvince = this.builDataInputSelect(resProvince,'PROVINCE');
            let dataSelectSpecialty = this.builDataInputSelect(resSpecialty,'SPECIALTY');
            let dataSelectClinic = this.builDataInputSelect(resClinic,"CLINIC");
            this.setState({
                listPrice:dataSelectPrice,
                listPayment:dataSelectPayment,
                listProvince:dataSelectProvince,
                listSpecialty:dataSelectSpecialty,
                listClinic: dataSelectClinic
            })
        }
    }

    builDataInputSelect = (inputData,type) => {
        let result = [];
        let {language} = this.props;
        if(inputData && inputData.length >0 ){
            if(type=== 'USERS'){
                inputData.map((item,index)=>{
                    let object = {};
                    let labelEN = `${item.lastName} ${item.firstName}`;
                    let labelVI = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVI : labelEN;
                    object.value = item.id;
                    result.push(object);
                })
            }
            if(type==='PRICE'){
                inputData.map((item,index)=>{
                    let object = {};
                    let labelEN = `${item.valueEN} USD`;
                    let labelVI = `${item.valueVI} VNĐ` ;
                    object.label = language === LANGUAGES.VI ? labelVI : labelEN;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            if(type==='PAYMENT' || type==='PROVINCE'){
                inputData.map((item,index)=>{
                    let object = {};
                    let labelEN = `${item.valueEN}`;
                    let labelVI = `${item.valueVI}`;
                    object.label = language === LANGUAGES.VI ? labelVI : labelEN;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            if(type ==='SPECIALTY'){
                inputData.map((item,index)=>{
                    let obj = {};
                    obj.label = item.name;
                    obj.value = item.id;
                    result.push(obj); 
                })
            }
            if(type ==='CLINIC'){
                inputData.map((item,index)=>{
                    let obj = {};
                    obj.label = item.name;
                    obj.value = item.id;
                    result.push(obj); 
                })
            }
            
        }
        return result;
    }

    handleEditorChange = ({html,text}) =>{
        this.setState({
            contentHTML:html,
            contentMarkdown:text
        })
    }
    
    handleSaveContentMarkdown = () => {
        let {hasOldData} = this.state;
        this.props.saveDetailDoctor({
            contentHTML:this.state.contentHTML,
            contentMarkdown:this.state.contentMarkdown,
            description:this.state.description,
            doctorId:this.state.selectedOption.value,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

            selectedPrice:this.state.selectedPrice.value,
            selectedPayment:this.state.selectedPayment.value,
            selectedProvince:this.state.selectedProvince.value,
            nameClinic:this.state.nameClinic,
            addressClinic:this.state.addressClinic,
            note:this.state.note,
            clinicId:this.state.selectedClinic&&this.state.selectedClinic.value ? this.state.selectedClinic.value : '',
            specialtyId:this.state.selectedSpecialty.value
        });
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedOption });
        let {listPayment,listPrice,listProvince,listSpecialty,listClinic} = this.state;
        let res = await getDetailInforDoctor(selectedOption.value); 
        if(res && res.errCode ===0 &&res.data&&res.data.Markdown){
            let markdown = res.data.Markdown;
            
            let addressClinic='',nameClinic='',note='',
            paymentId='',priceId='',provinceId='',specialtyId='',clinicId='';

            let selectedPrice='',selectedPayment='',selectedProvince='',
            selectedSpecialty ='',selectedClinic='';

            if(res.data.Doctor_Infor){
                addressClinic = res.data.Doctor_Infor.addressClinic;
                nameClinic = res.data.Doctor_Infor.nameClinic;
                note = res.data.Doctor_Infor.note;
                paymentId = res.data.Doctor_Infor.paymentId;
                priceId = res.data.Doctor_Infor.priceId;
                provinceId = res.data.Doctor_Infor.provinceId;
                specialtyId = res.data.Doctor_Infor.specialtyId;
                clinicId = res.data.Doctor_Infor.clinicId;
                selectedPrice = listPrice.find(item=>{
                    return item && item.value === priceId; 
                });

                selectedPayment = listPayment.find(item=>{
                    return item && item.value === paymentId; 
                });

                selectedProvince = listProvince.find(item=>{
                    return item && item.value === provinceId; 
                });

                selectedSpecialty = listSpecialty.find(item=>{
                    return item && item.value === specialtyId;
                })
                
                selectedClinic = listClinic.find(item =>{
                    return item && item.value === clinicId;
                })
            }
            this.setState({
                contentHTML:markdown.contentHTML,
                contentMarkdown:markdown.contentMarkdown,
                description:markdown.description,
                hasOldData:true,
                nameClinic:nameClinic,
                addressClinic:addressClinic,
                note:note,
                selectedPayment:selectedPayment,
                selectedPrice:selectedPrice,
                selectedProvince:selectedProvince,
                selectedSpecialty:selectedSpecialty,
                selectedClinic:selectedClinic
            })
        }else{
            this.setState({
                contentHTML:'',
                contentMarkdown:'',
                description:'',
                hasOldData:false,
                nameClinic:'',
                addressClinic:'',
                note:'',
                selectedPayment:'',
                selectedPrice:'',
                selectedProvince:'',
                selectedSpecialty:'',
                selectedClinic:''
            })
        }
        console.log(`Option selected:`, res);
    };

    handleChangeSelectDoctorInfor = async (selectedOption,name) => {
        let stateName = name.name;
        let stateCopy = {...this.state};
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy
        });
        console.log('check name selected',name.name);
    }
    handleOnChangeText = (event,id) => {
        let stateCopy = {...this.state};
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    render() {
        let {hasOldData} = this.state;
        console.log('check st',this.state);
        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'><FormattedMessage id="admin.manage-doctor.title"/></div>
                <div className='more-infor'>
                    <div className='content-left form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.select-doctor"/></label>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChangeSelect}
                            options={this.state.listDoctor}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor"/>}
                        />
                    </div>
                    <div className='content-right'>
                        <label><FormattedMessage id="admin.manage-doctor.intro"/></label>
                        <textarea 
                        className='form-control'
                        onChange={(event)=>this.handleOnChangeText(event,'description')}
                        value={this.state.description}
                        ></textarea>
                    </div>
                </div>
                <div className='doctor-infor-extra row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.price"/></label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPrice}
                            name="selectedPrice"
                            placeholder={<FormattedMessage id="admin.manage-doctor.price"/>}
                        />
                    </div>
                    
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.payment"/></label>
                        <Select
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPayment}
                            name="selectedPayment"
                            placeholder={<FormattedMessage id="admin.manage-doctor.payment"/>}
                        />
                    </div>
                    
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.province"/></label>
                        <Select
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listProvince}
                            name="selectedProvince"
                            placeholder={<FormattedMessage id="admin.manage-doctor.province"/>}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.nameClinic"/></label>
                        <input 
                            className='form-control'
                            onChange={(event)=>this.handleOnChangeText(event,'nameClinic')}
                            value={this.state.nameClinic}
                        />
                    </div>
                    
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.addressClinic"/></label>
                        <input 
                            className='form-control'
                            onChange={(event)=>this.handleOnChangeText(event,'addressClinic')}
                            value={this.state.addressClinic}
                        />
                    </div>
                    
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.note"/></label>
                        <input 
                            className='form-control'
                            onChange={(event)=>this.handleOnChangeText(event,'note')}
                            value={this.state.note}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.specialty"/></label>
                        <Select
                            value={this.state.selectedSpecialty}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listSpecialty}
                            name='selectedSpecialty'
                            placeholder={<FormattedMessage id="admin.manage-doctor.specialty"/>}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.clinic"/></label>
                        <Select
                            value={this.state.selectedClinic}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listClinic}
                            name='selectedClinic'
                            placeholder={<FormattedMessage id="admin.manage-doctor.clinic"/>}
                        />
                    </div>
                </div>
                    
                <div className='manage-doctor-editor'>
                    <MdEditor 
                        value={this.state.contentMarkdown}
                        style={{ height: '300px' }} 
                        renderHTML={text => mdParser.render(text)} 
                        onChange={this.handleEditorChange} 
                    />
                </div>
                
                <button 
                    onClick={()=>this.handleSaveContentMarkdown()} 
                    className={hasOldData === true ? 'save-content-doctor' : 'create-content-doctor'}>
                        {hasOldData === true ? <FormattedMessage id="admin.manage-doctor.save"/> : <FormattedMessage id="admin.manage-doctor.add"/>}
                </button>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        allDoctor:state.admin.allDoctor,
        language:state.app.language,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorRedux: ()=> dispatch(actions.fetchAllDoctor()),
        getRequiredDoctorInforRedux:() => dispatch(actions.getRequiredDoctorInfor()),
        saveDetailDoctor: (data)=>dispatch(actions.saveDetailDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
