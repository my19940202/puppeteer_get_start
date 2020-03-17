// 载入puppeteer
const puppeteer = require('puppeteer');

async function main() {
    for (let index = 0; index < 40; index++) {
        let ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1';
        let url = 'https://file00e650b5c015.aiwall.com/v3/idea/KxT3tMob?scene=1&clicktime=1583631336&enterid=1583631336&from=groupmessage&isappinstalled=0&suid=6A3332B8-563F-475D-8D7C-D295EC3B7F25&sl=2'
        await pageVote(ua, url);
        await sleep(1000);
    }
}
main();

// puppeteer

async function pageVote(ua, url) {
    const browser = await puppeteer.launch({headless: true});
    // .then(async browser => {
    // 打开一个页面
    const page = await browser.newPage();
    // 打开
    await page.setUserAgent(ua);
    await page.setViewport({
        width: 375, height: 812
    });
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    await sleep(2000);

    // update cookie 
    // 1 进到排行榜
    await page.tap('.pt-page.pt-loaded-page.pt-page-current img:nth-child(3)');
    // 搜索投票对象 输入id
    await sleep(1000);
    await page.type('.pt-page.pt-loaded-page.pt-page-current input[type="password"]', '3045558', {delay: 20});
    await sleep(500);
    await page.tap('.pt-page.pt-loaded-page.pt-page-current input[type="password"] + div');
    await sleep(500);
    const imgs = await page.$$('.pt-page.pt-loaded-page.pt-page-current img');
    for (let idx = 0; idx < imgs.length; idx++) {
        const item = imgs[idx];
        if (item) {
            const style = await page.evaluate(
                (dom) => {
                    if (dom && dom.style) {
                        const {width, height} = dom.style;
                        return {width, height};
                    }
                },
                item
            );
            if (style && style.width === '74px' && style.height === '73px') {
                ret = true;
                item.click();
                break;
            }
        }
    }
    // 在页面中执行 实际log打印在chrome控制台里
    // await page.evaluate(() => {
    //     console.log('this is evaluate');
    //     document.querySelectorAll('.pt-page.pt-loaded-page.pt-page-current img')[12].click();
    // });
    // console.log('click done');
    // await sear
    // 关闭浏览器
    const cookies = await page.cookies();
    await page.deleteCookie(...cookies);
    // TODO 更新页面vx.appid
    const appidKey = 'vx.appid';
    let newPppidValue = '';
    let oldPppidValue = '';
    // let cookiesNameList = [];
    cookies.map(({name, value}) => {
        if (name === appidKey) {
            oldPppidValue = value;
            newPppidValue = radomAppid(value);
        }
    });
    // await page.deleteCookie({
    //     name: 'vx.appid',
    //     value: oldPppidValue
    // });
    await page.setCookie({
        name: 'vx.appid',
        value: newPppidValue,
        expires: Math.round(+new Date() / 1000) + 10000 * 1000
    });
    await page.setCookie({
        name: newPppidValue + '.id',
        value: radomTime(),
        expires: Math.round(+new Date() / 1000) +  10000 * 1000
    });
    await sleep(1000);
    await browser.close();
}

function radomAppid(oldValue) {
    const subfix = Math.round(Math.random() * 1000000).toString(32);
    const oldValueLen = oldValue.length;
    return oldValue.slice(0, oldValueLen - subfix.length) + subfix;
}

function radomTime() {
    const subfix = Math.round(Math.random() * 100000);
    return `20200309204541-${1211900000 + subfix}-525`;
}

function sleep(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(1);
            } catch (e) {
                reject(0);
            }
        }, delay);
    });
}