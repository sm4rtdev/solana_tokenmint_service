import axios from "axios"

export const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const res = await axios.post(`/api/auth/register`, {
        name,
        email,
        password
    })
    return res.data.ok;
}

export const login = async (email: string, password: string): Promise<{ ok: boolean, token: string, name: string, avatar: string, message: string }> => {
    const res = await axios.post(`/api/auth/login`, {
        email,
        password
    })
    return res.data;
}

export const changePassword = async (password: string, oldPassword: string): Promise<boolean> => {
    try {
        const res = await axios.post(`/api/auth/change-password`, {
            password,
            oldPassword
        }, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
        if (res.data.ok) {
            localStorage.setItem("token", res.data.token);
            return true;
        }
        return false;
    } catch (e) {
        location.href = '/auth/signin';
        return false;
    }
}

export const updateUser = async (name: string, avatar: string): Promise<boolean> => {
    try {
        const res = await axios.put(`/api/users`, {
            name,
            avatar
        }, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
        if (res.data.ok) {
            localStorage.setItem("token", res.data.token);
            return true;
        }
        return false;
    } catch (e) {
        location.href = '/auth/signin';
        return false;
    }
}

export const validate_token = async (): Promise<{ email: string, name: string, avatar: string } | null> => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.post('/api/auth/validate-token', {}, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        if (res.data.ok) {
            localStorage.setItem("token", res.data.token);
            return res.data;
        }
        return null
    } catch (error) {
        location.href = '/auth/signin';
        return null;
    }
}

export const uploadFile = async (file: File, filename: string, type: string = "image/png", folder: string = "avatar"): Promise<string> => {
    const formData = new FormData();
    formData.append("filename", filename);
    formData.append("type", type);
    formData.append("path", folder);
    formData.append("file", file);
    const res = await axios.post(`/api/file`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return res.data.url;
}

export const removeFile = async (link: string): Promise<boolean> => {
    const res = await axios.delete(`/api/file?publicUrl=${link}`);
    return res.data.ok;
}

export const getTokenList = async (page: number = 1, size: number = 10, email?: string, devnet: boolean = false): Promise<any[] | null> => {
    const res = await axios.get(`/api/tokens?page=${page}&size=${size}${email ? "&user=" + email : ""}${devnet ? "&devnet" : ""}`)
    return res.data;
}

export const getTokenTotalNumber = async (email?: string, devnet: boolean = false): Promise<number> => {
    const res = await axios.get(`/api/tokens/total-number?${email ? "&user=" + email : ""}${devnet ? "&devnet" : ""}`)
    return res.data;
}

export const getMyTokens = async (page: number = 1, size: number = 10, devnet: boolean = false): Promise<any[] | null> => {
    try {
        const res = await axios.get(`/api/tokens/my-tokens?page=${page}&size=${size}${devnet ? "&devnet" : ""}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
        return res.data;
    } catch (error) {
        location.href = "/auth/signin";
        return null;
    }
}

export const getMyTokensTotalNumber = async (devnet: boolean = false): Promise<any[] | null> => {
    try {
        const res = await axios.get(`/api/tokens/my-tokens/number?${devnet ? "&devnet" : ""}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
        return res.data;
    } catch (error) {
        location.href = "/auth/signin";
        return null;
    }
}

export const saveToken = async (address: string, name: string, symbol: string, description: string, url: string, supply: number, decimals: number, devnet: boolean = false): Promise<boolean> => {
    const res = await axios.post(`/api/tokens${devnet ? "?devnet" : ""}`, {
        address,
        name,
        symbol,
        description,
        url,
        supply,
        decimals
    }, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
    return res.data.ok;
}