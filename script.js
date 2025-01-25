'use strict';

// 防止 XSS 的辅助函数
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// RSS Feed 解析和文章加载
async function loadArticles() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

        const response = await fetch('https://blog.httpsguo.cn/wp-json/wp/v2/posts?per_page=5&_embed', {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const articles = await response.json();
        
        // 使用 DocumentFragment 优化 DOM 操作
        const latestList = document.querySelector('.latest-articles .article-list');
        const fragment = document.createDocumentFragment();
        
        articles.forEach(article => {
            const articleElement = createArticleElement({
                title: sanitizeHTML(article.title.rendered),
                link: article.link,
                date: new Date(article.date)
            });
            fragment.appendChild(articleElement);
        });
        
        latestList.appendChild(fragment);

        // 热门文章数据（手动设置）
        const popularArticles = [
            {
                title: "最新迅雷NAS版邀请码分享（长期分享，每月5枚）",
                link: "https://blog.httpsguo.cn/120.html",
                date: new Date("2024-12-16")
            },
            {
                title: "《2025年未来就业报告》：技术变革与技能升级重塑全球劳动力市场",
                link: "https://blog.httpsguo.cn/227.html",
                date: new Date("2025-01-22")
            },
            {
                title: "WPS单位定制版永久激活附下载地址",
                link: "https://blog.httpsguo.cn/108.html",
                date: new Date("2024-12-04")
            },
            {
                title: "强烈推荐一个可以下载中文教科书的网站",
                link: "https://blog.httpsguo.cn/71.html",
                date: new Date("2024-11-08")
            },
            {
                title: "在宝塔面板搭建一个漂亮的个人导航网页-SunPanel",
                link: "https://blog.httpsguo.cn/35.html",
                date: new Date("2024-10-24")
            }
        ];

        // 填充热门文章
        const popularList = document.querySelector('.popular-articles .article-list');
        popularArticles.forEach(article => {
            const articleElement = createArticleElement(article);
            popularList.appendChild(articleElement);
        });
    } catch (error) {
        console.error('加载文章失败:', error);
        // 显示友好的错误信息
        showErrorMessage('文章加载失败，请稍后重试');
    }
}

function createArticleElement(article) {
    const div = document.createElement('div');
    div.className = 'article-item';
    
    // 解码 HTML 实体
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = article.title;
    const decodedTitle = tempDiv.textContent;

    div.innerHTML = `
        <a href="${article.link}" target="_blank">${decodedTitle}</a>
        <span class="article-date">${article.date.toLocaleDateString('zh-CN')}</span>
    `;
    return div;
}

// 修改社交媒体图标点击处理
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('click', function(e) {
        const type = this.dataset.type;
        
        // 对于 telegram 和 github，在新窗口打开
        if (type === 'telegram' || type === 'github') {
            e.preventDefault(); // 阻止默认行为
            window.open(this.href, '_blank'); // 在新窗口打开链接
            return;
        }
        
        // 对于需要显示二维码的图标
        e.preventDefault();
        if (type === 'wechat' || type === 'qq' || type === 'douyin') {
            const qrUrl = this.dataset.qr;
            if (qrUrl) {
                const modal = document.getElementById('qrModal');
                const qrImage = document.getElementById('qrImage');
                qrImage.src = qrUrl;
                modal.style.display = 'block';
            }
        }
    });
});

// 关闭二维码弹窗
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('qrModal').style.display = 'none';
});

// 点击弹窗外部关闭
window.addEventListener('click', function(event) {
    const modal = document.getElementById('qrModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// 添加新年祝福生成器代码
const p1 = ['xīn', 'gōng', 'dà', 'wàn', 'nián', 'shēn', 'xīn', 'gōng'];
const p2 = ['nián', 'xǐ', 'jí', 'shì', 'nián', 'tǐ', 'xiǎng', 'hè'];
const p3 = ['kuài', 'fā', 'dà', 'rú', 'yǒu', 'jiàn', 'shì', 'xīn'];
const p4 = ['lè', 'cái', 'lì', 'yì', 'yú', 'kāng', 'chéng', 'xǐ'];
const phrasesC1 = ['新', '恭', '大', '萬', '年', '身', '心', '恭'];
const phrasesC2 = ['年', '喜', '吉', '事', '年', '體', '想', '賀'];
const phrasesC3 = ['快', '發', '大', '如', '有', '健', '事', '新'];
const phrasesC4 = ['樂', '財', '利', '意', '餘', '康', '成', '禧'];
const phrasesE = [
    '(Happy new year)',
    '(Congratulations on your prosperity)',
    '(Great luck and prosperity)',
    '(May 10,000 things go according to your wishes)',
    '(Every year have more than you need)',
    '(Wishing you good health)',
    "(May all your heart's desires come true)",
    '(Congratulations in the new year)',
];

function updatePhrase() {
    const random = Math.random();
    const index = Math.floor(random * p1.length);
    
    document.getElementById('pinyin1').textContent = p1[index];
    document.getElementById('pinyin2').textContent = p2[index];
    document.getElementById('pinyin3').textContent = p3[index];
    document.getElementById('pinyin4').textContent = p4[index];
    
    document.getElementById('phraseChinese1').textContent = phrasesC1[index];
    document.getElementById('phraseChinese2').textContent = phrasesC2[index];
    document.getElementById('phraseChinese3').textContent = phrasesC3[index];
    document.getElementById('phraseChinese4').textContent = phrasesC4[index];
    
    document.getElementById('phraseEnglish').textContent = phrasesE[index];
}

// 初始化新年祝福
document.addEventListener('DOMContentLoaded', () => {
    updatePhrase();
    document.getElementById('button').addEventListener('click', updatePhrase);
});

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadArticles);

// 替换原有时钟函数
let hrs = document.querySelector('#hrs');
let sec = document.querySelector('#sec');
let min = document.querySelector('#min');

setInterval(() => {
    let day = new Date();
    let hh = day.getHours() * 30;
    let mm = day.getMinutes() * 6;
    let ss = day.getSeconds() * 6;

    hrs.style.transform = `rotateZ(${hh + mm / 12}deg)`;
    min.style.transform = `rotateZ(${mm}deg)`;
    sec.style.transform = `rotateZ(${ss}deg)`;
});

// 数字时钟
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    document.getElementById('hours').textContent = formatTime(hours % 12 || 12);
    document.getElementById('minuts').textContent = formatTime(minutes);
    document.getElementById('seconds').textContent = formatTime(seconds);
    document.getElementById('ampm').textContent = ampm;
}

function formatTime(time) {
    return time < 10 ? '0' + time : time;
}

setInterval(updateClock, 1000);
updateClock();

// 错误提示函数
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.latest-articles .article-list').appendChild(errorDiv);
}

// 主题切换功能
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // 获取保存的主题
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    
    // 设置正确的图标
    const icon = themeToggle.querySelector('i');
    icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    // 添加点击事件
    themeToggle.onclick = function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    };
}

// 确保在页面加载完成后初始化主题
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}

// 修改联系信息显示函数
function showContactInfo(text) {
    const infoDiv = document.getElementById('contactInfo');
    infoDiv.textContent = text;
    infoDiv.classList.add('show');
    
    // 3秒后隐藏信息
    setTimeout(() => {
        infoDiv.classList.remove('show');
    }, 3000);
}

// 修改处理联系方式点击函数
function handleContact(id) {
    switch(id) {
        case '1': // 微信
            showContactInfo('微信二维码');
            showQRCode('http://blog.httpsguo.cn/wp-content/uploads/2024/10/cropped-11.png', '微信二维码');
            break;
        case '2': // QQ
            showContactInfo('QQ二维码');
            showQRCode('http://blog.httpsguo.cn/wp-content/uploads/2024/10/cropped-11.png', 'QQ二维码');
            break;
        case '3': // 抖音
            showContactInfo('抖音二维码');
            showQRCode('http://blog.httpsguo.cn/wp-content/uploads/2024/10/cropped-11.png', '抖音二维码');
            break;
        case '4': // 邮箱
            showContactInfo('邮箱：httpsguo@163.com');
            break;
        case '5': // Telegram
            showContactInfo('正在跳转到 Telegram...');
        window.open('https://t.me/httpsguo', '_blank');
            break;
        case '6': // GitHub
            showContactInfo('正在跳转到 GitHub...');
        window.open('https://github.com/HttpsGuo', '_blank');
            break;
    }
}

// 修改二维码显示函数
function showQRCode(qrUrl, title) {
    // 移除已存在的二维码模态框
    const existingModal = document.querySelector('.qr-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'qr-modal';
    
    modal.innerHTML = `
        <div class="qr-content">
            <h3>${title}</h3>
            <img src="${qrUrl}" alt="${title}">
        </div>
    `;
    
    // 将模态框添加到 body
    document.body.appendChild(modal);
    
    // 显示模态框
    requestAnimationFrame(() => {
        modal.style.display = 'flex';
    });
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
        }
    });
}

// 初始化联系方式
document.addEventListener('DOMContentLoaded', () => {
    // 显示所有图标
    document.querySelectorAll('.bubble .icon').forEach(icon => {
        icon.style.opacity = '0.7';
    });
});