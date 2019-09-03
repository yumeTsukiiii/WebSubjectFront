function login({ username, password }) {
    return Promise.resolve({
        identity: '收费员'
    })
}

function logout() {
    return Promise.resolve({
        msg: '登出成功'
    })
}

export default {
    login, logout
}