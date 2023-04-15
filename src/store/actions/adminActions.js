import actionTypes from './actionTypes';
import { getAllCodeService,createNewUserService,getAllUsers,
    deleteUserService,editUserService,getTopDoctorHomeService, getAllDoctorService,
    saveDetailDoctorService, getAllSpecialty, getAllClinic } from '../../services/userService';
import { toast } from 'react-toastify';

// export const fetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START
// })

export const fetchGenderStart = () => {
    return async(dispatch,getState) => {
        try {
            dispatch({
                type:actionTypes.FETCH_GENDER_START
            })
            let res = await getAllCodeService("GENDER");
            if(res && res.errCode === 0){
                dispatch(fetchGenderSuccess(res.data));
            }else{
                dispatch(fetchGenderFailed());
            }
        } catch (error) {
            dispatch(fetchGenderFailed());
        }
    }
}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})

export const fetchPositionStart = () => {
    return async(dispatch,getState) => {
        try {
            dispatch({
                type:actionTypes.FETCH_POSITION_SUCCESS
            })
            let res = await getAllCodeService("POSITION");
            if(res && res.errCode === 0){
                dispatch(fetchPositionSuccess(res.data));
            }else{
                dispatch(fetchPositionFailed());
            }
        } catch (error) {
            dispatch(fetchPositionFailed());
        }
    }
}

export const fetchRoleStart = () => {
    return async(dispatch,getState) => {
        try {
            dispatch({
                type:actionTypes.FETCH_ROLE_SUCCESS
            })
            let res = await getAllCodeService("ROLE");
            if(res && res.errCode === 0){
                dispatch(fetchRoleSuccess(res.data));
            }else{
                dispatch(fetchRoleFailed());
            }
        } catch (error) {
            dispatch(fetchRoleFailed());
        }
    }
}

export const createNewUser = (data) => {
    return async(dispatch,getState) => {
        try {
            let res = await createNewUserService(data);
            if(res && res.errCode === 0){
                toast.success('🦄 Create user success!',{theme:"light",type:"default"});
                dispatch(saveUserSuccess());
                dispatch(fetchAllUsersStart());
            }else{
                dispatch(saveUserFailed());
            }
        } catch (error) {
            dispatch(saveUserFailed());
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
})

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED
})


export const fetchAllUsersStart = () => {
    return async(dispatch,getState) => {
        try {
            dispatch({
                type:actionTypes.FETCH_ALL_USER_SUCCESS
            })
            let res = await getAllUsers("ALL");
            if(res && res.errCode === 0){
                dispatch(fetchAllUsersSuccess(res.users.reverse()));
            }else{
                dispatch(fetchAllUsersFailed());
            }
        } catch (error) {
            dispatch(fetchAllUsersFailed());
        }
    }
}

export const fetchAllUsersSuccess = (data) =>({
    type: actionTypes.FETCH_ALL_USER_SUCCESS,
    users:data
})

export const fetchAllUsersFailed = () =>({
    type: actionTypes.FETCH_ALL_USER_FAILED,
})

export const deleteUser = (userId) => {
    return async(dispatch,getState) => {
        try {
            let res = await deleteUserService(userId);
            if(res && res.errCode === 0){
                toast.success('🦄 Delete user success!',{theme:"light",type:"default"});
                dispatch(deleteUserSuccess());
                dispatch(fetchAllUsersStart());
            }else{
                toast.error('🦄 Delete user error!',{theme:"light",type:"default"});
                dispatch(deleteUserFailed());
            }
        } catch (error) {
            toast.error('🦄 Delete user error!',{theme:"light",type:"default"});
            dispatch(deleteUserFailed());
        }
    }
}

export const deleteUserSuccess = () =>({
    type: actionTypes.DELETE_USER_SUCCESS,
})

export const deleteUserFailed = () =>({
    type: actionTypes.DELETE_USER_FAILED,
})

export const editUser = (user) => {
    return async(dispatch,getState) => {
        try {
            let res = await editUserService(user);
            if(res && res.errCode === 0){
                toast.success('🦄 Update user success!',{theme:"light",type:"default"});
                dispatch(editUserSuccess());
                dispatch(fetchAllUsersStart());
            }else{
                toast.error('🦄 Update user error!',{theme:"light",type:"default"});
                dispatch(editUserFailed());
            }
        } catch (error) {
            toast.error('🦄 Update user error!',{theme:"light",type:"default"});
            dispatch(editUserFailed());
        }
    }
}

export const editUserSuccess = () =>({
    type: actionTypes.EDIT_USER_SUCCESS,
})

export const editUserFailed = () =>({
    type: actionTypes.EDIT_USER_FAILED,
})

export const fetchTopDoctor = () => {
    return async(dispatch,getState) => {
        try {
            let res = await getTopDoctorHomeService('10');
            if(res &&res.errCode ===0){
                dispatch({
                    type:actionTypes.FETCH_TOP_DOCTOR_SUCCESS,
                    dataDoctor:res.data
                })
            }else{
                dispatch({
                    type:actionTypes.FETCH_TOP_DOCTOR_FAILED
                })
            }
        } catch (error) {
            console.log(error);
            dispatch({
                type:actionTypes.FETCH_TOP_DOCTOR_FAILED
            })
        }
    }
}

export const fetchAllDoctor = () => {
    return async(dispatch,getState) => {
        try {
            let res = await getAllDoctorService();
            if(res &&res.errCode ===0){
                dispatch({
                    type:actionTypes.FETCH_ALL_DOCTOR_SUCCESS,
                    dataDr:res.data
                })
            }else{
                dispatch({
                    type:actionTypes.FETCH_ALL_DOCTOR_FAILED
                })
            }
        } catch (error) {
            console.log(error);
            dispatch({
                type:actionTypes.FETCH_ALL_DOCTOR_FAILED
            })
        }
    }
}

export const saveDetailDoctor = (data) => {
    return async(dispatch,getState) => {
        try {
            let res = await saveDetailDoctorService(data);
            if(res &&res.errCode ===0){
                toast.success('🦄 Update infor success!',{theme:"light",type:"default"});
                dispatch({
                    type:actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
                })
            }else{
                toast.error('🦄 Update infor error!',{theme:"light",type:"default"});
                dispatch({
                    type:actionTypes.SAVE_DETAIL_DOCTOR_FAILED
                })
            }
        } catch (error) {
            console.log(error);
            dispatch({
                type:actionTypes.SAVE_DETAIL_DOCTOR_FAILED
            })
        }
    }
}

export const fetchAllScheduleTime = () => {
    return async(dispatch,getState) => {
        try {
            let res = await getAllCodeService('TIME');
            if(res &&res.errCode ===0){
                dispatch({
                    type:actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime:res.data
                })
            }else{
                dispatch({
                    type:actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED
                })
            }
        } catch (error) {
            console.log(error);
            dispatch({
                type:actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED
            })
        }
    }
}

export const getRequiredDoctorInfor = () => {
    return async(dispatch,getState) => {
        try {
            dispatch({
                type:actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_START
            })
            let resPrice = await getAllCodeService("PRICE");
            let resPayment = await getAllCodeService("PAYMENT");
            let resProvince = await getAllCodeService("PROVINCE");
            let resSpecialty = await getAllSpecialty();
            let resClinic = await getAllClinic();
            if(resPrice && resPrice.errCode === 0
                && resPayment && resPayment.errCode ===0
                && resProvince && resProvince.errCode === 0 
                && resSpecialty && resSpecialty.errCode ===0
                && resClinic && resClinic.errCode ===0){
                    let data = {
                        resPrice: resPrice.data,
                        resPayment: resPayment.data,
                        resProvince: resProvince.data,
                        resSpecialty : resSpecialty.data,
                        resClinic: resClinic.data
                    }
                    //console.log(data);
                dispatch(fetchRequiredDoctorInforSuccess(data));
            }else{
                dispatch(fetchRequiredDoctorInforFailed());
            }
        } catch (error) {
            dispatch(fetchRequiredDoctorInforFailed());
        }
    }
}

export const fetchRequiredDoctorInforSuccess = (allRequiredData) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
    data: allRequiredData
})

export const fetchRequiredDoctorInforFailed = () => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED
})