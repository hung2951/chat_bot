import axios from "axios"
export const config = axios.create({
    baseURL:"https://demo-onetouch-chat-api-h5gp4ab26q-uc.a.run.app"
})
export const Demo = (value)=>{
    return config.post('/answer',value)
}