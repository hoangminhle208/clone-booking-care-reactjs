import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageUser.scss';
import * as actions from "../../../store/actions";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt(/* options */);

function handleEditorChange({html,text}){
    console.log('handleEditorChange',html,text);
}

class TableManageUser extends Component {

    constructor(props){
        super(props);
        this.state = {
            userRedux: []
        }
    }

    componentDidMount() {
        this.props.fetchUserRedux();
    }

    componentDidUpdate(prevProps,prevState,snapshot){
        if(prevProps.listUsers!==this.props.listUsers){
            this.setState({
                userRedux:this.props.listUsers
            })
        }
    }

    handleDeleteUser = (user) => {
        this.props.deleteUserRedux(user.id);
    }

    handleEditUser = (user) => {
        this.props.handleEditUserFromChild(user);
    }

    render() {
        //console.log('check all user',this.props.listUsers);
        //console.log('check list usser',this.state.userRedux);
        let arrUsers = this.state.userRedux;
        return (
            <React.Fragment>
                <table id="TableManageUser">
                <tbody>
                    <tr>
                        <th>Email</th>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                        {arrUsers && arrUsers.length>0 &&
                        arrUsers.map((item,index)=>{
                            return (
                                <tr key={index}>
                                    <td>{item.email}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.address}</td>
                                    <td>
                                        <button className='btn-edit' 
                                        onClick={()=>this.handleEditUser(item)}><i className='fas fa-pencil-alt'></i></button>
                                        <button className='btn-delete'
                                        onClick={()=>this.handleDeleteUser(item)}><i className='fas fa-trash'></i></button>
                                    </td>
                                </tr>
                            )
                        })}
                        
                </tbody>
                </table>
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        deleteUserRedux: (id) => dispatch(actions.deleteUser(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
