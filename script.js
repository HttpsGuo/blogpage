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
        const latestList = document.querySelector('.latest-articles .article-list');
        const spinner = document.createElement('div');
        spinner.className = 'loading';
        spinner.textContent = '加载中...';
        latestList.appendChild(spinner);

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
        
        // 移除加载动画
        latestList.innerHTML = '';
        
        // 使用 DocumentFragment 优化 DOM 操作
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
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('data-id');
            handleContact(id);
        });
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

// 添加 GSAP 动画初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化 GSAP 动画
    gsap.to("#bongo-cat", {
        duration: 0.5,
        opacity: 1,
        y: 0,
        ease: "power2.out"
    });

    const pawRight = document.querySelector('.paw-right');
    const keyboardHand = document.querySelector('.keyboard-hand');
    
    // 初始化 GSAP 动画
    gsap.to(pawRight, {
        y: -20,
        duration: 0.25,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
    
    gsap.to(keyboardHand, {
        y: -20,
        duration: 0.25,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 0.1
    });
});

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadArticles);

// 替换原有时钟函数
let hrs = document.querySelector('#hrs');
let min = document.querySelector('#min');
let sec = document.querySelector('#sec');

function updateClockHands() {
    let day = new Date();
    let hh = day.getHours() * 30;
    let mm = day.getMinutes() * 6;
    let ss = day.getSeconds() * 6;

    hrs.style.transform = `rotateZ(${hh + mm / 12}deg)`;
    min.style.transform = `rotateZ(${mm}deg)`;
    sec.style.transform = `rotateZ(${ss}deg)`;

    requestAnimationFrame(updateClockHands);
}
updateClockHands();

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
            showQRCode('https://blog.httpsguo.cn/wp-content/uploads/2025/02/WeChat.png', '微信二维码');
            break;
        case '2': // QQ
            showContactInfo('QQ二维码');
            showQRCode('https://blog.httpsguo.cn/wp-content/uploads/2025/02/QQ.png', 'QQ二维码');
            break;
        case '3': // 抖音
            showContactInfo('抖音二维码');
            showQRCode('https://blog.httpsguo.cn/wp-content/uploads/2025/02/tiktok.png', '抖音二维码');
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
    const modal = document.getElementById('qrModal');
    const qrImage = document.getElementById('qrImage');
    const modalTitle = document.querySelector('#qrModal .modal-title');
    
    if (modal && qrImage) {
        modalTitle.textContent = title;
        qrImage.src = qrUrl;
        modal.style.display = 'block';
        
        // 添加图片加载错误处理
        qrImage.onerror = function() {
            console.error('二维码图片加载失败:', qrUrl);
            showContactInfo('二维码图片加载失败，请检查图片路径');
        };
        
        // 添加图片加载成功处理
        qrImage.onload = function() {
            console.log('二维码图片加载成功:', qrUrl);
        };
    } else {
        console.error('找不到二维码模态框或图片元素');
        showContactInfo('二维码显示出错，请刷新页面重试');
    }
}

// 确保关闭按钮事件监听器正确添加
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.querySelector('#qrModal .close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('qrModal').style.display = 'none';
        });
    }
    
    // 点击模态框外部关闭
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('qrModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// 初始化联系方式
document.addEventListener('DOMContentLoaded', () => {
    // 显示所有图标
    document.querySelectorAll('.bubble .icon').forEach(icon => {
        icon.style.opacity = '0.7';
    });
});

// 返回顶部功能
const backToTop = document.getElementById('backToTop');
const mainNav = document.querySelector('.main-nav');
let lastScrollTop = 0;

// 监听滚动事件
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const navHeight = mainNav.offsetHeight;
    
    // 当滚动超过导航栏高度时显示按钮
    if (scrollTop > navHeight) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
    
    lastScrollTop = scrollTop;
});

// 点击返回顶部
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});