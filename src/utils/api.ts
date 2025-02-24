import axios from "axios"

export const register = async (name:string, email:string, password:string, avatar:string): Promise<boolean> => {
    const res = await axios.post(`/api/users?register`, {
        name,
        email,
        password,
        avatar
    })
    return res.data.ok;
}

export const login = async (email: string, password: string): Promise<boolean> => {
    const res = await axios.post(`/api/users?login`, {
        email,
        password
    })
    return res.data.ok;
}

export const changePassword = async (email: string, password: string, oldPassword: string): Promise<boolean> => {
    const res = await axios.post(`/api/users?reset`, {
        email,
        password,
        oldPassword
    })
    return res.data.ok;
}

export const uploadFile = async (file: File, folder: string = "avatar"): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(`/api/file?folder=${folder}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return res.data.publicUrl;
}

export const removeFile = async (link: string): Promise<boolean> => {
    const res = await axios.delete(`/api/file?publicUrl=${link}`);
    return res.data.ok;
}

export const getTokenList = async (page: number = 1, size: number = 10, email?: string) : Promise<any[]> => {
    const res = await axios.get(`/api/tokens?page=${page}&size=${size}${email?"&user=" + email:""}`)
    return res.data;
}