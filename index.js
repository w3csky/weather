const http = require('http');
const https = require('https');
//const Redis=require('ioredis');
//const redis=new Redis();
//获取url请求客户端ip
const getClientIP = (req) => {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0]
    }
    return ip.substr(7);
};

let getCityByIP = (IP, next) => {
    const ipOptions = {
        host: 'freeapi.ipip.net',
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2824.0 Safari/537.36',
        }
    }
    ipOptions.path = '/' + IP;
    let data = '';
    let searchIp = http.request(ipOptions, (res) => {
        res.on('data', (chunk) => {
            data += chunk;
            console.log('Wait for response....')
        });
        res.on('end', () => {
            console.log(data);
            next && next(data);
        });
    }).on('error', (e) => {
        console.error(e);
    });
    searchIp.end();
};

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
        // 响应文件内容
        res.write('IP定位测试:\n');
        //获取用户ip
        var ip = getClientIP(req);
        //console.log(ip);

        var _POSITION = '';
        getCityByIP(ip, (data) => {
            _POSITION = data;
            //定位
            res.write(_POSITION);

            res.end();
        });

    }
});
console.log('listen to 3006')
server.listen(3006);

/*
var weatherOpt={
	host:'api.heweather.com/',
	method:'GET'
};
weatherOpt.path='x3/weather?cityid=CN101010100&key=ae7528a2ee9c48b78ba7a3dc366568a1';
const req=https.request(weatherOpt, function(res){
	var Buff=" ";
	res.on('data', function (data){
		Buff+=data;
	});
	res.on('end',function(){
	  //给JSON字符串首尾添加空格，确保能存入redis，又能被JSON.parse();
	  Buff+=" ";
	  redis.set('beijing',Buff,function(err,result){
		  console.log(result);
	  });
	});
}).on('error', function(e){
  console.error(e);
});
*/
