var child_process = require('child_process');

const execute = (command) => new Promise(async (resolve, reject) => {
    try {
        let res = await child_process.execSync(command)
        resolve(res.toString())
    } catch (error) {
        reject(error)
    }
})

const connectW2C = async (port, subDomainName, IP) => new Promise(async (resolve, reject) => {
    try {
        var commandConnectW2C = `echo """server {

	server_name ${subDomainName}.cloudgpu.net www.${subDomainName}.cloudgpu.net;

        location / {
			proxy_pass http://${IP}:${port};
                        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
                        proxy_set_header X-Real-IP \\$remote_addr;
                        proxy_set_header Host \\$http_host;
                        proxy_http_version 1.1;
                        proxy_redirect off;
                        proxy_buffering off;
                        proxy_set_header Upgrade \\$http_upgrade;
                        proxy_set_header Connection upgrade;
                        proxy_read_timeout 86400;
                }
        listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/cloudgpu.net/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/cloudgpu.net/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if (\\$host = ${subDomainName}.cloudgpu.net) {
        return 301 https://\\$host\\$request_uri;
    } # managed by Certbot

        listen 80;

	server_name ${subDomainName}.cloudgpu.net;
    return 404; # managed by Certbot
}""" > ${subDomainName}; mv ${subDomainName} /etc/nginx/sites-available/; ln -s /etc/nginx/sites-available/${subDomainName} /etc/nginx/sites-enabled/${subDomainName}; sudo service nginx reload;`
        await execute(commandConnectW2C)
        resolve()
    } catch {
        reject()
    }
})

module.exports = connectW2C;
