import toast from "react-hot-toast";


export const notify = {

success(message){

toast.success(message);

},


error(message){

toast.error(message);

},


loading(message){

return toast.loading(message);

},


dismiss(){

toast.dismiss();

}

};
