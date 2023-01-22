// 导入模块
const request = require('request');

async function getTrueUrl(url) {
    let aweme_id = await new Promise((resolve) => {
        request({ url, method: 'HEAD' }, function (e, response) {
            if (!e && response.statusCode == 200) {
                resolve(response.req.path.split('/')[3]);  // aweme_id
            } else {
                console.error(e);
            }
        });
    });

    let video_id = await new Promise((resolve) => {
        request('https://www.iesdouyin.com/aweme/v1/web/aweme/detail/?aweme_id=' + aweme_id, function (e, response, body) {
            if (!e && response.statusCode == 200) {
                resolve(JSON.parse(body)['aweme_detail']['video']['bit_rate'][0]['play_addr']['uri']);
            } else {
                console.error(e);
            }
        });
    });

    let downloadUrl = `https://aweme.snssdk.com/aweme/v1/play/?video_id=${video_id}&ratio=1080p&line=0`;  // 可直接下载
    console.log(downloadUrl);

    let trueUrl = await new Promise((resolve) => {
        let options = {
            url: downloadUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0'
            }
        };
        request(options, function (e, response, body) {
            if (!e && response.statusCode == 200) {
                resolve(response.req.res.request.href);
                // 此时响应体已包含视频，可直接另存为
                // ...
            } else {
                console.error(e);
            }
        });
    });
    console.log(trueUrl);
}

let url = 'https://v.douyin.com/k9XC8F4/';
getTrueUrl(url);
