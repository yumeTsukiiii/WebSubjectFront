const errorMap = {
    "-2": '密码错误',
    "-3": '该用户不存在',
    '-4': '登录已过期',
    "-5": '数据库出错',
    "-10": '无过往病历',
    "-9": '无收费信息',
    "-11": '验证码错误'
};

export function handleResponse(resp) {
    return new Promise(((resolve, reject) => {
        Boolean(resp.data).yes(() => {
            if (resp.data.status === 0) {
                resolve(resp.data.data);
            } else {
                reject(resp.data)
            }
        }).otherwise(() => {
            reject(resp)
        })
    }));
}

export function handleNetCodeMessage(data, handler) {
    handler(!data ? "服务器暂时无法处理您的请求" : errorMap[`${data.status}`], data.status)
}