// import axios from 'axios';

// export const API = axios.create({
//     baseURL: 'http://localhost:8800/api-v1', // Ensure the baseURL is correct
//     responseType: 'json',
// });

// export const apiRequest = async ({ url, token, data, method = 'GET' }) => {
//     try {
//         const result = await API(url, {
//             method,
//             data,
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: token ? `Bearer ${token}` : '',
//             },
//         });

//         return result?.data;
//     } catch (error) {
//         const err = error.response?.data || { message: error.message, success: false };
//         console.error('API request error:', error); // Log the complete error for debugging
//         return {
//             status: err.success,
//             message: err.message,
//         };
//     }
// };

import axios from 'axios';
const API_URL = `http://localhost:8800/api-v1`;

export const API = axios.create({
    baseURL: API_URL,
    responseType: 'json',
});
export const apiRequest = async ({ url, token, data, method, }) => {
    try {
        const result = await API(url, {
            method: method || "GET",
            data: data,
            headers: {
                "content-type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            }
        });

        return result?.data;
    } catch (error) {
        const err = error.response.data;
        console.log(error);
        return {
            status: err.success,
            message: err.message
        };
    }
};

// Axios instance configuration
// export const API = axios.create({
//     baseURL: API_URL,
//     responseType: 'json',
// });

// // API request function
// export const apiRequest = async ({ url, token = '', data = {}, method = 'GET' }) => {
//     try {
//         const result = await API(url, {
//             method,
//             data,
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: token ? `Bearer ${token}` : '',
//             },
//         });

//         return result?.data;
//     } catch (error) {
//         // Check if error.response exists to avoid runtime errors
//         const err = error.response ? error.response.data : { message: error.message, success: false };
//         console.error('API request error:', error);  // Log the complete error for debugging
//         return {
//             status: err.success,
//             message: err.message,
//         };
//     }
// };

// export const handleFileUpload = async (uploadFile) => {
//     const formData = new FormData();
//     formData.append("file", uploadFile);
//     formData.append("upload_preset", "jobBoard");

//     try {
//         const response = await axios.post(
//             "https://api.cloudinary.com/v1_1/dvyaik2aa/image/upload/",
//             formData
//         )
//     } catch (error) {
//         console.log(error);
//     }
// };
export const handleFileUpload = async (uploadFile) => {
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("upload_preset", "jobBoard");

    try {
        const response = await axios.post(
            'https://api.cloudinary.com/v1_1/dvyaik2aa/image/upload',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        console.log("File uploaded successfully:", response.data);
        return response.data; // Return response data for further use if needed
    } catch (error) {
        console.error("File upload error:", error.response ? error.response.data : error.message);
    }
};
export const updateURL = ({
    pageNum,
    query,
    cmpLoc,
    sort,
    navigate,
    location,
    jType,
    exp,
}) => {
    const params = new URLSearchParams();
    if (pageNum && pageNum > 1) {
        params.set('page', pageNum);
    }
    if (query) {
        params.set('search', query);
    }
    if (cmpLoc) {
        params.set('location', cmpLoc);
    }
    if (sort) {
        params.set('sort', sort);
    }
    if (jType) {
        params.set('jtype', jType);
    }
    if (exp) {
        params.set('exp', exp);
    }
    // const paramsArray = [
    //     { key: 'page', value: pageNum && pageNum > 1 ? pageNum : null },
    //     { key: 'search', value: query },
    //     { key: 'location', value: cmpLoc },
    //     { key: 'sort', value: sort },
    //     { key: 'jtype', value: jType },
    //     { key: 'exp', value: exp }
    // ];

    // paramsArray.forEach(param => {
    //     if (param.value) {
    //         params.set(param.key, param.value);
    //     }
    // });

    const newURL = `${location.pathname}?${params.toString()}`;
    navigate(newURL, { replace: true });

    return newURL;

};