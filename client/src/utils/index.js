import axios from 'axios';

const API_URL = 'http://localhost:8800/api-v1';

export const API = axios.create({
    baseURL: API_URL,
    responseType: 'json',
});

export const apiRequest = async ({ url, token, data, method = 'GET' }) => {
    try {
        const result = await API(url, {
            method,
            data,
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
        });

        return result?.data;
    } catch (error) {
        const err = error.response ? error.response.data : { message: error.message, success: false };
        console.error('API request error:', error);
        return {
            status: err.success,
            message: err.message,
        };
    }
};

export const handleFileUpload = async (uploadFile) => {
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('upload_preset', 'jobBoard');

    try {
        const response = await axios.post(
            process.env.CLOUDINALRY_URL,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        console.log('File uploaded successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('File upload error:', error.response ? error.response.data : error.message);
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

    if (pageNum && pageNum > 1) params.set('page', pageNum);
    if (query) params.set('search', query);
    if (cmpLoc) params.set('location', cmpLoc);
    if (sort) params.set('sort', sort);
    if (jType) params.set('jtype', jType);
    if (exp) params.set('exp', exp);

    const newURL = `${location.pathname}?${params.toString()}`;
    navigate(newURL, { replace: true });

    return newURL;
};
