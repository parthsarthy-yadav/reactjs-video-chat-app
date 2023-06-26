import { callStates, setCallState, setCallerUsername, setCallingDialogVisible, setLocalStream } from "../../redux/Call/actions";
import store from "../../redux/store";
import { sendPreOffer } from "../WssConnection/wssConnection";

const defaultConstraints = {
    video: true,
    audio: true
};

export const getLocalStream = ()=>{
    navigator.mediaDevices.getUserMedia(defaultConstraints)
    .then(stream => {
        store.dispatch(setLocalStream(stream));
        store.dispatch(setCallState(callStates.CALL_AVAILABLE));
    })
    .catch(err => {
        console.log(err.message);
    });
};

let connectedUserSocketId = null;
export const callToOtherUser = (calleeDetails)=> {
    connectedUserSocketId = calleeDetails.socketId;
    store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
    store.dispatch(setCallingDialogVisible(true));
    sendPreOffer({
        callee: calleeDetails,
        caller: {
            username: store.getState().dashboard.username,
        }
    });
};

export const handlePreOffer = (data)=>{
    connectedUserSocketId = data.callerSocketId;
    store.dispatch(setCallerUsername(data.callerUsername));
    store.dispatch(setCallState(callStates.CALL_REQUESTED));
};