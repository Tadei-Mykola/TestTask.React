

export class LocalStorageService {
    setAccessToken(token) {
        localStorage.setItem('accessToken', token);
    }

    getAccessToken() {
        return localStorage.getItem('accessToken');
    }

    removeUser() {
        localStorage.removeItem('userData');
        localStorage.removeItem('accessToken');
    }
}