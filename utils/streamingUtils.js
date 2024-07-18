const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');
const proxyChain = require('proxy-chain');
require('dotenv').config();

const getRandomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const streamSpotify = async (page, url) => {
    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForSelector('button[aria-label="Play"]');
        await page.click('button[aria-label="Play"]');
        const playTime = getRandomDelay(300000, 3600000);
        await page.waitForTimeout(playTime);
        await page.click('button[aria-label="Play"]');
    } catch (error) {
        console.error('Spotify streaming error:', error);
    }
};

const streamYouTube = async (page, url) => {
    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForSelector('button[aria-label="Play"]');
        await page.click('button[aria-label="Play"]');
        const playTime = getRandomDelay(300000, 3600000);
        await page.waitForTimeout(playTime);
        await page.click('button[aria-label="Pause (k)"]');
    } catch (error) {
        console.error('YouTube streaming error:', error);
    }
};

const streamAppleMusic = async (page, url) => {
    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForSelector('.playback-controls__play');
        await page.click('.playback-controls__play');
        const playTime = getRandomDelay(300000, 3600000);
        await page.waitForTimeout(playTime);
        await page.click('.playback-controls__pause');
    } catch (error) {
        console.error('Apple Music streaming error:', error);
    }
};

const startStreaming = async (task) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    });

    const page = await browser.newPage();
    const userAgent = randomUseragent.getRandom();
    await page.setUserAgent(userAgent);

    const proxyUrl = process.env.PROXY_URL;
    const newProxyUrl = await proxyChain.anonymizeProxy(proxyUrl);

    try {
        await page.authenticate({
            username: process.env.PROXY_USERNAME,
            password: process.env.PROXY_PASSWORD
        });

        if (task.platform === 'spotify') {
            await streamSpotify(page, task.url);
        } else if (task.platform === 'youtube') {
            await streamYouTube(page, task.url);
        } else if (task.platform === 'applemusic') {
            await streamAppleMusic(page, task.url);
        } else {
            throw new Error('Unsupported platform');
        }
    } catch (error) {
        console.error('Streaming error:', error);
    } finally {
        await browser.close();
        await proxyChain.closeAnonymizedProxy(newProxyUrl, true);
    }
};

module.exports = { startStreaming };
