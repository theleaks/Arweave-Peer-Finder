const http = require('http')
const request = require('request');
const fs = require('fs');
var total = 0
const check = (ip, port) => {
    const options = {
        hostname: ip,
        port: port,
        path: '/chunk/1',
        method: 'GET'
    }
    const req = http.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

        if (res.statusCode == 200) {
            fs.appendFile('workingPeerList.txt',`${options.hostname}:${options.port} peer `, function (err) {
                if (err) throw err;
                total++
                console.log(`Saved!  Total: ${total}`);

            });

        }
    })

    req.on('error', error => {
        console.error("BAD IP")
    })

    req.end()

}
(() => {
    const options = {
        url: 'http://arweave.net/peers',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            'User-Agent': 'my-ua'
        }
    };

    request(options, function (err, res, body) {
        let list = JSON.parse(body);
        console.log(list.length)
        fs.writeFile('peerList.json', body, function (err) {
            if (err) throw err;
            console.log('Liste çekildi!');
            for (let i = 1; i < list.length; i++) {
                const e = list[i].split(":")
                check(e[0], e[1])
            }
        });
    });


})();



