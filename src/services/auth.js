
export const isLogin = async () => {
    if (localStorage.getItem('token')) return true;
    return false;
}

export const authHeader = () => {
    if (typeof window === 'undefined') {
        // Server side pe ho, localStorage available nahi
        return {};
    }
    const token = localStorage.getItem('token');

    if (token) {
        return { Authorization: 'Bearer ' + token };
    } else {
        return {};
    }
};

