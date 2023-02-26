import axios from "axios";


export default function myAxios(){
  return axios.create({
    headers:{
      'auth':localStorage.auth
    }
  })
}