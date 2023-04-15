import React, { Component } from 'react';
import { connect } from "react-redux";
import "./ManageSpecialty.scss";
import { CommonUtils, LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { createNewSpecialty } from '../../../services/userService';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt();

class ManageSpecialty extends Component {
    constructor(props){
        super(props);
        this.state = {
            name:'',
            imageBase64:'',
            descriptionHTML:'',
            descriptionMarkdown:'',
        }
    }
    

    componentDidMount() {

    }


    async componentDidUpdate(prevProps,prevState,snapshot){
    
    }

    handleEditorChange = ({html,text}) => {
        this.setState({
            descriptionHTML:html,
            descriptionMarkdown:text,
        });
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if(file){
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64:base64
            })
        }
    }

    handleOnChangeInput = (event,id) =>{
        let stateCopy = {...this.state};
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    handleSaveSpecialty = async() => {
        let res = await createNewSpecialty(this.state);
        if(res&&res.errCode ===0){
            toast.success('Add new specialty success!');
        }else{
            toast.error('Something went wrong or missing parameter');
            console.log('check res specialty',this.res);
        }
    }

    render() {
        return (
            <div className='manage-specialty-container'>
                <div className='ms-title'>Quản lý chuyên khoa</div>
                <div className='add-new-specialty row'>
                    <div className='col-6 form-group'>
                        <label>Tên chuyên khoa</label>
                        <input className='form-control' 
                            type='text' value={this.state.name}
                            onChange={(event)=>this.handleOnChangeInput(event,'name')}    
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Ảnh chuyên khoa</label>
                        <input type='file' className='form-control-file'
                            onChange={(event)=>{this.handleOnChangeImage(event)}}
                        />
                    </div>
                    <div className='col-12'>
                        <MdEditor
                            style={{height:'60vh'}}
                            renderHTML={text=>mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className='col-12'>
                        <button className='btn-save-specialty' onClick={this.handleSaveSpecialty}>Add new</button>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
