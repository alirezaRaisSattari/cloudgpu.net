const axios = require('axios');

let config = {
    headers: {
        Authorization: "Apikey 5d71a5c3-51bb-5f0c-a0bf-e827779b56b9",
    }
}

const request = (data) => new Promise((resolve, reject) => {
    axios.post(`https://napi.arvancloud.com/cdn/4.0/domains/cloudgpu.net/dns-records`, data, config)
        .then(res => {
            resolve(res)
        })
        .catch(error => {
            console.log(error);
            reject(error)
        });
});
module.exports = request
