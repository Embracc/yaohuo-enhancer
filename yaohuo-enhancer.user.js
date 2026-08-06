// ==UserScript==
// @name         妖火网增强插件
// @namespace    https://github.com/yaohuo-scripts
// @version      0.9.192
// @author       Embrace (ID:19299)
// @description  妖火网(yaohuo.me) 增强插件 by Embrace/19299
// @match        *://yaohuo.me/*
// @match        *://*.yaohuo.me/*
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 迷你 jQuery（纯原生 JS，无 GM_* 依赖）
    var $ = function(sel, ctx) {
        if (typeof sel === 'function') { document.addEventListener('DOMContentLoaded', sel); return $; }
        if (sel instanceof HTMLElement || sel === window || sel === document) return wrap(sel);
        if (typeof sel === 'string') {
            if (sel.trim().charAt(0) === '<') {
                var d = document.createElement('div');
                d.innerHTML = sel;
                return wrap(d.children.length === 1 ? d.children[0] : Array.from(d.children));
            }
            var el = (ctx || document).querySelectorAll(sel);
            return wrap(el.length === 1 ? el[0] : Array.from(el));
        }
        return wrap(sel);
    };
    $.fn = {};
    function wrap(elem) {
        var obj = Object.create($.fn);
        if (elem === null || elem === undefined) { obj.length = 0; return obj; }
        if (elem instanceof NodeList || Array.isArray(elem)) {
            obj.length = elem.length;
            for (var i = 0; i < elem.length; i++) obj[i] = elem[i];
        } else {
            obj.length = 1;
            obj[0] = elem;
        }
        return obj;
    }
    $.fn.each = function(fn) { for (var i = 0; i < this.length; i++) fn.call(this[i], i, this[i]); return this; };
    $.fn.find = function(sel) { var r = []; this.each(function() { var n = this.querySelectorAll(sel); for (var i = 0; i < n.length; i++) r.push(n[i]); }); return wrap(r); };
    $.fn.on = function(evt, fn) { this.each(function() { this.addEventListener(evt, fn); }); return this; };
    $.fn.off = function(evt, fn) { this.each(function() { this.removeEventListener(evt, fn); }); return this; };
    $.fn.click = function(fn) { if (fn) return this.on('click', fn); this.each(function() { this.click(); }); return this; };
    $.fn.val = function(v) { if (v === undefined) return this[0] ? this[0].value : undefined; this.each(function() { this.value = v; }); return this; };
    $.fn.text = function(t) { if (t === undefined) { var r = ''; this.each(function() { r += this.textContent; }); return r; } this.each(function() { this.textContent = t; }); return this; };
    $.fn.html = function(h) { if (h === undefined) return this[0] ? this[0].innerHTML : ''; this.each(function() { this.innerHTML = h; }); return this; };
    $.fn.css = function(props, val) {
        if (typeof props === 'string') { if (val === undefined) return this[0] ? getComputedStyle(this[0])[props] : ''; this.each(function() { this.style[props] = val; }); return this; }
        for (var k in props) { (function(kk, vv) { this.each(function() { this.style[kk] = vv; }); }).call(this, k, props[k]); }
        return this;
    };
    $.fn.attr = function(k, v) { if (v === undefined) return this[0] ? this[0].getAttribute(k) : ''; this.each(function() { this.setAttribute(k, v); }); return this; };
    $.fn.data = function(k, v) {
        if (v === undefined) { var el = this[0]; if (!el) return; return el.dataset[k] === undefined ? $(el).attr('data-' + k) : el.dataset[k]; }
        this.each(function() { this.dataset[k] = v; }); return this;
    };
    $.fn.remove = function() { this.each(function() { this.remove(); }); return this; };
    $.fn.show = function() { this.each(function() { this.style.display = ''; }); return this; };
    $.fn.hide = function() { this.each(function() { this.style.display = 'none'; }); return this; };
    $.fn.toggle = function(show) { if (show === undefined) { this.each(function() { this.style.display = this.style.display === 'none' ? '' : 'none'; }); } else { this.each(function() { this.style.display = show ? '' : 'none'; }); } return this; };
    $.fn.append = function(c) { this.each(function() { if (typeof c === 'string') this.insertAdjacentHTML('beforeend', c); else if (c instanceof Node) this.appendChild(c); else if (c && c.length) { for (var i = 0; i < c.length; i++) if (c[i]) this.appendChild(c[i]); } }); return this; };
    $.fn.before = function(c) { this.each(function() { if (typeof c === 'string') this.insertAdjacentHTML('beforebegin', c); else if (c instanceof Node) this.parentNode.insertBefore(c, this); }); return this; };
    $.fn.after = function(c) {
        this.each(function() {
            var nodes = [];
            if (typeof c === 'string') { this.insertAdjacentHTML('afterend', c); return; }
            if (c instanceof Node) nodes = [c];
            else if (c && c.length !== undefined) { for (var i = 0; i < c.length; i++) if (c[i]) nodes.push(c[i]); }
            for (var j = nodes.length - 1; j >= 0; j--) {
                if (this.parentNode) this.parentNode.insertBefore(nodes[j], this.nextSibling);
            }
        });
        return this;
    };
    $.fn.closest = function(sel) { return this[0] ? wrap(this[0].closest(sel)) : $(); };
    $.fn.parent = function() { return this[0] ? wrap(this[0].parentNode) : $(); };
    $.fn.addClass = function(c) { this.each(function() { this.classList.add(c); }); return this; };
    $.fn.removeClass = function(c) { this.each(function() { this.classList.remove(c); }); return this; };
    $.fn.hasClass = function(c) { return this[0] ? this[0].classList.contains(c) : false; };
    $.fn.prop = function(k, v) { if (v === undefined) return this[0] ? this[0][k] : ''; this.each(function() { this[k] = v; }); return this; };
    $.fn.offset = function() { var r = this[0] ? this[0].getBoundingClientRect() : {top:0,left:0}; return {top:r.top+window.scrollY, left:r.left+window.scrollX}; };
    $.fn.is = function(sel) { if (sel === ':visible') return this[0] && this[0].offsetParent !== null; return this[0] ? this[0].matches(sel) : false; };
    $.fn.animate = function(props, dur) { this.each(function() {
        var el = this;
        if (props.scrollTop !== undefined) {
            var start = el.scrollTop, change = props.scrollTop - start, startTime = null;
            function step(ts) { if (!startTime) startTime = ts; var p = Math.min((ts - startTime) / (dur || 300), 1); el.scrollTop = start + change * p; if (p < 1) requestAnimationFrame(step); }
            requestAnimationFrame(step);
        }
    }); return this; };
    $.fn.filter = function(sel) { var r = []; this.each(function() { if (this.matches(sel)) r.push(this); }); return wrap(r); };
    $.fn.clone = function() {
        var r = [];
        this.each(function() { r.push(this.cloneNode(true)); });
        return wrap(r.length === 1 ? r[0] : r);
    };
    $.fn.first = function() { return wrap(this[0]); };
    $.fn.last = function() { return wrap(this[this.length - 1]); };
    $.fn.eq = function(i) { return wrap(this[i]); };
    $.trim = function(s) { return (s || '').trim(); };
    $.parseHTML = function(h) { var d = document.createElement('div'); d.innerHTML = h; return d.children; };
    window.$ = $;

    // 原生 AJAX（替代 GM_xmlhttpRequest）
    function xhr(opts) {
        var r = new XMLHttpRequest();
        r.open(opts.method || 'GET', opts.url);
        if (opts.headers) { for (var k in opts.headers) r.setRequestHeader(k, opts.headers[k]); }
        r.onload = function() { if (opts.onload) opts.onload(r); };
        r.onerror = function() { if (opts.onerror) opts.onerror(r); };
        r.ontimeout = function() { if (opts.ontimeout) opts.ontimeout(); };
        if (opts.timeout) r.timeout = opts.timeout;
        r.send(opts.data || null);
    }

    // 原生样式注入
    function addStyle(css) {
        var s = document.createElement('style');
        s.textContent = css;
        document.head.appendChild(s);
    }

    // 工具函数
    function isTopic() {
        return /\/bbs-\d+\.html/.test(location.pathname) || (location.pathname.indexOf('book_view') >= 0 && location.pathname.indexOf('book_view_add') < 0 && location.pathname.indexOf('book_view_mod') < 0);
    }
    function isList() {
        // 列表页：book_list / 首页 / 分区列表，排除帖子页和发帖页
        if (isTopic() || isPostPage()) return false;
        var p = location.pathname || '';
        if (p.indexOf('book_list') >= 0) return true;
        if (p === '/' || p === '') return true;
        // 页面上有帖子链接就当列表页（兼容 SPA/伪静态）
        if (document.querySelector('a[href*="/bbs-"], a.topic-link')) return true;
        return false;
    }
    function isPostPage() {
        return location.pathname.indexOf('book_view_add') >= 0 || location.pathname.indexOf('book_view_mod') >= 0;
    }

    // 设置
    var KEY = 'yh_enhancer';
    var DEFAULTS = {
        newTab: 1, topBtn: 1, lazyLoad: 0, repeat: 1, repStyle: 1, splitView: 0, ubbHelp: 1, levelBtn: 1, eatMeat: 0, opTag: 1, threadView: 1,
        fillReply: 0, btnOpacity: 1, showTime: 0, splitRatio: 40, splitPadding: 2, imgZoom: 1, loadAll: 1, opColor: "#1abc9c", plusColor: "#1abc9c", autoUpdate: 1, floatPreview: 0,
    };
    var YH_VERSION = '0.9.192';
    // 官方 raw（国外/开代理）
    var YH_UPDATE_URL = 'https://raw.githubusercontent.com/Embracc/yaohuo-enhancer/refs/heads/main/yaohuo-enhancer.user.js';
    // 国内安装/检测主链：须代理到 main 最新，勿用会缓存旧版的镜像
    // 实测 gh.ddlc.top 曾卡在 0.9.120；ghfast.top / gh-proxy.com 可到最新
    var YH_UPDATE_URL_CN = 'https://ghfast.top/https://raw.githubusercontent.com/Embracc/yaohuo-enhancer/main/yaohuo-enhancer.user.js';
    var YH_UPDATE_MIRRORS = [
        YH_UPDATE_URL_CN,
        'https://gh-proxy.com/https://raw.githubusercontent.com/Embracc/yaohuo-enhancer/main/yaohuo-enhancer.user.js',
        'https://ghproxy.net/https://raw.githubusercontent.com/Embracc/yaohuo-enhancer/main/yaohuo-enhancer.user.js',
        YH_UPDATE_URL,
        'https://raw.githubusercontent.com/Embracc/yaohuo-enhancer/main/yaohuo-enhancer.user.js',
        'https://cdn.jsdelivr.net/gh/Embracc/yaohuo-enhancer@main/yaohuo-enhancer.user.js',
        'https://fastly.jsdelivr.net/gh/Embracc/yaohuo-enhancer@main/yaohuo-enhancer.user.js',
        'https://cdn.jsdmirror.com/gh/Embracc/yaohuo-enhancer@main/yaohuo-enhancer.user.js'
    ];
    var YH_UPDATE_CHECK_KEY = 'yh_update_last_check'; // 仅记录上次检测时间（调试用），不再做跨页节流
    var _autoUpdateRanThisPage = false; // 同一次页面打开只自动检测一次

    function loadSettings() {
        var saved;
        try { saved = JSON.parse(localStorage.getItem(KEY)); } catch(e) {}
        if (!saved) return JSON.parse(JSON.stringify(DEFAULTS));
        var out = JSON.parse(JSON.stringify(DEFAULTS));
        for (var k in saved) {
            if (saved.hasOwnProperty(k)) {
                out[k] = saved[k];
            }
        }
        return out;
    }
    var S = loadSettings();
    function save() { localStorage.setItem(KEY, JSON.stringify(S)); }

    // ====== 功能实现 ======

    // 1. 新标签页
    function f_newTab() {
        if (!S.newTab) return;
        $('a.topic-link[href*="/bbs-"], .list a[href*="/bbs-"]').each(function() {
            if (!this.getAttribute('target')) this.setAttribute('target', '_blank');
        });
    }

    // 2. 只看楼主
    // 3. 按钮组
    function f_topBtn() {
        if (!S.topBtn) return;
        if ($('.yh-btn-group').length) return;
        var group = $('<div class="yh-btn-group" style="position:fixed;right:15px;bottom:15px;z-index:999;display:flex;flex-direction:column;gap:6px;align-items:center"></div>');
        var tb = $('<button class="yh-tb" style="width:40px;height:40px;border:1px solid #1abc9c;border-radius:50%;background:#fff;color:#1abc9c;cursor:pointer;font-size:20px;line-height:1;box-shadow:0 2px 8px rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center" title="回到顶部">↑</button>');
        tb.on('click', function() { $('html,body').animate({scrollTop:0},300); });
        group.append(tb);
        if (S.levelBtn) {
            var lb = $('<button class="yh-lv" style="width:40px;height:40px;border:1px solid #f39c12;border-radius:50%;background:#fff;color:#f39c12;cursor:pointer;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center;font-weight:bold;-webkit-tap-highlight-color:transparent;touch-action:manipulation" title="查询等级">Lv</button>');
            var _lvTap = function(e) {
                if (e && e.type === 'touchend') e.preventDefault();
                queryLevel(lb);
            };
            lb.on('click', _lvTap);
            lb.on('touchend', _lvTap);
            group.append(lb);
        }
        $('body').append(group);
    }

    // 等级查询 —— 只查当前登录用户，绝不查楼主
    var _lvBusy = false, _lvLast = 0;
    function cacheMyUid(uid) {
        if (!uid || !/^\d+$/.test(String(uid))) return;
        try { localStorage.setItem('yh_myuid', String(uid)); } catch (e) {}
    }
    function clearMyUidCache() {
        try { localStorage.removeItem('yh_myuid'); } catch (e) {}
    }
    // 从任意 HTML 里抠「当前用户」ID：优先 空间/我的地盘 链接，其次 myuserid
    function extractMyUidFromHtml(html) {
        if (!html) return '';
        var m;
        // 首页/地盘：/bbs/userinfo.aspx?touserid=19299 且附近有「空间」或 nickname
        m = html.match(/href="\/bbs\/userinfo\.aspx\?touserid=(\d+)"[^>]*>\s*空间/);
        if (m) return m[1];
        m = html.match(/href='\/bbs\/userinfo\.aspx\?touserid=(\d+)'[^>]*>\s*空间/);
        if (m) return m[1];
        m = html.match(/userinfo\.aspx\?touserid=(\d+)[^>]{0,80}空间/);
        if (m) return m[1];
        // 我的地盘页常见：nickname-row 里的 userinfo
        m = html.match(/nickname-row[\s\S]{0,200}?userinfo\.aspx\?touserid=(\d+)/);
        if (m) return m[1];
        m = html.match(/href="\/myfile\.aspx"[^>]*>[\s\S]{0,120}?userinfo\.aspx\?touserid=(\d+)/);
        if (m) return m[1];
        // 发帖搜索 key=uid
        m = html.match(/book_list_search\.aspx\?[^"']*type=pub[^"']*key=(\d+)/);
        if (m) return m[1];
        m = html.match(/book_list_search\.aspx\?[^"']*key=(\d+)[^"']*type=pub/);
        if (m) return m[1];
        // 隐藏域 / 脚本
        m = html.match(/name=["']myuserid["']\s+value=["'](\d+)["']/);
        if (m) return m[1];
        m = html.match(/value=["'](\d+)["']\s+name=["']myuserid["']/);
        if (m) return m[1];
        m = html.match(/\bmyuserid\s*[:=]\s*['"]?(\d+)/);
        if (m) return m[1];
        return '';
    }
    // 同步：只信本页「明确是自己」的信号，不信任意 touserid，不用脏缓存做最终结果
    function getMyUidSync() {
        var uid = '';
        var src = '';
        var myInput = document.querySelector('input[name="myuserid"]');
        if (myInput && myInput.value && /^\d+$/.test(String(myInput.value).trim())) {
            uid = String(myInput.value).trim();
            src = 'input';
        }
        if (!uid) {
            try {
                var scripts = document.querySelectorAll('script');
                for (var si = 0; si < scripts.length; si++) {
                    var st = scripts[si].textContent || '';
                    var sm = st.match(/\bmyuserid\s*[:=]\s*['"]?(\d+)/);
                    if (sm) { uid = sm[1]; src = 'script'; break; }
                }
            } catch (e1) {}
        }
        // 本页导航上的「空间」链接（首页/部分模板）
        if (!uid) {
            var a = document.querySelector('a[href*="userinfo.aspx?touserid="]');
            // 只接受链接文本含「空间」或父级是顶栏
            var links = document.querySelectorAll('a[href*="/bbs/userinfo.aspx?touserid="]');
            for (var i = 0; i < links.length; i++) {
                var t = (links[i].textContent || '').replace(/\s+/g, '');
                var href = links[i].getAttribute('href') || '';
                if (t.indexOf('空间') >= 0 || t.indexOf('资料') >= 0) {
                    var hm = href.match(/touserid=(\d+)/);
                    if (hm) { uid = hm[1]; src = 'nav'; break; }
                }
            }
        }
        if (!uid) {
            var g = document.cookie.match(/(?:^|;\s*)GET(\d+)=/);
            if (g) { uid = g[1]; src = 'GET'; }
        }
        if (uid) cacheMyUid(uid);
        try { console.log('[YH] getMyUidSync uid=' + uid + ' src=' + src); } catch (e3) {}
        return { uid: uid || '', src: src || '' };
    }
    // 异步：拉首页 / 我的地盘，强制拿到登录用户 ID（列表页/脏缓存场景）
    function resolveMyUid(cb) {
        var sync = getMyUidSync();
        if (sync.uid) {
            cb(sync.uid, sync.src);
            return;
        }
        var tried = 0;
        var urls = ['/', '/myfile.aspx'];
        var done = false;
        function finish(uid, src) {
            if (done) return;
            done = true;
            if (uid) cacheMyUid(uid);
            else clearMyUidCache(); // 清掉历史脏缓存
            try { console.log('[YH] resolveMyUid uid=' + uid + ' src=' + src); } catch (e) {}
            cb(uid || '', src || '');
        }
        function next() {
            if (tried >= urls.length) {
                // 最后才看缓存，并在弹窗链路里用网络页再校验
                var cached = '';
                try { cached = localStorage.getItem('yh_myuid') || ''; } catch (e2) {}
                if (cached && /^\d+$/.test(cached)) finish(cached, 'cache');
                else finish('', 'none');
                return;
            }
            var url = urls[tried++];
            xhr({
                method: 'GET', url: url, timeout: 10000,
                onload: function(res) {
                    var html = res.responseText || '';
                    if (html.indexOf('yh-theme') < 0 && html.indexOf('yaohuo') < 0 && html.indexOf('我的地盘') < 0) {
                        next();
                        return;
                    }
                    var uid = extractMyUidFromHtml(html);
                    if (uid) finish(uid, url === '/' ? 'home' : 'myfile');
                    else next();
                },
                onerror: function() { next(); },
                ontimeout: function() { next(); }
            });
        }
        next();
    }
    function resetLvBtn(btn) {
        if (!btn || !btn[0]) return;
        btn.text('Lv');
        btn[0].style.background = '#fff';
        btn[0].style.color = '#f39c12';
    }
    function fetchAndShowLevel(btn, uid, src) {
        if (!uid) {
            _lvBusy = false;
            resetLvBtn(btn);
            showInfo('未找到当前登录用户ID。请先登录，或打开一次首页/我的地盘后再试', '👤 角色信息');
            return;
        }
        try { console.log('[YH] queryLevel uid=' + uid + ' src=' + src); } catch (e0) {}
        // \u 转义：避免安装包编码损坏导致中文关键字匹配失败（表现为 HTTP 200 仍提示失败）
        var L = '\u3010', R = '\u3011';
        function hasLevelHtml(html) {
            if (!html || html.length < 40) return false;
            if (html.indexOf(L + '\u6635\u79f0' + R) >= 0) return true; // 昵称
            if (html.indexOf(L + '\u5996\u6676' + R) >= 0) return true; // 妖晶
            if (html.indexOf(L + 'ID\u53f7' + R) >= 0) return true;     // ID号
            if (html.indexOf(L + '\u7ecf\u9a8c' + R) >= 0) return true; // 经验
            if (html.indexOf(L + '\u7b49\u7ea7' + R) >= 0) return true; // 等级
            if (html.indexOf('\u4e2a\u4eba\u8d44\u6599') >= 0 && html.indexOf('renick') >= 0) return true;
            return false;
        }
        function parseField(html, key) {
            var esc = String(key).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            var m;
            if (key === 'ID\u53f7' || key === 'ID') {
                m = new RegExp(L + 'ID\u53f7' + R + '[\\s\\S]*?<span[^>]*>[^<]*</span>\\s*(\\d+)').exec(html);
                if (m) return m[1];
                m = new RegExp(L + 'ID\u53f7' + R + '[^\\d]*(\\d+)').exec(html);
                if (m) return m[1];
                return '-';
            }
            m = new RegExp(L + esc + R + '[^<]*<span[^>]*>[^<]*</span>\\s*([^<]+)').exec(html);
            if (m) return String(m[1]).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
            m = new RegExp(L + esc + R + '([^' + L + '\\n<]+)').exec(html);
            return m ? String(m[1]).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '-';
        }
        xhr({
            method: 'GET',
            url: '/bbs/userinfomore.aspx?touserid=' + encodeURIComponent(String(uid)),
            timeout: 15000,
            onload: function(res2) {
                try {
                    var html2 = res2.responseText || '';
                    var st = res2.status || 0;
                    if ((!html2 && st !== 0) || st >= 400 || !hasLevelHtml(html2)) {
                        _lvBusy = false;
                        resetLvBtn(btn);
                        var tip = '等级信息请求失败(' + st + ') uid=' + uid;
                        try { tip += '\nlen=' + (html2 ? html2.length : 0); } catch (e1) {}
                        tip += '\n请确认已登录妖火后再试';
                        showInfo(tip, '👤 角色信息');
                        return;
                    }
                    var nick = parseField(html2, '\u6635\u79f0');
                    var idShow = parseField(html2, 'ID\u53f7');
                    if (!idShow || idShow === '-') idShow = String(uid);
                    if (/^\d+$/.test(idShow)) { uid = idShow; cacheMyUid(uid); }
                    var baseMsg = function(extra) {
                        var s = L + '\u6635\u79f0' + R + (nick || '-')
                            + '\n' + L + 'ID' + R + idShow
                            + '\n' + L + '\u5996\u6676' + R + parseField(html2, '\u5996\u6676') + ':' + 'https://yaohuo.me/bbs/banklist.aspx?key=' + uid
                            + '\n' + L + '\u7ecf\u9a8c' + R + parseField(html2, '\u7ecf\u9a8c') + ':' + 'https://yaohuo.me/bbs/tolvlinfo.aspx'
                            + '\n' + L + '\u7b49\u7ea7' + R + parseField(html2, '\u7b49\u7ea7');
                        if (extra) s += extra;
                        s += '\n' + L + '\u7d2f\u8ba1\u5728\u7ebf' + R + parseField(html2, '\u7d2f\u8ba1\u5728\u7ebf')
                            + '\n' + L + '\u6ce8\u518c\u65f6\u95f4' + R + parseField(html2, '\u6ce8\u518c\u65f6\u95f4');
                        return s;
                    };
                    xhr({
                        method: 'GET',
                        url: '/bbs/userinfo.aspx?touserid=' + encodeURIComponent(String(uid)),
                        timeout: 15000,
                        onload: function(res3) {
                            try {
                                var html3 = res3.responseText || '';
                                var pm = /class=["']?label["']?\s*>\s*\u5e16\u5b50[\s\S]{0,120}?class=["']?value["']?\s*>\s*(\d+)/.exec(html3)
                                    || /class="label">\u5e16\u5b50<[^<]*<[^>]*class="value">(\d+)/.exec(html3);
                                var rm = /class=["']?label["']?\s*>\s*\u56de\u590d[\s\S]{0,120}?class=["']?value["']?\s*>\s*(\d+)/.exec(html3)
                                    || /class="label">\u56de\u590d<[^<]*<[^>]*class="value">(\d+)/.exec(html3);
                                var posts = pm ? pm[1] : '-', replies = rm ? rm[1] : '-';
                                var extra = '\n' + L + '\u5e16\u5b50' + R + posts + ':' + 'https://yaohuo.me/bbs/book_list_search.aspx?action=search&key=' + uid + '&type=pub'
                                    + '\n' + L + '\u56de\u590d' + R + replies + ':' + 'https://yaohuo.me/bbs/book_re_my.aspx?touserid=' + uid;
                                showInfo(baseMsg(extra), '👤 角色信息');
                            } catch (e2) {
                                showInfo(baseMsg(''), '👤 角色信息');
                            }
                            _lvBusy = false;
                            resetLvBtn(btn);
                        },
                        onerror: function() { showInfo(baseMsg('')); _lvBusy = false; resetLvBtn(btn); },
                        ontimeout: function() { showInfo(baseMsg(''), '👤 角色信息'); _lvBusy = false; resetLvBtn(btn); }
                    });
                } catch (e) {
                    _lvBusy = false;
                    resetLvBtn(btn);
                    showInfo('解析等级信息失败: ' + (e && e.message ? e.message : e), '👤 角色信息');
                }
            },
            onerror: function() { _lvBusy = false; resetLvBtn(btn); showInfo('网络错误，无法查询等级', '👤 角色信息'); },
            ontimeout: function() { _lvBusy = false; resetLvBtn(btn); showInfo('请求超时，请重试', '👤 角色信息'); }
        });
    }
    function queryLevel(btn) {
        var now = Date.now();
        if (_lvBusy || now - _lvLast < 800) return;
        _lvBusy = true;
        _lvLast = now;
        if (btn && btn[0]) {
            btn.text('...');
            btn[0].style.background = '#f39c12';
            btn[0].style.color = '#fff';
        }
        // 每次点击都重新解析当前登录用户，避免脏 localStorage / 楼主 ID
        resolveMyUid(function(uid, src) {
            fetchAndShowLevel(btn, uid, src);
        });
    }

    // 信息弹窗
    function showInfo(msg, title) {
        if (!title) title = 'ℹ️ 提示';
        var lines = msg.split('\n');
        var html = lines.map(function(l) {
            var m = l.match(/^【(.+?)】(.+)$/);
            if (m) {
                var label = m[1], value = m[2];
                var colonIdx = value.indexOf(':');
                if (colonIdx > 0) {
                    var val = value.substring(0, colonIdx);
                    var url = value.substring(colonIdx + 1);
                    if (url.match(/^https?:\/\//)) {
                        return '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;font-size:14px"><span style="color:#999">【' + label + '】</span><a href="' + url + '" target="_blank" style="color:#1abc9c;text-decoration:none">' + val + ' →</a></div>';
                    }
                }
                return '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;font-size:14px"><span style="color:#999">【' + label + '】</span><span style="color:#333">' + value + '</span></div>';
            }
            return '<div style="padding:2px 0;font-size:14px;color:#333">' + l + '</div>';
        }).join('');
        var overlay = $('<div class="yh-info-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;background:rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center"></div>');
        var box = $('<div style="background:#fff;border-radius:12px;padding:0;width:90%;max-width:360px;box-shadow:0 8px 30px rgba(0,0,0,.2);overflow:hidden"></div>');
        box.append('<div style="padding:14px 16px;background:#1abc9c;color:#fff;font-size:15px;font-weight:bold">' + title + '</div>');
        box.append('<div style="padding:12px 16px">' + html + '</div>');
        box.append('<div style="padding:10px 16px;text-align:center;border-top:1px solid #eee"><button class="yh-info-close" style="padding:6px 30px;border:1px solid #1abc9c;border-radius:6px;background:#fff;color:#1abc9c;cursor:pointer;font-size:14px">确定</button></div>');
        overlay.append(box);
        $('body').append(overlay);
        overlay.find('.yh-info-close').on('click', function() { overlay.remove(); });
        overlay.on('click', function(e) { if (e.target.classList && e.target.classList.contains('yh-info-overlay')) overlay.remove(); });
    }

    // 4. 自动加载（列表滚动加载 + 帖子进入后加载全部评论）
    var _lastLoad = 0;
    var _allCommentsState = { loading: false, done: false, pid: '' };
    var _lcRetry = 0; // 防止无限循环
    function currentPostId() {
        var m = (location.pathname || '').match(/\/bbs-(\d+)\.html/);
        if (m) return m[1];
        m = (location.search || '').match(/[?&]id=(\d+)/);
        return m ? m[1] : (location.pathname + location.search);
    }
    function getMoreLink() {
        var el = document.querySelector('.more a[href*="book_re"]');
        if (el) return el;
        el = document.querySelector('a[href*="book_re"][href*="getTotal"]');
        if (el) return el;
        el = document.querySelector('.recontent a[href*="page="], .showpage a, .btBox a[href*="page="]');
        if (el) return el;
        return null;
    }
    function countReplies() {
        return document.querySelectorAll('.reline.list-reply, .list-reply, div[data-floor]').length;
    }
    function appendReplyEl(el) {
        var floor = el.getAttribute('data-floor');
        if (floor && document.querySelector('[data-floor="' + floor + '"]')) return false;
        el.classList.add('reline', 'list-reply');
        var box = document.querySelector('.recontent') ||
            document.querySelector('.list-reply') && document.querySelector('.list-reply').parentNode ||
            document.querySelector('#book-view-content');
        if (!box) return false;
        box.appendChild(el);
        return true;
    }
    function afterAllCommentsLoaded() {
        var tip = document.querySelector('.yh-loading-all');
        if (tip) {
            tip.textContent = '✅ 评论已全部加载';
            tip.style.color = '#27ae60';
            setTimeout(function() { if (tip && tip.parentNode) tip.parentNode.removeChild(tip); }, 1200);
        }
        // 清掉旧整理标记，统一重新整理
        var oldTips = document.querySelectorAll('.yh-thread-tip');
        for (var i = 0; i < oldTips.length; i++) oldTips[i].remove();
        var recontent = document.querySelector('.recontent');
        var nests = document.querySelectorAll('.yh-thread-nest, .yh-thread');
        for (var j = 0; j < nests.length; j++) {
            if (!nests[j].parentNode) continue;
            // 先把嵌套内的回复移回 recontent，再删除空巢，避免丢失回复
            var children = Array.from(nests[j].children);
            for (var c = 0; c < children.length; c++) {
                if (recontent) recontent.appendChild(children[c]);
                else if (nests[j].parentNode) nests[j].parentNode.insertBefore(children[c], nests[j]);
            }
            nests[j].remove();
        }
        // 显示所有可能被隐藏的回复，准备重排
        var replies = document.querySelectorAll('.reline.list-reply, .list-reply, div[data-floor]');
        for (var k = 0; k < replies.length; k++) {
            if (replies[k].style && replies[k].style.display === 'none') {
                replies[k].style.display = '';
            }
            replies[k].removeAttribute('data-yh-threaded');
        }
        setTimeout(function() {
            f_threadView(true);
            f_opTag();
            f_repeat();
        }, 80);
        setTimeout(function() { f_repeat(); }, 400);
        setTimeout(function() { f_repeat(); }, 1200);
        setTimeout(function() { f_repeat(); }, 3000);
    }
    function loadAllComments(force) {
        if (!isTopic()) return;
        if (_lcRetry >= 3 && !force) {
            return;
        }
        var pid = currentPostId();
        if (_allCommentsState.pid !== pid) {
            _allCommentsState = { loading: false, done: false, pid: pid };
        }
        if (_allCommentsState.loading) return;
        if (_allCommentsState.done && !force) return;

        var more = getMoreLink();
        // 没有“更多”链接：可能已经全部在本页
        if (!more) {
            // 但再多试一次：直接构造 book_re URL
            var pid2 = currentPostId();
            if (pid2 && /^\d+$/.test(pid2)) {
                var classid = (location.search || '').match(/classid=(\d+)/);
                var cid = classid ? classid[1] : '177';
                var fallbackUrl = '/bbs/book_re.aspx?classid=' + cid + '&id=' + pid2 + '&siteid=1000';
                more = { getAttribute: function() { return fallbackUrl; } };
            }
            if (!more) {
                _allCommentsState.done = true;
                afterAllCommentsLoaded();
                return;
            }
        }
        var href = more.getAttribute('href') || '';
        if (href.indexOf('http') !== 0 && href.charAt(0) !== '/') {
            href = '/' + href;
        }
        var tm = href.match(/getTotal=(\d+)/);
        var total = tm ? parseInt(tm[1], 10) : 0;
        // 没有 getTotal 时，尝试从页面分页链接数推断
        if (!total) {
            var pageLinks = document.querySelectorAll('.showpage a[href*="page="], .more a[href*="page="], .btBox a[href*="page="], .showpage a[href*="lpage="], .more a[href*="lpage="]');
            var maxPage = 0;
            for (var pi = 0; pi < pageLinks.length; pi++) {
                var pm = (pageLinks[pi].getAttribute('href') || '').match(/[lp]age=(\d+)/);
                if (pm) { var np = parseInt(pm[1], 10); if (np > maxPage) maxPage = np; }
            }
        }
        var current = countReplies();
        if (total > 0 && current >= total) {
            _allCommentsState.done = true;
            afterAllCommentsLoaded();
            return;
        }

        _allCommentsState.loading = true;
        _lcRetry++;
        // tip
        var tip = document.querySelector('.yh-loading-all');
        if (!tip) {
            tip = document.createElement('div');
            tip.className = 'yh-loading-all';
            tip.style.cssText = 'margin:8px 0;padding:8px 10px;background:#e8f8f5;border:1px solid #b8e6d8;border-radius:8px;color:#1abc9c;font-size:13px;text-align:center';
            tip.textContent = '⏳ 正在加载全部评论...';
            var re = document.querySelector('.recontent');
            if (re && re.parentNode) re.parentNode.insertBefore(tip, re);
            else if (more.parentNode) more.parentNode.insertBefore(tip, more);
            else document.body.insertBefore(tip, document.body.firstChild);
        }

        var perPage = 30;
        var totalPages = total > 0 ? Math.ceil(total / perPage) : 1;
        var currentPage = Math.max(1, Math.floor(current / perPage) + 1);
        // 构建 baseUrl：只保留 classid、id、getTotal 等参数，去掉 page / lpage
        var baseUrl = href.replace(/[?&]lpage=\d+/g, '').replace(/[?&]page=\d+/g, '');
        baseUrl = baseUrl.replace(/\?&/, '?').replace(/&&+/g, '&').replace(/\?$/, '');
        // 修复：如果删掉第一个参数导致 ? 变成 &，把开头的 & 换回 ?
        if (baseUrl.indexOf('?') < 0 && baseUrl.indexOf('&') >= 0) {
            baseUrl = baseUrl.replace('&', '?');
        }
        var sep = baseUrl.indexOf('?') >= 0 ? '&' : '?';
        if (baseUrl.charAt(0) !== '/' && baseUrl.indexOf('http') !== 0) baseUrl = '/' + baseUrl;

        // 从第 2 页开始拉（第 1 页已在 DOM 中）
        var startPage = 2;
        var endPage = Math.max(totalPages, currentPage, 2);
        // 如果 totalPages 算出来只有 1 页，但还是没加载完，补拉到 currentPage
        if (totalPages <= 1 && currentPage > 1) endPage = currentPage;
        var pageCount = endPage - startPage + 1;
        if (pageCount <= 0) {
            // 没有更多页了
            _allCommentsState.loading = false;
            _allCommentsState.done = true;
            afterAllCommentsLoaded();
            return;
        }
        var loaded = 0;
        var added = 0;

        function finishOne() {
            loaded++;
            if (tip) tip.textContent = '⏳ 正在加载全部评论... (' + loaded + '/' + pageCount + ') 已加入 ' + added + ' 条';
            if (loaded >= pageCount) {
                _allCommentsState.loading = false;
                _allCommentsState.done = true;
                afterAllCommentsLoaded();
            }
        }

        for (var p = startPage; p <= endPage; p++) {
            (function(page) {
                var url = (baseUrl.indexOf('http') === 0 ? baseUrl : (location.origin || 'https://yaohuo.me') + baseUrl) + sep + 'page=' + page;
                // 注意：不加 lpage 参数，避免服务器混淆
                xhr({
                    method: 'GET',
                    url: url,
                    timeout: 20000,
                    onload: function(res) {
                        try {
                            var html = res.responseText || '';
                            var tmp = document.createElement('div');
                            tmp.innerHTML = html;
                            var nodes = tmp.querySelectorAll('.list-reply, .reline.list-reply, div[data-floor]');
                            for (var i = 0; i < nodes.length; i++) {
                                var el = document.importNode(nodes[i], true);
                                if (appendReplyEl(el)) added++;
                            }
                        } catch (e) {}
                        finishOne();
                    },
                    onerror: function() { finishOne(); },
                    ontimeout: function() { finishOne(); }
                });
            })(p);
        }
    }
    function f_lazyLoad() {
        // 列表页：滚动自动点加载更多（仍受开关控制）
        if (S.lazyLoad && isList()) {
            var now = Date.now();
            if (now - _lastLoad >= 3000) {
                var btn = document.getElementById('KL_loadmore') ||
                    document.querySelector('#ual_trigger_link, a[id$=loadmore], span[id$=show_tip], a[href*="KL_show_next"]');
                if (btn) {
                    // 如果是 span 则取父级 a
                    if (btn.tagName === 'SPAN' && btn.parentElement && btn.parentElement.tagName === 'A') btn = btn.parentElement;
                    var bt = btn.getBoundingClientRect().top + window.scrollY;
                    var sb = window.scrollY + window.innerHeight;
                    if (bt <= sb + 300) {
                        _lastLoad = now;
                        btn.click();
                    }
                }
            }
        }
        // 帖子页：加载全部评论 或 滚动加载下一页
        if (isTopic()) {
            if (S.loadAll) {
                loadAllComments(false);
            } else {
                // 关闭「加载全部」时：滚动到底部自动加载下一页评论，并整理楼中楼
                // 直接点击页面上的「加载更多」按钮（与列表页同理）
                var now2 = Date.now();
                if (now2 - _lastLoad >= 3000) {
                    var scrollPct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
                    if (scrollPct < 0.9) return;
                    var btn = document.getElementById('KL_loadmore') ||
                        document.querySelector('#ual_trigger_link, a[id$=loadmore], span[id$=show_tip], a[href*="KL_show_next"], #ual_trigger_link, a[href*="KL_show_next"]');
                    if (btn) {
                        if (btn.tagName === 'SPAN' && btn.parentElement && btn.parentElement.tagName === 'A') btn = btn.parentElement;
                        _lastLoad = now2;
                        btn.click();
                        // 加载后等 DOM 更新再整理楼中楼
                        setTimeout(function() {
                            try {
                                var recontent = document.querySelector('.recontent');
                                var oldNests = document.querySelectorAll('.yh-thread-nest, .yh-thread-tip');
                                for (var oi = 0; oi < oldNests.length; oi++) {
                                    if (!oldNests[oi].parentNode) continue;
                                    var children = Array.from(oldNests[oi].children);
                                    for (var c = 0; c < children.length; c++) {
                                        if (recontent) recontent.appendChild(children[c]);
                                        else if (oldNests[oi].parentNode) oldNests[oi].parentNode.insertBefore(children[c], oldNests[oi]);
                                    }
                                    oldNests[oi].parentNode.removeChild(oldNests[oi]);
                                }
                                var replies = document.querySelectorAll('.reline, .list-reply, [data-floor]');
                                for (var ri = 0; ri < replies.length; ri++) { replies[ri].removeAttribute('data-yh-threaded'); replies[ri].style.display = ''; }
                            } catch (e1) {}
                            f_threadView(true);
                            f_repeat();
                            f_opTag();
                        }, 500);
                    } else {
                        // 没有按钮时用 XHR 方式加载
                        var moreLink = getMoreLink();
                        if (!moreLink) return;
                        var href = moreLink.getAttribute('href') || '';
                        var tm = href.match(/getTotal=(\d+)/);
                        var total = tm ? parseInt(tm[1], 10) : 0;
                        var current = countReplies();
                        if (total > 0 && current >= total) return;
                        _lastLoad = now2;
                        var perPage = 30;
                        var nextPage = Math.max(2, Math.floor(current / perPage) + 1);
                        var baseUrl = href.replace(/[?&]lpage=\d+/g, '').replace(/[?&]page=\d+/g, '');
                        if (baseUrl.indexOf('?') < 0 && baseUrl.indexOf('&') >= 0) baseUrl = baseUrl.replace('&', '?');
                        var sep = baseUrl.indexOf('?') >= 0 ? '&' : '?';
                        if (baseUrl.charAt(0) !== '/' && baseUrl.indexOf('http') !== 0) baseUrl = '/' + baseUrl;
                        var url = (baseUrl.indexOf('http') === 0 ? baseUrl : (location.origin || 'https://yaohuo.me') + baseUrl) + sep + 'page=' + nextPage;
                        xhr({
                            method: 'GET', url: url, timeout: 15000,
                            onload: function(res) {
                                try {
                                    var html = res.responseText || '';
                                    var tmp = document.createElement('div');
                                    tmp.innerHTML = html;
                                    var nodes = tmp.querySelectorAll('.list-reply, .reline.list-reply, div[data-floor]');
                                    var added = 0;
                                    for (var ni = 0; ni < nodes.length; ni++) {
                                        var el = document.importNode(nodes[ni], true);
                                        if (appendReplyEl(el)) added++;
                                    }
                                    if (added > 0) {
                                        try {
                                            var recontent = document.querySelector('.recontent');
                                            var oldNests = document.querySelectorAll('.yh-thread-nest, .yh-thread-tip');
                                            for (var oi = 0; oi < oldNests.length; oi++) {
                                                if (!oldNests[oi].parentNode) continue;
                                                var children = Array.from(oldNests[oi].children);
                                                for (var c = 0; c < children.length; c++) {
                                                    if (recontent) recontent.appendChild(children[c]);
                                                    else if (oldNests[oi].parentNode) oldNests[oi].parentNode.insertBefore(children[c], oldNests[oi]);
                                                }
                                                oldNests[oi].parentNode.removeChild(oldNests[oi]);
                                            }
                                            var replies = document.querySelectorAll('.reline, .list-reply, [data-floor]');
                                            for (var ri = 0; ri < replies.length; ri++) { replies[ri].removeAttribute('data-yh-threaded'); replies[ri].style.display = ''; }
                                        } catch (e1) {}
                                        f_threadView(true);
                                        f_repeat();
                                        f_opTag();
                                    }
                                } catch (e2) {}
                            },
                            onerror: function() {},
                            ontimeout: function() {}
                        });
                    }
                }
            }
        }
    }

    // 5. 复读机：每条评论后 +1，点击后复读并发送
        function getReplyNodes() {
        var sels = [
            '.recontent .reline.list-reply',
            '.recontent .list-reply',
            '.recontent .reline',
            '.recontent div[data-floor]',
            '.list-reply',
            '.reline',
            'div[data-floor]',
            'div[data-reply-id]'
        ];
        var out = [];
        // 用 Set 去重，DOM 节点当对象 key 会全转 [object HTMLDivElement] 导致只保留第一个
        var seen = (typeof Set !== 'undefined') ? new Set() : null;
        for (var s = 0; s < sels.length; s++) {
            var nodes = document.querySelectorAll(sels[s]);
            for (var i = 0; i < nodes.length; i++) {
                var el = nodes[i];
                if (!el) continue;
                if (seen) { if (seen.has(el)) continue; seen.add(el); }
                else { var k = el.getAttribute('data-floor') || el.getAttribute('data-reply-id') || el.className + '_' + el.innerHTML.length; if (out.some(function(o) { return o === el; })) continue; }
                var hasFloor = el.hasAttribute('data-floor') || !!el.querySelector('.floornumber');
                var hasText = !!el.querySelector('.retext, .content, .reply-content');
                var hasNick = !!el.querySelector('.renick');
                if (!(hasText || (hasFloor && hasNick))) continue;
                out.push(el);
            }
        }
        return out;
    } function getReplyTextNode(el) {
        return el.querySelector('.retext') || el.querySelector('.content') || el.querySelector('.reply-content');
    }
    function getReplyText(el) {
        var t = getReplyTextNode(el);
        if (!t) return '';
        var clone = t.cloneNode(true);
        var junk = clone.querySelectorAll('.yh-rep, .yh-copy, .yh-rep-wrap, .yh-optag, script, style');
        for (var i = 0; i < junk.length; i++) junk[i].remove();
        // 替换图片为 [img]UBB 代码，保留表情/贴图，不丢失也不转成纯文字
        var imgs = clone.querySelectorAll('img');
        for (var i2 = 0; i2 < imgs.length; i2++) {
            var src = (imgs[i2].getAttribute('src') || '').trim();
            var ubb = src ? '[img]' + src + '[/img]' : '';
            if (ubb) {
                try {
                    var txt = document.createTextNode(ubb);
                    imgs[i2].parentNode.replaceChild(txt, imgs[i2]);
                } catch (e) {}
            }
        }
        // 使用 innerHTML + 提取文本（已被替换为 UBB）的方式保留 UBB 标签
        var html = clone.innerHTML;
        // 清理剩余无用的标签，保留文本和 UBB
        html = html.replace(/<br\s*\/?>/gi, '\n');
        html = html.replace(/<[^>]+>/g, '');
        return html.replace(/\s+/g, ' ').trim();
    }
    function findReplyFormTextarea() {
        return document.querySelector('textarea.retextarea') ||
            document.querySelector('form[name="f"] textarea') ||
            document.querySelector('textarea[name="content"]') ||
            document.querySelector('textarea#content') ||
            document.querySelector('.kuaisuhuifu textarea') ||
            document.querySelector('form textarea');
    }
    function submitRepeat(text) {
        var ta = findReplyFormTextarea();
        if (!ta) { alert('未找到回复框'); return false; }
        ta.value = text;
        try { ta.focus(); } catch (e0) {}
        try { ta.dispatchEvent(new Event('input', {bubbles:true})); } catch (e1) {}
        try { ta.dispatchEvent(new Event('change', {bubbles:true})); } catch (e2) {}
        try {
            var ev = document.createEvent('HTMLEvents');
            ev.initEvent('keyup', true, true);
            ta.dispatchEvent(ev);
        } catch (e3) {}
        var form = ta.closest('form') || document.querySelector('form[name="f"]') || document.querySelector('form');
        if (!form) { alert('未找到回复表单'); return false; }
        var sub = form.querySelector('input[type="submit"][name="g"]') ||
            form.querySelector('input[name="g"]') ||
            form.querySelector('input[type="submit"]') ||
            form.querySelector('button[type="submit"]') ||
            document.querySelector('input[type="submit"][name="g"]');
        if (sub) {
            try { sub.click(); return true; } catch (e4) {}
        }
        try { if (form.requestSubmit) { form.requestSubmit(); return true; } } catch (e5) {}
        try { form.submit(); return true; } catch (e6) {}
        alert('提交失败');
        return false;
    }
    function fillReplyBox(text) {
        text = String(text || '');
        if (!text) return false;
        var ta = findReplyFormTextarea();
        if (!ta) {
            try { showInfo('未找到回复框，无法填入'); } catch (e0) { try { alert('未找到回复框'); } catch (e1) {} }
            return false;
        }
        try {
            ta.value = text;
            try { ta.focus(); } catch (e2) {}
            try {
                var len = ta.value.length;
                if (typeof ta.setSelectionRange === 'function') ta.setSelectionRange(len, len);
            } catch (e3) {}
            try { ta.dispatchEvent(new Event('input', { bubbles: true })); } catch (e4) {}
            try { ta.dispatchEvent(new Event('change', { bubbles: true })); } catch (e5) {}
            try {
                var ev = document.createEvent('HTMLEvents');
                ev.initEvent('keyup', true, true);
                ta.dispatchEvent(ev);
            } catch (e6) {}
            // 滚到回复框，方便修改后发送
            try { ta.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e7) {
                try { ta.scrollIntoView(true); } catch (e8) {}
            }
            return true;
        } catch (e9) {
            return false;
        }
    }
    function copyTextToClipboard(text, done) {
        text = String(text || '');
        if (!text) { if (done) done(false); return; }
        function ok(v) { if (done) done(!!v); }
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function() { ok(true); }).catch(function() {
                    ok(fallbackCopy(text));
                });
                return;
            }
        } catch (e0) {}
        ok(fallbackCopy(text));
        function fallbackCopy(str) {
            try {
                var ta = document.createElement('textarea');
                ta.value = str;
                ta.setAttribute('readonly', '');
                ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                ta.setSelectionRange(0, str.length);
                var r = false;
                try { r = document.execCommand('copy'); } catch (e1) { r = false; }
                document.body.removeChild(ta);
                return r;
            } catch (e2) { return false; }
        }
    }
    function bindTapNoSlide(el, onTap, tag) {
        var touch = { x: 0, y: 0, moved: false, active: false };
        var MOVE_PX = 10;
        el.addEventListener('touchstart', function(e) {
            var t = e.touches && e.touches[0];
            if (!t) return;
            touch.active = true;
            touch.moved = false;
            touch.x = t.clientX;
            touch.y = t.clientY;
        }, { passive: true, capture: true });
        el.addEventListener('touchmove', function(e) {
            if (!touch.active) return;
            var t = e.touches && e.touches[0];
            if (!t) return;
            var dx = t.clientX - touch.x, dy = t.clientY - touch.y;
            if (dx * dx + dy * dy > MOVE_PX * MOVE_PX) touch.moved = true;
        }, { passive: true, capture: true });
        el.addEventListener('touchcancel', function() {
            touch.active = false;
            touch.moved = true;
        }, { passive: true, capture: true });
        el.addEventListener('touchend', function(e) {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            var moved = touch.moved;
            touch.active = false;
            if (moved) {
                touch.moved = false;
                try { console.log('[YH]', tag || 'tap', 'cancelled: slide'); } catch (e1) {}
                return;
            }
            onTap();
        }, { passive: false, capture: true });
        el.addEventListener('click', function(e) {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            if (touch.moved) { touch.moved = false; return; }
            onTap();
        }, true);
    }
    function makeRepBtn(cls, label, title, bg) {
        var a = document.createElement('a');
        a.href = 'javascript:;';
        a.className = cls;
        a.textContent = label;
        a.title = title;
        a.style.cssText = 'display:inline-block;padding:0 8px;height:20px;line-height:20px;border-radius:10px;background:' + bg + ';color:#fff!important;font-size:12px;font-weight:bold;text-decoration:none!important;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation;';
        return a;
    }
    function ensureRepWrap(el) {
        var wrap = el.querySelector('.yh-rep-wrap');
        if (wrap) return wrap;
        wrap = document.createElement('span');
        wrap.className = 'yh-rep-wrap';
        wrap.style.cssText = 'margin-left:6px;display:inline-flex;align-items:center;gap:4px;vertical-align:middle;';
        var retext = getReplyTextNode(el);
        if (retext) {
            if (retext.nextSibling) retext.parentNode.insertBefore(wrap, retext.nextSibling);
            else retext.parentNode.appendChild(wrap);
        } else {
            var renick = el.querySelector('.renick');
            if (renick && renick.parentNode) renick.parentNode.appendChild(wrap);
            else el.appendChild(wrap);
        }
        return wrap;
    }
    function bindPlusOne(btn, el, text) {
        if (btn.getAttribute('data-yh-bound') === '1') return;
        btn.setAttribute('data-yh-bound', '1');
        var locked = false;
        bindTapNoSlide(btn, function() {
            if (locked) return;
            locked = true;
            var oldTxt = btn.textContent;
            btn.textContent = '...';
            var live = getReplyText(el) || text;
            var ok = submitRepeat(live);
            setTimeout(function() {
                locked = false;
                btn.textContent = oldTxt;
            }, ok ? 1500 : 500);
        }, '+1');
    }
    function bindFillReply(cbtn, el, text) {
        if (cbtn.getAttribute('data-yh-bound') === '1') return;
        cbtn.setAttribute('data-yh-bound', '1');
        var copyLocked = false;
        bindTapNoSlide(cbtn, function() {
            if (copyLocked) return;
            copyLocked = true;
            var live = getReplyText(el) || text;
            var oldTxt = cbtn.textContent;
            cbtn.textContent = '...';
            var okFill = fillReplyBox(live);
            try { copyTextToClipboard(live, function() {}); } catch (eCopy) {}
            cbtn.textContent = okFill ? '✓' : '×';
            cbtn.style.background = okFill ? '#27ae60' : '#e74c3c';
            setTimeout(function() {
                cbtn.textContent = oldTxt;
                cbtn.style.background = '#3498db';
                copyLocked = false;
            }, okFill ? 1000 : 1200);
            if (!okFill) {
                try { showInfo('未能写入回复框'); } catch (e3) {}
            }
        }, 'fill');
    }
    function f_repeat() {
        if (!isTopic()) return;
        // 复读机(+1) 与 复制评论(复) 可分别开关；都关则清理按钮
        var wantPlus = !!S.repeat;
        var wantFill = !!S.fillReply;
        var replies = getReplyNodes();
        for (var i = 0; i < replies.length; i++) {
            (function(el) {
                if (!el) return;
                var text = getReplyText(el);
                if (!text && !el.querySelector('.yh-rep-wrap')) return;

                if (!wantPlus && !wantFill) {
                    var dead = el.querySelector('.yh-rep-wrap');
                    if (dead && dead.parentNode) dead.parentNode.removeChild(dead);
                    return;
                }

                var wrap = ensureRepWrap(el);
                // +1
                var btn = wrap.querySelector('.yh-rep');
                if (wantPlus) {
                    if (!btn) {
                        btn = makeRepBtn('yh-rep yh-rep1', '+1', '复读并发送', S.plusColor || '#1abc9c');
                        // 插到最前
                        if (wrap.firstChild) wrap.insertBefore(btn, wrap.firstChild);
                        else wrap.appendChild(btn);
                    }
                    bindPlusOne(btn, el, text);
                } else if (btn && btn.parentNode) {
                    btn.parentNode.removeChild(btn);
                }
                // 复：仅设置「复制评论」开启时显示
                var cbtn = wrap.querySelector('.yh-copy');
                if (wantFill) {
                    if (!cbtn) {
                        cbtn = makeRepBtn('yh-copy', '复', '复制评论到回复框（不发送，可修改后自己发）', '#3498db');
                        wrap.appendChild(cbtn);
                    }
                    bindFillReply(cbtn, el, text);
                } else if (cbtn && cbtn.parentNode) {
                    cbtn.parentNode.removeChild(cbtn);
                }
                // wrap 空了就删
                if (!wrap.querySelector('.yh-rep, .yh-copy') && wrap.parentNode) {
                    wrap.parentNode.removeChild(wrap);
                }
            })(replies[i]);
        }
    }
    // 6. 分屏预览（事件委托，不依赖逐个给链接打标）
    var _panelLoaded = false, _splitBound = false, _splitStyleEl = null;
    function isPostLink(href) {
        if (!href) return false;
        // 相对/绝对帖子链接：/bbs-123.html 或 book_view.aspx?id=
        return /\/bbs-\d+\.html/i.test(href) || /book_view\.aspx/i.test(href);
    }
    function f_splitView() {
        if (!S.splitView || inIframe) return;
        if (!isList()) return;
        if (!_panelLoaded) { _panelLoaded = true; createSplitPanel(); }
        if (_splitBound) return;
        _splitBound = true;
        // 捕获阶段拦截，优先于新标签 target=_blank
        document.addEventListener('click', function(e) {
            if (!S.splitView) return;
            if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button === 1) return;
            var el = e.target;
            // 向上找 a 标签
            while (el && el !== document && el.nodeType === 1) {
                if (el.tagName === 'A') break;
                el = el.parentNode;
            }
            if (!el || el.tagName !== 'A') return;
            var href = el.getAttribute('href') || '';
            if (!isPostLink(href)) return;
            // 忽略已经在分屏面板里的链接
            if (el.closest && el.closest('.yh-panel')) return;
            e.preventDefault();
            e.stopPropagation();
            loadPostToPanel(href);
        }, true);
    }
    function createSplitPanel() {
        if (document.querySelector('.yh-panel')) return;
        var panel = document.createElement('div');
        panel.className = 'yh-panel';
        var rv = 100 - (parseInt(S.splitRatio) || 40); panel.style.cssText = 'position:fixed;top:0;right:-' + rv + 'vw;width:' + rv + 'vw;height:100%;z-index:99998;background:#fff;border-left:2px solid #1abc9c;box-shadow:-4px 0 12px rgba(26,188,156,.18);transition:right .3s ease;overflow:hidden;display:flex;flex-direction:column';
        panel.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid #eee;background:#f9f9f9;flex-shrink:0"><span class="yh-panel-title" style="font-size:15px;font-weight:bold;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;margin-right:10px">帖子预览</span><span class="yh-panel-close" style="cursor:pointer;font-size:22px;color:#999;line-height:1;padding:0 4px;flex-shrink:0">&times;</span></div><iframe class="yh-panel-iframe" style="flex:1;width:100%;border:none;background:#fff"></iframe>';
        document.body.appendChild(panel);
        panel.querySelector('.yh-panel-close').addEventListener('click', hidePanel);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                var p = document.querySelector('.yh-panel');
                if (p && p.style.right === '0px') hidePanel();
            }
        });
    }
    function applySplitStyle() {
        var ratio = parseInt(S.splitRatio) || 40;
        var pad = parseInt(S.splitPadding) || 2;
        if (ratio < 20) ratio = 20;
        if (ratio > 60) ratio = 60;
        if (pad < 0) pad = 0;
        if (pad > 50) pad = 50;
        var rightVw = 100 - ratio;
        // 更新面板宽度
        var panel = document.querySelector('.yh-panel');
        if (panel) {
            panel.style.width = rightVw + 'vw';
        }
        // 更新左侧按钮位置
        var ltb = document.querySelector('.yh-left-top');
        if (ltb) ltb.style.left = 'calc(' + ratio + 'vw - 50px)';
        // 更新 CSS
        if (!_splitStyleEl || !_splitStyleEl.isConnected) {
            _splitStyleEl = document.createElement('style');
            _splitStyleEl.id = 'yh-split-style';
            document.head.appendChild(_splitStyleEl);
        }
        _splitStyleEl.textContent = 'body.yh-split-open{max-width:' + ratio + 'vw!important;margin:0!important}body.yh-split-open>.title,body.yh-split-open>.btBox,body.yh-split-open>.listdata,body.yh-split-open>.showpage,body.yh-split-open>.footer,body.yh-split-open>.nexttitle,body.yh-split-open>.newMessage,body.yh-split-open>.subtitle,body.yh-split-open>.subtitle2{max-width:100%}body.yh-split-open .listdata{padding-left:' + pad + 'px!important;padding-right:' + pad + 'px!important}';
    }
    // 分屏样式兜底：面板开着但样式元素被页面脚本移除时自动恢复
    function f_splitStyleCheck() {
        if (!S.splitView) return;
        if (!document.body.classList.contains('yh-split-open')) return;
        if (!_splitStyleEl || !_splitStyleEl.isConnected || !document.getElementById('yh-split-style')) {
            applySplitStyle();
        }
    }
    function showPanel() {
        var panel = document.querySelector('.yh-panel');
        if (!panel) { createSplitPanel(); panel = document.querySelector('.yh-panel'); }
        if (!panel) return;
        applySplitStyle();
        panel.style.right = '0';
        document.body.classList.add('yh-split-open');
        if (!document.querySelector('.yh-left-top')) {
            var ltb = document.createElement('button');
            ltb.className = 'yh-left-top';
            ltb.title = '回到顶部';
            ltb.textContent = '↑';
            ltb.style.cssText = 'position:fixed;left:calc(' + (parseInt(S.splitRatio) || 40) + 'vw - 50px);bottom:15px;z-index:99999;width:36px;height:36px;border:1px solid #1abc9c;border-radius:50%;background:#fff;color:#1abc9c;cursor:pointer;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center';
            ltb.addEventListener('click', function() { window.scrollTo({top:0,behavior:'smooth'}); });
            document.body.appendChild(ltb);
        }
    }
    function hidePanel() {
        var panel = document.querySelector('.yh-panel');
        if (panel) { var rv = 100 - (parseInt(S.splitRatio) || 40); panel.style.right = '-' + rv + 'vw'; }
        document.body.classList.remove('yh-split-open');
        var ltb = document.querySelector('.yh-left-top');
        if (ltb) ltb.remove();
    }
    function loadPostToPanel(url) {
        if (!url) return;
        // 相对路径补全
        if (url.indexOf('http') !== 0) {
            try { url = new URL(url, location.origin).href; } catch(e) {}
        }
        showPanel();
        var titleEl = document.querySelector('.yh-panel-title');
        var iframe = document.querySelector('.yh-panel-iframe');
        if (titleEl) titleEl.textContent = '加载中...';
        if (!iframe) return;
        iframe.onload = function() {
            try {
                var doc = this.contentDocument || this.contentWindow.document;
                var t = doc.title;
                if (t && titleEl) titleEl.textContent = t;
                var style = doc.createElement('style');
                style.textContent = '.newMessage,.title,.subtitle2,.btBox,.nexttitle,.footer,.list{display:none!important} body{max-width:100%!important;margin:0!important;padding:8px!important;overscroll-behavior:contain!important} html{overscroll-behavior:contain!important}';
                doc.head.appendChild(style);
                // 分屏吃肉检测
                if (S.eatMeat) {
                    try {
                        var remainEl = doc.querySelector('.yushuzi');
                        if (remainEl) {
                            var remain = parseInt(remainEl.textContent.trim());
                            if (!isNaN(remain) && remain > 0) {
                                var pid = url.match(/\/bbs-(\d+)/);
                                if (pid) {
                                    var today = new Date().toISOString().slice(0, 10);
                                    var cacheKey = 'yh_eat_' + pid[1];
                                    if (localStorage.getItem(cacheKey) === today) return;
                                    // 分屏内查自己有没有已吃（跨 iframe 读取 renick）
                                    var uid = '';
                                    try { var uidInput = doc.querySelector('input[name="myuserid"]'); if (uidInput) uid = uidInput.value; } catch (eUid) {}
                                    if (uid) {
                                        var links = doc.querySelectorAll('.renick a[href*="touserid=' + uid + '"]');
                                        var alreadyEaten = false;
                                        for (var si = 0; si < links.length; si++) {
                                            var replyEl = links[si].closest('.reline, .list-reply, [data-floor]');
                                            if (!replyEl) continue;
                                            var txt = (replyEl.textContent || '').replace(/\\s+/g, ' ').trim();
                                            if (txt.indexOf('吃') >= 0 || txt.indexOf('肉') >= 0) { alreadyEaten = true; break; }
                                        }
                                        if (alreadyEaten) { localStorage.setItem(cacheKey, today); return; }
                                    }
                                    if (localStorage.getItem(cacheKey) === today) return;
                                    var form = doc.querySelector('textarea.retextarea');
                                    if (form) form = form.closest('form');
                                    if (form) {
                                        var fd = new FormData();
                                        form.querySelectorAll('input[type="hidden"], input[type="submit"]').forEach(function(el) {
                                            if (el.name) fd.append(el.name, el.value || '');
                                        });
                                        var words = ['吃', '肉'];
                                        var word = words[Math.floor(Math.random() * words.length)];
                                        var num = Math.floor(Math.random() * 10);
                                        fd.append('content', word + num);
                                        xhr({
                                            method: 'POST', url: form.getAttribute('action') || '/bbs/book_re.aspx', data: fd,
                                            onload: function() { localStorage.setItem(cacheKey, today); },
                                            onerror: function() {}
                                        });
                                    }
                                }
                            }
                        }
                    } catch(e) {}
                }
            } catch(e) {}
        };
        iframe.src = url;
    }

    // 8. 自动吃肉
    function hasEatenOnPage(pid, uid) {
        // 查看页面上有没有当前用户的包含「吃」「肉」的回复
        if (!uid) return false;
        var selector = '.renick a[href*="touserid=' + uid + '"], .renick a[href*="userinfo.aspx?touserid=' + uid + '"]';
        var links = document.querySelectorAll(selector);
        for (var i = 0; i < links.length; i++) {
            var replyEl = links[i].closest('.reline, .list-reply, .reline.list-reply, [data-floor]');
            if (!replyEl) continue;
            var text = getReplyText(replyEl);
            if (text && (text.indexOf('吃') >= 0 || text.indexOf('肉') >= 0)) {
                return true;
            }
        }
        return false;
    }
    function f_eatMeat() {
        if (!S.eatMeat || !isTopic()) return;
        var postId = location.pathname.match(/\/bbs-(\d+)/);
        if (!postId) return;
        var pid = postId[1];
        var today = new Date().toISOString().slice(0, 10);
        var cacheKey = 'yh_eat_' + pid;
        // localStorage 仅作为同一天快速跳过缓存，跨天自动失效（重新检查页面）
        if (localStorage.getItem(cacheKey) === today) return;
        // 先查页面上自己有没有已吃的回复
        var uid = getMyUidSync().uid || '';
        if (uid && hasEatenOnPage(pid, uid)) {
            localStorage.setItem(cacheKey, today);
            return;
        }
        var remainEl = document.querySelector('.yushuzi');
        if (!remainEl) return;
        var remain = parseInt(remainEl.textContent.trim());
        if (isNaN(remain) || remain <= 0) return;
        var words = ['吃', '肉'];
        var word = words[Math.floor(Math.random() * words.length)];
        var num = Math.floor(Math.random() * 10);
        var content = word + num;
        var ta = document.querySelector('textarea.retextarea');
        if (!ta) return;
        ta.value = content;
        ta.dispatchEvent(new Event('input', {bubbles:true}));
        var form = ta.closest('form');
        if (!form) return;
        var sub = form.querySelector('input[type="submit"][name="g"], button[type="submit"]');
        if (sub) sub.click(); else form.submit();
        localStorage.setItem(cacheKey, today);
        var p = remainEl.parentNode;
        if (p) {
            var tag = document.createElement('span');
            tag.style.cssText = 'color:#e74c3c;font-size:12px;margin-left:6px';
            tag.textContent = '🤖 已自动吃肉';
            p.appendChild(tag);
        }
    }

    // 9. 楼中楼整理（需全部评论加载完成后统一执行）
    function f_threadView(force) {
        if (!S.threadView || !isTopic()) return;
        if (document.querySelector('.yh-loading-all')) return; // 还在加载全部评论
        if (!force && document.querySelector('.yh-thread-tip')) return;
        if (!force && document.querySelector('.yh-thread-nest')) return;

        var recontent = document.querySelector('.recontent');
        if (!recontent) return;

        var replyNodes = document.querySelectorAll('.reline.list-reply, .list-reply, div[data-floor]');
        if (!replyNodes.length) return;

        var floorMap = {};
        for (var i = 0; i < replyNodes.length; i++) {
            var f = replyNodes[i].getAttribute('data-floor');
            if (f && !replyNodes[i].closest('.yh-thread-nest')) floorMap[f] = replyNodes[i];
        }

        var grouped = 0;
        for (var j = 0; j < replyNodes.length; j++) {
            var el = replyNodes[j];
            if (!el || el.closest('.yh-thread-nest')) continue;
            if (el.getAttribute('data-yh-threaded') === '1') continue;
            var reother = el.querySelector('.reother a');
            if (!reother) continue;
            var href = reother.getAttribute('href') || '';
            var m = href.match(/tofloor=(\d+)/);
            if (!m) continue;
            var targetFloor = m[1];
            var myFloor = el.getAttribute('data-floor');
            if (myFloor && myFloor === targetFloor) continue;
            var target = floorMap[targetFloor];
            if (!target) continue;

            var nest = target.querySelector(':scope > .yh-thread-nest') || target.querySelector('.yh-thread-nest');
            if (!nest) {
                nest = document.createElement('div');
                nest.className = 'yh-thread-nest yh-thread';
                nest.style.cssText = 'margin:2px 0 2px 10px;border-left:3px solid #1abc9c;padding:2px 0 2px 8px;background:rgba(26,188,156,.04);border-radius:0 8px 8px 0';
                target.appendChild(nest);
            }
            // 移动原节点进嵌套（比 clone 更干净，避免重复）
            var moved = el;
            // 若已有复读按钮等，保留
            nest.appendChild(moved);
            moved.style.display = '';
            moved.setAttribute('data-yh-threaded', '1');
            // 缩进样式
            moved.style.margin = '1px 0';
            moved.style.padding = '2px 6px';
            moved.style.background = 'rgba(255,255,255,.7)';
            moved.style.borderRadius = '6px';
            grouped++;
        }

        if (grouped > 0) {
            var old = document.querySelector('.yh-thread-tip');
            if (old) old.remove();
            var tip = document.createElement('div');
            tip.className = 'yh-thread-tip yh-thread';
            tip.style.cssText = 'padding:4px 10px;background:#f0faf6;border-radius:6px;font-size:11px;color:#1abc9c;margin-bottom:4px';
            tip.textContent = '📋 已整理 ' + grouped + ' 条楼中楼回复（全部评论加载后）';
            recontent.parentNode.insertBefore(tip, recontent);
        }
    }

    // 10. 楼主标识
    function f_opTag() {
        if (!S.opTag || !isTopic()) return;
        if (document.querySelector('.yh-loading-all')) return;
        var opLink = document.querySelector('.louzhuxinxi .louzhunicheng a');
        if (!opLink) return;
        var opNick = (opLink.textContent || '').trim();
        if (!opNick) return;
        var tagColor = S.opColor || '#1abc9c';
        var all = document.querySelectorAll('.reline, .list-reply, [data-floor]');
        for (var i = 0; i < all.length; i++) {
            if (all[i].querySelector('.yh-optag')) continue;
            var nickEl = all[i].querySelector('.renick a');
            if (!nickEl) continue;
            var nick = (nickEl.textContent || '').trim();
            if (nick === opNick) {
                var renick = all[i].querySelector('.renick');
                if (!renick) continue;
                var tag = document.createElement('span');
                tag.className = 'yh-optag';
                tag.textContent = '楼主';
                tag.style.cssText = 'display:inline-block;font-size:11px;color:#fff;background:' + tagColor + ';border-radius:3px;padding:0 5px;margin-left:4px;line-height:1.5;font-weight:normal';
                renick.appendChild(tag);
            }
        }
    }

    // 11. UBB 工具栏（回复页 + 发帖/编辑页）
    function insertAtCursor(ta, text, cursorOffset) {
        if (!ta) return;
        var start = (typeof ta.selectionStart === 'number') ? ta.selectionStart : (ta.value || '').length;
        var end = (typeof ta.selectionEnd === 'number') ? ta.selectionEnd : start;
        var val = ta.value || '';
        var selected = val.slice(start, end);
        var out = text;
        if (selected) {
            out = text
                .replace('加粗文字', selected)
                .replace('斜体文字', selected)
                .replace('下划线文字', selected)
                .replace('删除线文字', selected)
                .replace('颜色文字，默认红', selected)
                .replace('文本', selected)
                .replace('隐藏内容', selected)
                .replace('回复可见内容', selected)
                .replace('代码', selected);
        }
        ta.value = val.slice(0, start) + out + val.slice(end);
        var pos = start + (typeof cursorOffset === 'number' ? cursorOffset : out.length);
        try { ta.focus(); ta.setSelectionRange(pos, pos); } catch (e) {}
        try { ta.dispatchEvent(new Event('input', {bubbles:true})); } catch (e2) {}
        try { ta.dispatchEvent(new Event('change', {bubbles:true})); } catch (e3) {}
    }
    function findPostTextarea() {
        return document.querySelector('textarea[name="book_content"]') ||
            document.querySelector('textarea#book_content') ||
            document.querySelector('textarea[name="content"]') ||
            document.querySelector('form[action*="book_view"] textarea') ||
            document.querySelector('.textarea-actions') && document.querySelector('.textarea-actions').parentNode && document.querySelector('.textarea-actions').parentNode.querySelector('textarea') ||
            document.querySelector('#saveDraftButton') && document.querySelector('#saveDraftButton').form && document.querySelector('#saveDraftButton').form.querySelector('textarea') ||
            null;
    }
    function findReplyTextarea(isReplyPage) {
        if (isReplyPage) {
            return document.querySelector('textarea.retextarea') ||
                document.querySelector('textarea[name="content"]') ||
                document.querySelector('form[name="f"] textarea') ||
                document.querySelector('form textarea');
        }
        return findPostTextarea() || document.querySelector('textarea');
    }
    function findQuickReplyBox(ta, isReply) {
        if (!isReply) return null;
        var form = (ta && ta.closest) ? ta.closest('form') : null;
        var cands = [];
        var nodes = document.querySelectorAll('.kuaisuhuifu, .kuaisuhuifu .centered-container, #replyActions, .centered-container, .btBox, .bt2, .bt1');
        for (var i = 0; i < nodes.length; i++) cands.push(nodes[i]);
        // 含“快捷回复”文本的容器
        var all = document.querySelectorAll('div, section, form');
        for (var j = 0; j < all.length; j++) {
            var t = (all[j].textContent || '').replace(/\s+/g, '');
            if (t.indexOf('快捷回复') >= 0 && all[j].children && all[j].children.length && all[j].children.length < 40) {
                cands.push(all[j]);
            }
        }
        // 附件上传入口附近
        var fileA = document.querySelector("a[href*='book_re_addfile']");
        if (fileA && fileA.parentNode) cands.push(fileA.parentNode);
        // 优先：form 内、在 textarea 之后的块
        for (var k = 0; k < cands.length; k++) {
            var el = cands[k];
            if (!el) continue;
            if (form && form.contains && !form.contains(el) && el !== form) continue;
            // 不要选中整个页面大容器
            if (el === document.body || el === document.documentElement) continue;
            return el;
        }
        // fallback: textarea 后一个兄弟
        if (ta && ta.parentNode) return ta.parentNode;
        return form;
    }
    function placeUbbBar(bar, ta, isReply) {
        if (isReply) {
            var box = findQuickReplyBox(ta, true);
            if (box) {
                // 放到快捷回复容器下面
                if (box.parentNode) {
                    if (box.nextSibling) box.parentNode.insertBefore(bar, box.nextSibling);
                    else box.parentNode.appendChild(bar);
                    return;
                }
            }
            // 再退：插到回复表单末尾 / textarea 后面
            var form = (ta && ta.closest) ? ta.closest('form') : null;
            if (form) { form.appendChild(bar); return; }
            if (ta && ta.parentNode) {
                if (ta.nextSibling) ta.parentNode.insertBefore(bar, ta.nextSibling);
                else ta.parentNode.appendChild(bar);
                return;
            }
        } else {
            // 发帖页：正文框下方
            var anchor = document.querySelector('.textarea-actions') || document.querySelector('#saveDraftButton');
            if (ta && ta.parentNode) {
                if (ta.nextSibling) ta.parentNode.insertBefore(bar, ta.nextSibling);
                else ta.parentNode.appendChild(bar);
                return;
            }
            if (anchor && anchor.parentNode) {
                if (anchor.nextSibling) anchor.parentNode.insertBefore(bar, anchor.nextSibling);
                else anchor.parentNode.appendChild(bar);
                return;
            }
        }
        document.body.appendChild(bar);
    }
    function mountUbbBar(ta, isReply) {
        if (!ta || document.querySelector('.yh-ubb-bar')) return;
        var bar = document.createElement('div');
        bar.className = 'yh-ubb-bar';
        // 横向一排对齐，不换行优先；小屏可横向滚动
        bar.style.cssText = 'margin:8px 0 10px;padding:8px 10px;background:linear-gradient(180deg,#f7fffb,#eefaf6);border:1px solid #b8e6d8;border-radius:10px;box-shadow:0 1px 4px rgba(26,188,156,.12);position:relative;z-index:20;display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;justify-content:center;gap:8px;overflow-x:auto;-webkit-overflow-scrolling:touch;width:100%;box-sizing:border-box;';

        var tools = [
            {t:'UBB', c:'#1abc9c', act:'panel'},
            {t:'📷 图片', c:'#e74c3c', act:'img'},
            {t:'🎬 视频', c:'#9b59b6', act:'video'}
        ];
        if (isReply) tools.push({t:'+30', c:'#e67e22', act:'plus30'});

        // 上传弹窗（支持点击选择 + 拖入）
        function showUploadOverlay(type) {
            var isImg = type === 'img';
            var overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483647;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;';
            var box = document.createElement('div');
            box.style.cssText = 'background:#fff;border-radius:16px;padding:30px 24px;width:90%;max-width:360px;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,.25);position:relative';
            box.innerHTML = '<div style="font-size:40px;margin-bottom:10px">' + (isImg ? '🖼️' : '🎬') + '</div><div style="font-size:15px;font-weight:bold;color:#333;margin-bottom:4px">' + (isImg ? '上传图片' : '上传视频') + '</div><div style="font-size:12px;color:#999;margin-bottom:16px">点击选择文件，或将文件拖到这里</div><div class="yh-drop-zone" style="border:2px dashed #ddd;border-radius:12px;padding:30px 16px;margin-bottom:12px;background:#fafafa;transition:all .2s;cursor:pointer"><div style="font-size:14px;color:#1abc9c;font-weight:bold">📎 点击选择文件</div><div style="font-size:11px;color:#bbb;margin-top:4px">或拖入文件到此处</div></div><div style="font-size:11px;color:#ccc">' + (isImg ? '支持 JPG / PNG / GIF' : '支持 MP4 / AVI / MOV') + '</div>';
            overlay.appendChild(box);
            document.body.appendChild(overlay);
            var zone = box.querySelector('.yh-drop-zone');
            var fileInput2 = document.createElement('input');
            fileInput2.type = 'file';
            fileInput2.accept = isImg ? 'image/*' : 'video/*';
            fileInput2.style.display = 'none';
            box.appendChild(fileInput2);
            function doUpload(file) {
                if (!file) return;
                var curTa = findReplyTextarea(isReply) || ta;
                if (!curTa) { alert('未找到输入框'); close(); return; }
                zone.innerHTML = '<div style="font-size:13px;color:#1abc9c;font-weight:bold">⏳ 上传中...</div>';
                var fd = new FormData();
                fd.append('file', file);
                xhr({
                    method:'POST', url:'https://tc.qdqqd.com/uploadmt',
                    data: fd,
                    onload:function(res){
                        try {
                            var data = JSON.parse(res.responseText);
                            var url = (data.data || '').split(/\s+/)[0] || '';
                            if (url) {
                                insertAtCursor(curTa, '\n' + (isImg ? '[img]' + url + '[/img]' : '[media]' + url + '[/media]') + '\n');
                            }
                        } catch(e) {}
                        close();
                    },
                    onerror:function(){ close(); },
                    ontimeout:function(){ close(); }
                });
            }
            function close() { try { overlay.remove(); hideDropZone(); } catch(e) {} }
            // 安全兜底：30秒后自动关闭
            setTimeout(function() { try { overlay.remove(); hideDropZone(); } catch(e) {} }, 30000);
            // 点击选择文件
            zone.addEventListener('click', function() { fileInput2.click(); });
            fileInput2.addEventListener('change', function() { if (this.files && this.files[0]) doUpload(this.files[0]); this.value = ''; });
            // 拖入支持
            zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.style.borderColor = '#1abc9c'; zone.style.background = '#e8f8f5'; });
            zone.addEventListener('dragleave', function() { zone.style.borderColor = '#ddd'; zone.style.background = '#fafafa'; });
            zone.addEventListener('drop', function(e) {
                e.preventDefault();
                e.stopPropagation();
                zone.style.borderColor = '#ddd'; zone.style.background = '#fafafa';
                hideDropZone();
                var files = e.dataTransfer && e.dataTransfer.files;
                if (files && files.length) doUpload(files[0]);
            });
            // 点击遮罩关闭
            overlay.addEventListener('click', function(e) { if (e.target === overlay) close(); });
        }

        tools.forEach(function(item) {
            var b = document.createElement('button');
            b.type = 'button';
            b.textContent = item.t;
            b.style.cssText = 'flex:0 0 auto;white-space:nowrap;border:none;border-radius:8px;padding:7px 12px;background:' + item.c + ';color:#fff;font-size:12px;font-weight:bold;cursor:pointer;line-height:1.2;-webkit-tap-highlight-color:transparent;touch-action:manipulation;box-shadow:0 1px 3px rgba(0,0,0,.12)';
            b.addEventListener('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                var curTa = findReplyTextarea(isReply) || ta;
                if (item.act === 'panel') toggleUBBPanel();
                else if (item.act === 'img' || item.act === 'video') showUploadOverlay(item.act);
                else if (item.act === 'plus30') {
                    curTa.value = '+30';
                    try { curTa.dispatchEvent(new Event('input', {bubbles:true})); } catch (err) {}
                    var form = curTa.closest('form');
                    if (!form) return;
                    var sub = form.querySelector('input[type="submit"][name="g"], input[type="submit"], button[type="submit"]');
                    if (sub) sub.click(); else form.submit();
                }
            });
            bar.appendChild(b);
        });
        placeUbbBar(bar, ta, isReply);

        // 拖入上传支持 - 全页面拖放
        function handleDropFile(file) {
            if (!file) return;
            var curTa = findReplyTextarea(isReply) || ta;
            if (!curTa) { alert('未找到输入框'); return; }
            var fd = new FormData(); fd.append('file', file);
            xhr({
                method:'POST', url:'https://tc.qdqqd.com/uploadmt', data:fd,
                onload:function(res){
                    try {
                        var data = JSON.parse(res.responseText);
                        var url = (data.data || '').split(/\s+/)[0] || '';
                        if (url) {
                            var tag = file.type.indexOf('image/') === 0 ? 'img' : 'media';
                            insertAtCursor(curTa, '\n[' + tag + ']' + url + '[/' + tag + ']\n');
                        } else alert('上传失败');
                    } catch(e) { alert('上传失败'); }
                },
                onerror:function(){ alert('上传失败'); }
            });
        }
        // 页面级拖放检测
        var dropZone = null;
        function showDropZone() {
            if (!dropZone) {
                dropZone = document.createElement('div');
                dropZone.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483647;background:rgba(26,188,156,.15);border:4px dashed #1abc9c;box-sizing:border-box;display:flex;align-items:center;justify-content:center;pointer-events:none;font-size:24px;color:#1abc9c;font-weight:bold;text-shadow:0 2px 8px rgba(0,0,0,.1)';
                dropZone.textContent = '📎 松开上传';
                document.body.appendChild(dropZone);
            }
            dropZone.style.display = 'flex';
        }
        function hideDropZone() { if (dropZone) dropZone.style.display = 'none'; }
        document.addEventListener('dragenter', function(e) {
            if (e.dataTransfer && e.dataTransfer.types) {
                for (var i = 0; i < e.dataTransfer.types.length; i++) {
                    if (e.dataTransfer.types[i] === 'Files') { showDropZone(); break; }
                }
            }
        });
        document.addEventListener('dragleave', function(e) {
            if (!e.relatedTarget || e.relatedTarget === document.documentElement) hideDropZone();
        });
        document.addEventListener('dragover', function(e) { e.preventDefault(); });
        document.addEventListener('drop', function(e) {
            e.preventDefault();
            hideDropZone();
            var files = e.dataTransfer && e.dataTransfer.files;
            if (files && files.length) handleDropFile(files[0]);
        });
        if (ta) {
            ta.addEventListener('dragover', function(e) { e.preventDefault(); ta.style.outline = '2px dashed #1abc9c'; });
            ta.addEventListener('dragleave', function() { ta.style.outline = ''; });
            ta.addEventListener('drop', function(e) {
                e.preventDefault();
                ta.style.outline = '';
            });
        }
    }

    function f_ubb() {
        if (!S.ubbHelp) return;
        var path = location.pathname || '';
        var href = location.href || '';
        var isPost = isPostPage() || /book_view_add/i.test(path) || /book_view_mod/i.test(path) || /book_view_add/i.test(href) || /book_view_mod/i.test(href);
        var isReply = !isPost && isTopic();
        if (!isReply && !isPost) return;
        if (document.querySelector('.yh-ubb-bar')) return;
        var ta = findReplyTextarea(isReply);
        if (!ta) return; // run() 会每 2s 重试，等发帖页 textarea 渲染出来
        mountUbbBar(ta, isReply);
    }

    var _ubbPanelVisible = false;
    function toggleUBBPanel() {
        if (_ubbPanelVisible) { var old = document.querySelector('.yh-ubb-panel-wrap'); if (old) old.remove(); _ubbPanelVisible = false; return; }
        var wrap = document.createElement('div');
        wrap.className = 'yh-ubb-panel-wrap';
        wrap.style.cssText = 'position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,.4);display:flex;align-items:flex-end;justify-content:center;';
        var panel = document.createElement('div');
        panel.className = 'yh-ubb-panel';
        panel.style.cssText = 'width:100%;max-width:520px;max-height:78vh;overflow:auto;background:#fff;border-radius:16px 16px 0 0;box-shadow:0 -8px 30px rgba(0,0,0,.2);padding:0 0 16px';
        var groups = [
            {title:'文字', items:[
                {l:'粗体', tag:'[b]加粗文字[/b]', off:3},
                {l:'斜体', tag:'[i]斜体文字[/i]', off:3},
                {l:'下划线', tag:'[u]下划线文字[/u]', off:3},
                {l:'删除线', tag:'[strike]删除线文字[/strike]', off:9},
                {l:'颜色', tag:'[forecolor=red]颜色文字，默认红[/forecolor]', off:15},
                {l:'字体', tag:'[font=serif]文本[/font]', off:12},
                {l:'大小', tag:'[size=5]文本[/size]', off:8},
            ]},
            {title:'布局', items:[
                {l:'居左', tag:'[left]文本[/left]', off:6},
                {l:'居中', tag:'[center]文本[/center]', off:8},
                {l:'居右', tag:'[right]文本[/right]', off:7},
                {l:'换行', tag:'[br]', off:4},
                {l:'分割线', tag:'[hr]', off:4},
                {l:'引用', tag:'[quote]文本[/quote]', off:7},
                {l:'代码', tag:'[code]代码[/code]', off:6},
            ]},
            {title:'媒体', items:[
                {l:'链接', tag:'[url=https://]文本[/url]', off:12},
                {l:'图片', tag:'[img]https://[/img]', off:5},
                {l:'音频', tag:'[audio=X]音频直链地址[/audio]', off:9},
                {l:'视频', tag:'[movie=100%*100%]视频直链地址|封面图片地址[/movie]', off:15},
                {l:'媒体', tag:'[media]https://[/media]', off:7},
            ]},
            {title:'特效/权限', items:[
                {l:'飞行', tag:'[fly]文本[/fly]', off:5},
                {l:'移动', tag:'[move]文本[/move]', off:6},
                {l:'闪光', tag:'[flash]文本[/flash]', off:7},
                {l:'隐藏', tag:'[hide]隐藏内容[/hide]', off:6},
                {l:'回复可见', tag:'[reply]回复可见内容[/reply]', off:7},
                {l:'时间', tag:'当前系统日期和时间：[now]', off:0},
                {l:'倒计天', tag:'倒计天：[codo]2030-01-01[/codo]', off:0},
            ]},
        ];
        var html = '<div style="padding:14px 16px;background:linear-gradient(135deg,#1abc9c,#16a085);color:#fff;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:2"><div><div style="font-size:16px;font-weight:bold">UBB 代码</div><div style="font-size:11px;opacity:.9;margin-top:2px">点标签插入到输入框</div></div><span class="yh-ubb-close" style="font-size:24px;cursor:pointer;line-height:1;padding:4px">&times;</span></div>';
        html += '<div style="padding:10px 14px 0"><a href="https://yaohuo.me/bbs/book_view_ubb.aspx?classid=177" target="_blank" style="display:inline-block;margin-bottom:8px;font-size:12px;color:#1abc9c;text-decoration:none;background:#e8f8f5;border:1px solid #b8e6d8;border-radius:999px;padding:4px 10px">📖 官方 UBB 说明</a></div>';
        groups.forEach(function(g) {
            html += '<div style="padding:6px 14px 2px;font-size:12px;color:#888;font-weight:bold">' + g.title + '</div><div style="padding:4px 12px 10px;display:flex;flex-wrap:wrap;gap:8px">';
            g.items.forEach(function(it) {
                html += '<button type="button" class="yh-ubb-code" data-tag="' + it.tag.replace(/"/g,'&quot;') + '" data-off="' + (it.off||0) + '" style="padding:7px 12px;border:1px solid #e5e7eb;border-radius:999px;background:#f8fafc;color:#334155;cursor:pointer;font-size:12px;font-weight:600">' + it.l + '</button>';
            });
            html += '</div>';
        });
        panel.innerHTML = html;
        wrap.appendChild(panel);
        document.body.appendChild(wrap);
        _ubbPanelVisible = true;
        function close() { wrap.remove(); _ubbPanelVisible = false; }
        panel.querySelector('.yh-ubb-close').addEventListener('click', close);
        wrap.addEventListener('click', function(e) { if (e.target === wrap) close(); });
        panel.querySelectorAll('.yh-ubb-code').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var tag = this.getAttribute('data-tag');
                var off = parseInt(this.getAttribute('data-off') || '0', 10);
                var isPost = isPostPage() || /book_view_add|book_view_mod/i.test(location.pathname + location.href);
                var ta2 = findReplyTextarea(!isPost) || findPostTextarea() || document.querySelector('textarea');
                insertAtCursor(ta2, tag, off);
                close();
            });
        });
    }

    // ====== 设置面板 ======

    // —— 更新检测 ——
    function parseScriptVersion(src) {
        if (!src) return '';
        var m = String(src).match(/@version\s+([0-9]+(?:\.[0-9]+)+)/);
        return m ? m[1] : '';
    }
    function cmpVersion(a, b) {
        // >0 remote newer, 0 equal, <0 remote older
        var pa = String(a || '0').split('.'), pb = String(b || '0').split('.');
        var n = Math.max(pa.length, pb.length);
        for (var i = 0; i < n; i++) {
            var x = parseInt(pa[i] || '0', 10) || 0;
            var y = parseInt(pb[i] || '0', 10) || 0;
            if (x > y) return 1;
            if (x < y) return -1;
        }
        return 0;
    }
    function fetchRemoteVersion(cb) {
        // 拉取全部镜像，取 @version 最高者（避免 jsDelivr 旧缓存被当成“最新”）
        var urls = YH_UPDATE_MIRRORS.slice();
        var left = urls.length;
        var lastErr = '';
        var best = null; // {version, url, raw}
        if (!urls.length) {
            cb(null, '无更新源');
            return;
        }
        function doneOne() {
            left--;
            if (left > 0) return;
            if (best && best.version) cb(best, null);
            else cb(null, lastErr || '全部源失败');
        }
        for (var ui = 0; ui < urls.length; ui++) {
            (function(base) {
                var url = base + (base.indexOf('?') >= 0 ? '&' : '?') + 't=' + Date.now();
                xhr({
                    method: 'GET', url: url, timeout: 15000,
                    onload: function(res) {
                        try {
                            var body = res.responseText || '';
                            if (res.status >= 400 || !body) {
                                lastErr = 'HTTP ' + (res.status || 0) + ' @' + base.replace(/^https?:\/\//, '').slice(0, 24);
                                doneOne();
                                return;
                            }
                            // 有的环境 status=0 但 body 有内容（file/特殊 webview）
                            var ver = parseScriptVersion(body);
                            if (!ver) {
                                lastErr = '无法解析 @version';
                                doneOne();
                                return;
                            }
                            if (!best || cmpVersion(ver, best.version) > 0) {
                                best = { version: ver, url: base, raw: body.length };
                            }
                            try { console.log('[YH] update source', ver, base); } catch (eLog) {}
                        } catch (e2) {
                            lastErr = '解析异常';
                        }
                        doneOne();
                    },
                    onerror: function() {
                        lastErr = '网络错误';
                        doneOne();
                    },
                    ontimeout: function() {
                        lastErr = '超时';
                        doneOne();
                    }
                });
            })(urls[ui]);
        }
    }
    function markUpdateChecked() {
        try { localStorage.setItem(YH_UPDATE_CHECK_KEY, String(Date.now())); } catch (e) {}
    }
    function shouldAutoCheckUpdate() {
        if (!S.autoUpdate) return false;
        if (_autoUpdateRanThisPage) return false;
        // 一天最多检测一次
        try {
            var last = parseInt(localStorage.getItem(YH_UPDATE_CHECK_KEY) || '0', 10);
            if (last > 0 && Date.now() - last < 86400000) return false;
        } catch (e) {}
        return true;
    }
    function showUpdateResult(remote, err, manual) {
        if (err) {
            showInfo((manual ? '手动' : '自动') + '检测失败：' + err + '\n当前版本：' + YH_VERSION + '\n【国内安装】打开安装:' + YH_UPDATE_URL_CN + '\n【GitHub】打开安装:' + YH_UPDATE_URL, '🔄 检测更新');
            return;
        }
        var remoteVer = remote.version;
        var c = cmpVersion(remoteVer, YH_VERSION);
        markUpdateChecked();
        if (c > 0) {
            showInfo('发现新版本！\n【当前】' + YH_VERSION + '\n【最新】' + remoteVer + '\n【国内安装】打开安装:' + YH_UPDATE_URL_CN + '\n【GitHub】打开安装:' + YH_UPDATE_URL + '\n提示：国内无代理请用「国内安装」链接覆盖安装', '🔄 检测更新');
        } else if (manual) {
            showInfo('已是最新\n【当前】' + YH_VERSION + '\n【远程】' + remoteVer + '\n【国内安装】打开安装:' + YH_UPDATE_URL_CN + '\n【GitHub】打开安装:' + YH_UPDATE_URL, '🔄 检测更新');
        } else {
            try { console.log('[YH] autoUpdate up-to-date', YH_VERSION, remoteVer); } catch (e) {}
        }
    }
    function checkUpdate(manual) {
        // 手动：先关设置，再出进度/结果，避免多层弹窗叠在一起
        if (manual) {
            try { closeSettingsPanel(); } catch (eClose) {}
            try { showInfo('正在检测更新…\n当前 v' + YH_VERSION, '🔄 检测更新'); } catch (e0) {}
        }
        fetchRemoteVersion(function(remote, err) {
            // 关掉「正在检测」再出结果
            try {
                var infos = document.querySelectorAll('.yh-info-overlay');
                for (var i = 0; i < infos.length; i++) {
                    if (infos[i] && infos[i].parentNode) infos[i].parentNode.removeChild(infos[i]);
                }
            } catch (e1) {}
            showUpdateResult(remote, err, !!manual);
        });
    }
    function f_autoUpdate() {
        if (inIframe) return;
        if (!shouldAutoCheckUpdate()) return;
        _autoUpdateRanThisPage = true; // 立刻占坑，避免 boot/run 重复排队
        // 延迟一点，避免抢首屏；仍只触发一次 checkUpdate(false)
        setTimeout(function() { checkUpdate(false); }, 2500);
    }

    var _settingsOpen = false;
    function closeSettingsPanel() {
        try {
            var ov = document.querySelector('.yh-settings-overlay');
            if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
        } catch (e) {}
        _settingsOpen = false;
    }
    // 设置按钮透明度
    function applyBtnOpacity(val) {
        val = parseFloat(val) || 1;
        if (val < 0.05) val = 0.05;
        if (val > 1) val = 1;
        var vs = String(val) + ' !important';
        try {
            var all = document.querySelectorAll('.yh-settings-btn, .yh-btn-group button');
            for (var i = 0; i < all.length; i++) {
                all[i].style.setProperty('opacity', String(val), 'important');
            }
        } catch (e) {}
    }
    function ensureSettingsCss() {

        if (document.getElementById('yh-settings-btn-global-css')) return;
        var st = document.createElement('style');
        st.id = 'yh-settings-btn-global-css';
        st.textContent = '.yh-settings-btn{position:fixed!important;left:15px!important;bottom:15px!important;right:auto!important;top:auto!important;z-index:2147483000!important;width:44px!important;height:44px!important;border:1px solid #bbb!important;border-radius:50%!important;background:#fff!important;color:#333!important;font-size:22px!important;box-shadow:0 2px 12px rgba(0,0,0,.2)!important;display:flex!important;align-items:center!important;justify-content:center!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important;}';        
        (document.head || document.documentElement).appendChild(st);
    }
    function ensureSettingsBtn() {
        ensureSettingsCss();
        var exist = document.querySelector('.yh-settings-btn');
        if (exist) {
            // 列表页偶发被站内 CSS 隐藏，强制拉回
            exist.style.setProperty('display', 'flex', 'important');
            exist.style.setProperty('visibility', 'visible', 'important');
            exist.style.setProperty('opacity', '1', 'important');
            exist.style.setProperty('z-index', '2147483000', 'important');
            exist.style.setProperty('pointer-events', 'auto', 'important');
            applyBtnOpacity(S.btnOpacity);
            // 恢复保存的位置。由于 left/bottom 不再用 !important，拖拽可正常覆盖，2s 间隔不会抢拖拽位置
            try {
                var saved = JSON.parse(localStorage.getItem('yh_btn_pos') || 'null');
                if (saved && saved.left && saved.bottom) {
                    exist.style.setProperty('left', saved.left, 'important');
                    exist.style.setProperty('bottom', saved.bottom, 'important');
                    exist.style.setProperty('right', 'auto', 'important');
                    exist.style.setProperty('top', 'auto', 'important');
                }
            } catch (ePos) {}
            return;
        }
        var host = document.body || document.documentElement;
        if (!host) return;
        var btn = document.createElement('div');
        btn.className = 'yh-settings-btn';
        btn.title = '设置';
        btn.textContent = '⚙';
        applyBtnOpacity(S.btnOpacity);
        btn.style.cssText = 'position:fixed!important;left:15px;bottom:15px;right:auto!important;top:auto!important;z-index:2147483000!important;width:44px!important;height:44px!important;border:1px solid #bbb!important;border-radius:50%!important;background:#ffffff!important;color:#333!important;font-size:22px!important;box-shadow:0 2px 12px rgba(0,0,0,.2)!important;display:flex!important;align-items:center!important;justify-content:center!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important;user-select:none!important;-webkit-user-select:none!important;cursor:pointer!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;';
        try {
            var saved = JSON.parse(localStorage.getItem('yh_btn_pos') || 'null');
            if (saved && saved.left && saved.bottom) {
                btn.style.setProperty('left', saved.left, 'important');
                btn.style.setProperty('bottom', saved.bottom, 'important');
                btn.style.setProperty('right', 'auto', 'important');
                btn.style.setProperty('top', 'auto', 'important');
            }
        } catch (ePos) {}
        var _drag = {active:false, moved:false, startX:0, startY:0, origLeft:0, origBottom:0};
        function startDrag(e) {
            var touch = e.touches ? e.touches[0] : e;
            _drag.active = true; _drag.moved = false;
            _drag.startX = touch.clientX; _drag.startY = touch.clientY;
            var rect = btn.getBoundingClientRect();
            _drag.origLeft = rect.left; _drag.origBottom = window.innerHeight - rect.bottom;
        }
        function moveDrag(e) {
            if (!_drag.active) return;
            var touch = e.touches ? e.touches[0] : e;
            var dx = touch.clientX - _drag.startX, dy = touch.clientY - _drag.startY;
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) _drag.moved = true;
            var newLeft = Math.max(0, Math.min(window.innerWidth - 44, _drag.origLeft + dx));
            var newBottom = Math.max(0, Math.min(window.innerHeight - 44, _drag.origBottom - dy));
            btn.style.setProperty('left', newLeft + 'px', 'important');
            btn.style.setProperty('bottom', newBottom + 'px', 'important');
            btn.style.setProperty('right', 'auto', 'important');
            btn.style.setProperty('top', 'auto', 'important');
            if (e.cancelable) e.preventDefault();
        }
        function endDrag() { _drag.active = false; if (_drag.moved) { try { var cs = window.getComputedStyle(btn); var p = {left:cs.left,bottom:cs.bottom}; localStorage.setItem('yh_btn_pos', JSON.stringify(p)); } catch (e) {} } }
        btn.addEventListener('mousedown', startDrag);
        btn.addEventListener('touchstart', startDrag, {passive:true});
        document.addEventListener('mousemove', moveDrag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', moveDrag, {passive:false});
        document.addEventListener('touchend', endDrag);
        function openSettings() {
            if (_drag.moved) return;
            if (_settingsOpen) return;
            _settingsOpen = true;
            var overlay = document.createElement('div');
            overlay.className = 'yh-settings-overlay';
            overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483646;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;';
            var box = document.createElement('div');
            box.style.cssText = 'background:#fff;border-radius:14px;padding:0;width:100%;max-width:400px;max-height:80vh;overflow:auto;box-shadow:0 10px 36px rgba(0,0,0,.22)';
            var items = [
                // 浏览
                {k:'newTab', l:'🔗 新标签打开', g:'浏览', refresh:1},
                {k:'splitView', l:'📺 分屏预览', g:'浏览', refresh:1},
                {k:'floatPreview', l:'🪟 浮窗预览', g:'浏览', refresh:1},
                {k:'showTime', l:'🕐 列表时间显示', g:'浏览', sub:1},
                // 分屏（仅分屏开启时显示）
                {k:'splitRatio', l:'📐 左侧占比%', g:'分屏', range:1, min:20, max:60, step:1, dep:'splitView'},
                {k:'splitPadding', l:'📏 左侧边距(px)', g:'分屏', range:1, min:0, max:50, step:1, dep:'splitView'},
                // 界面：主开关 + 子选项（sub 对齐）                // 界面：主开关 + 子选项（sub 对齐）
                {k:'topBtn', l:'🔘 浮动按钮', g:'界面'},
                {k:'levelBtn', l:'📊 等级查询', g:'界面', sub:1},
                {k:'opTag', l:'🏷️ 楼主标签', g:'界面', sub:1},
                {k:'ubbHelp', l:'🎨 UBB 工具栏', g:'界面', sub:1},
                {k:'btnOpacity', l:'⚙ 设置按钮不透明度', g:'界面', sub:1, range:1},
                {k:'opColor', l:'🎨 楼主标签颜色', g:'界面', sub:1, color:1},
                {k:'plusColor', l:'🎨 +1 按钮颜色', g:'界面', sub:1, color:1},
                // 评论
                {k:'loadAll', l:'📥 加载全部评论', g:'评论'},
                {k:'threadView', l:'📋 楼中楼整理', g:'评论'},
                {k:'repeat', l:'🔁 复读机', g:'评论'},
                {k:'fillReply', l:'📋 复制评论', g:'评论', sub:1},
                {k:'lazyLoad', l:'📜 自动加载更多', g:'评论'},
                {k:'eatMeat', l:'🥩 自动吃肉', g:'评论'},
                {k:'imgZoom', l:'🖼️ 图片点击放大', g:'评论', sub:1},
                // 更新
                {k:'autoUpdate', l:'🔄 自动检测更新', g:'更新'},
            ];
            // 按组归类
            var groups = {};
            items.forEach(function(it) {
                if (!groups[it.g]) groups[it.g] = [];
                groups[it.g].push(it);
            });
            var html = '<div style="padding:14px 16px;background:linear-gradient(135deg,#1abc9c,#16a085);color:#fff;font-size:15px;font-weight:bold;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:2;border-radius:14px 14px 0 0"><span>⚙ 设置 <small style="opacity:.8;font-weight:normal;font-size:11px">v0.9.192</small></span><span class="yh-settings-close" style="cursor:pointer;font-size:22px;line-height:1;padding:0 4px;opacity:.8;transition:opacity .15s">&times;</span></div><div style="padding:6px 14px 14px">';
            var groupNames = {浏览:'浏览', 分屏:'分屏', 界面:'界面', 评论:'评论', 更新:'更新'};
            var groupOrder = ['浏览', '分屏', '界面', '评论', '更新'];
            groupOrder.forEach(function(g) {
                if (!groups[g] || !groups[g].length) return;
                if (g === '分屏' && !S.splitView) return;
                // 卡片开始
                html += '<div style="margin:10px 0;border-radius:10px;overflow:hidden;border:1px solid #ecf0f1;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.04)">';
                // 卡片标题
                html += '<div style="padding:8px 12px;background:#f8fafb;border-bottom:1px solid #ecf0f1;font-size:11px;font-weight:bold;color:#7f8c8d;letter-spacing:1px;display:flex;align-items:center;gap:6px">';
                var icons = {浏览:'📖', 分屏:'🖥️', 界面:'🎨', 评论:'💬', 更新:'🔄'};
                html += '<span style="font-size:13px">' + (icons[g]||'') + '</span><span>' + groupNames[g] + '</span></div>';
                // 列表项
                html += '<div style="display:flex;flex-direction:column">';
                groups[g].forEach(function(item) {
                    var isSub = !!item.sub || (item.l && item.l.indexOf('   ') === 0);
                    var label = (item.l || '').replace(/^\s+/, '');
                    var isRange = !!item.range;
                    // 子项缩进
                    var padLeft = isSub ? 'padding-left:28px' : '';
                                        html += '<div style="display:flex;align-items:center;min-height:36px;padding:4px 12px;' + padLeft + ';border-bottom:1px solid #f5f5f5;transition:background .12s" class="yh-setting-row">';
                    if (isRange) {
                        var curVal = (S[item.k] !== undefined ? S[item.k] : 1);
                        var minV = item.min !== undefined ? item.min : 0.05;
                        var maxV = item.max !== undefined ? item.max : 1;
                        var stepV = item.step !== undefined ? item.step : 0.01;
                        var isPct = maxV > 1;
                        var displayVal = isPct ? Math.round(curVal) : (stepV >= 1 ? Math.round(curVal) : Math.round(curVal * 100));
                        var displaySuffix = isPct ? '' : '%';
                        html += '<span style="font-size:12px;color:#555;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + label + '</span>';
                        html += '<span class="yh-opacity-val" style="font-size:11px;font-weight:bold;color:#1abc9c;margin:0 8px;min-width:30px;text-align:right">' + displayVal + displaySuffix + '</span>';
                        html += '<input type="range" class="yh-set-range" data-key="' + item.k + '" min="' + minV + '" max="' + maxV + '" step="' + stepV + '" value="' + curVal + '" style="width:90px;height:4px;appearance:auto;-webkit-appearance:auto;accent-color:#1abc9c;background:#e8e8e8;border-radius:2px;cursor:pointer;flex-shrink:0">';
                    } else if (item.color) {
                        var curColor = S[item.k] || '#1abc9c';
                        html += '<span style="font-size:12px;color:#555;flex:1;min-width:0">' + label + '</span>';
                        html += '<input type="color" class="yh-set-color" data-key="' + item.k + '" value="' + curColor + '" style="width:28px;height:28px;padding:0;border:2px solid #e8e8e8;border-radius:6px;cursor:pointer;background:none;flex-shrink:0">';
                    } else {
                        var checked = S[item.k] ? 'checked' : '';
                        var isOn = S[item.k] ? 1 : 0;
                        html += '<span style="font-size:12px;color:#' + (isSub ? '888' : '333') + ';flex:1;min-width:0">' + label + '</span>';
                        // Toggle switch
                        html += '<label style="position:relative;display:inline-block;width:34px;height:20px;flex-shrink:0;cursor:pointer">';
                        html += '<input type="checkbox" class="yh-set" data-key="' + item.k + '" ' + checked + ' data-refresh="' + (item.refresh||'') + '" style="opacity:0;width:0;height:0;position:absolute">';
                        html += '<span class="yh-toggle-slider" style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:' + (isOn ? '#1abc9c' : '#d5d5d5') + ';border-radius:20px;transition:background .25s"></span>';
                        html += '<span class="yh-toggle-knob" style="position:absolute;content:\"\";height:16px;width:16px;left:2px;bottom:2px;background:#fff;border-radius:50%;transition:transform .25s;box-shadow:0 1px 3px rgba(0,0,0,.2);transform:' + (isOn ? 'translateX(14px)' : 'translateX(0)') + '"></span>';
                        html += '</label>';
                    }
                    html += '</div>';
                });
                html += '</div></div>';
            });
            // 底部：版本 + 更新按钮
            html += '<div style="margin-top:12px;padding:12px;border-radius:10px;border:1px solid #ecf0f1;background:#fafcfe;text-align:center">';
            html += '<div style="font-size:11px;color:#aaa;margin-bottom:8px">v' + YH_VERSION + ' · Embrace/19299</div>';
            html += '<button type="button" class="yh-check-update" style="width:100%;height:36px;border:none;border-radius:8px;background:linear-gradient(135deg,#1abc9c,#16a085);color:#fff;font-size:13px;font-weight:bold;cursor:pointer;transition:opacity .2s;box-shadow:0 2px 8px rgba(26,188,156,.25)">🔍 手动检测更新</button>';
            html += '<a class="yh-update-link" href="' + YH_UPDATE_URL_CN + '?_=' + Date.now() + '" target="_blank" rel="noopener" style="display:block;margin-top:8px;font-size:12px;color:#1abc9c;text-decoration:none">国内安装地址（推荐）</a>';
            html += '<a class="yh-update-link-gh" href="' + YH_UPDATE_URL + '?_=' + Date.now() + '" target="_blank" rel="noopener" style="display:block;margin-top:4px;font-size:11px;color:#bbb;text-decoration:none">GitHub raw（需代理）</a>';
            html += '</div>';
            html += '</div>';
            // 设置面板样式
            var _styleSheet = document.getElementById('yh-settings-style');
            if (!_styleSheet) {
                _styleSheet = document.createElement('style');
                _styleSheet.id = 'yh-settings-style';
                _styleSheet.textContent = '.yh-setting-row:hover{background:#f5f8fc}';
                document.head.appendChild(_styleSheet);
            }
            box.innerHTML = html;
            overlay.appendChild(box);
            document.body.appendChild(overlay);
            function close() { try { overlay.remove(); } catch (e) {} _settingsOpen = false; }
            box.querySelector('.yh-settings-close').addEventListener('click', close);
            overlay.addEventListener('click', function(e) { if (e.target === overlay) close(); });
            // 自动保存：checkbox 变动即保存，部分选项自动刷新页面
            box.querySelectorAll('.yh-set').forEach(function(el) {
                el.addEventListener('change', function() {
                    var on = el.checked ? 1 : 0;
                    S[el.getAttribute('data-key')] = on;
                    save();
                    // 更新切换开关视觉
                    var label = el.parentNode;
                    if (label) {
                        var slider = label.querySelector('.yh-toggle-slider');
                        var knob = label.querySelector('.yh-toggle-knob');
                        if (slider) slider.style.background = on ? '#1abc9c' : '#d5d5d5';
                        if (knob) knob.style.transform = on ? 'translateX(14px)' : 'translateX(0)';
                    }
                    if (el.getAttribute('data-refresh') === '1') {
                        setTimeout(function() { location.reload(); }, 200);
                    }
                });
                // 初始同步视觉
                var label = el.parentNode;
                if (label) {
                    var on = el.checked ? 1 : 0;
                    var slider = label.querySelector('.yh-toggle-slider');
                    var knob = label.querySelector('.yh-toggle-knob');
                    if (slider) slider.style.background = on ? '#1abc9c' : '#d5d5d5';
                    if (knob) knob.style.transform = on ? 'translateX(14px)' : 'translateX(0)';
                }
            });
            box.querySelectorAll('.yh-set-range').forEach(function(el) {
                function updateRange() {
                    var val = parseFloat(el.value) || 1;
                    var key = el.getAttribute('data-key');
                    S[key] = val;
                    save();
                    if (key === 'btnOpacity') {
                        applyBtnOpacity(val);
                    } else if (key === 'splitRatio' || key === 'splitPadding') {
                        applySplitStyle();
                    }
                    var display = el.parentNode.querySelector('.yh-opacity-val');
                    if (display) {
                        var isPct = parseFloat(el.getAttribute('max')) > 1;
                        display.textContent = isPct ? Math.round(val) : Math.round(val * 100) + '%';
                    }
                }
                el.addEventListener('input', updateRange);
                el.addEventListener('change', updateRange);
            });
            box.querySelectorAll('.yh-set-color').forEach(function(el) {
                function updateColor() {
                    var val = el.value || '#1abc9c';
                    S[el.getAttribute('data-key')] = val;
                    save();
                }
                el.addEventListener('input', updateColor);
                el.addEventListener('change', updateColor);
            });
            var chkBtn = box.querySelector('.yh-check-update');
            if (chkBtn) {
                var _chkBusy = false;
                var tapChk = function(e) {
                    if (e) { e.preventDefault(); e.stopPropagation(); }
                    if (_chkBusy) return;
                    _chkBusy = true;
                    chkBtn.textContent = '检测中…';
                    checkUpdate(true);
                    setTimeout(function() {
                        _chkBusy = false;
                        chkBtn.textContent = '🔍 手动检测更新';
                    }, 2000);
                };
                chkBtn.addEventListener('click', tapChk);
                chkBtn.addEventListener('touchend', tapChk, {passive:false});
            }
        }
        btn.addEventListener('click', openSettings);
        btn.addEventListener('touchend', function(e) {
            if (_drag.moved) return;
            e.preventDefault();
            openSettings();
        });
        host.appendChild(btn);
    }
    function initSettings() { if (inIframe) return; ensureSettingsBtn(); }

    // 8.5 浮窗预览（类似分屏，但列表遮罩+右侧悬浮置顶）
    var _floatBound = false;
    function f_floatPreview() {
        if (!S.floatPreview || inIframe) return;
        if (!isList()) return;
        if (_floatBound) return;
        _floatBound = true;
        document.addEventListener('click', function(e) {
            if (!S.floatPreview) return;
            if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button === 1) return;
            var el = e.target;
            while (el && el !== document && el.nodeType === 1) {
                if (el.tagName === 'A') break;
                el = el.parentNode;
            }
            if (!el || el.tagName !== 'A') return;
            var href = el.getAttribute('href') || '';
            if (!isPostLink(href)) return;
            if (el.closest && el.closest('.yh-float-panel')) return;
            if (el.closest && el.closest('.yh-float-overlay')) return;
            e.preventDefault();
            e.stopPropagation();
            showFloatPanel(href);
        }, true);
    }
    function showFloatPanel(url) {
        if (url.indexOf('http') !== 0) {
            try { url = new URL(url, location.origin).href; } catch(e) { return; }
        }
        // 遮罩
        if (!document.querySelector('.yh-float-overlay')) {
            var ov = document.createElement('div');
            ov.className = 'yh-float-overlay';
            ov.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483001;background:rgba(0,0,0,.45);cursor:pointer';
            ov.addEventListener('click', hideFloatPanel);
            document.body.appendChild(ov);
        }
        // 浮窗
        if (!document.querySelector('.yh-float-panel')) {
            var panel = document.createElement('div');
            panel.className = 'yh-float-panel';
            panel.style.cssText = 'position:fixed;top:10px;right:10px;width:55vw;max-width:700px;height:calc(100vh - 20px);z-index:2147483002;background:#fff;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.25);display:flex;flex-direction:column;overflow:hidden;border:1px solid #e0e0e0';
            panel.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid #eee;background:#f9f9f9;flex-shrink:0"><span class="yh-float-title" style="font-size:14px;font-weight:bold;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;margin-right:10px">\u52A0\u8F7D\u4E2D...</span><span class="yh-float-close" style="cursor:pointer;font-size:20px;color:#999;line-height:1;padding:0 4px;flex-shrink:0">&times;</span></div><iframe class="yh-float-iframe" style="flex:1;width:100%;border:none;background:#fff"></iframe>';
            panel.querySelector('.yh-float-close').addEventListener('click', hideFloatPanel);
            document.body.appendChild(panel);
            document.addEventListener('keydown', function(e) { if (e.key === 'Escape') hideFloatPanel(); });
        }
        var titleEl = document.querySelector('.yh-float-title');
        var iframe = document.querySelector('.yh-float-iframe');
        if (titleEl) titleEl.textContent = '\u52A0\u8F7D\u4E2D...';
        if (iframe) {
            iframe.src = url;
            iframe.onload = function() {
                try {
                    var doc = this.contentDocument || this.contentWindow.document;
                    var t = doc.title;
                    if (t && titleEl) titleEl.textContent = t;
                    var style = doc.createElement('style');
                    style.textContent = '.newMessage,.title,.subtitle2,.btBox,.nexttitle,.footer,.list{display:none!important} body{max-width:100%!important;margin:0!important;padding:8px!important;overscroll-behavior:contain!important} html{overscroll-behavior:contain!important}';
                    doc.head.appendChild(style);
                } catch(e) {}
            };
        }
    }
    function hideFloatPanel() {
        var ov = document.querySelector('.yh-float-overlay');
        if (ov) ov.remove();
        var panel = document.querySelector('.yh-float-panel');
        if (panel) panel.remove();
    }

    // 9. 列表时间显示
    function f_timeDisplay() {
        if (!S.showTime || !isList()) return;
        var items = document.querySelectorAll('.listdata');
        var now = new Date();
        var curYear = now.getFullYear();
        var curMon = now.getMonth() + 1;
        var curDay = now.getDate();
        for (var i = 0; i < items.length; i++) {
            var el = items[i];
            var right = el.querySelector('.right');
            if (!right) continue;
            // 避免重复加
            if (right.querySelector('.yh-ago')) continue;
            var raw = (right.textContent || '').replace(/\s+/g, '').trim();
            if (!raw) continue;
            var ago = '';
            if (raw.indexOf('今天') >= 0) {
                // 今天 → 不显示（默认隐藏，不必显示）
                ago = '';
            } else if (raw.indexOf('昨天') >= 0) {
                ago = '1天前';
            } else if (raw.indexOf('前天') >= 0) {
                ago = '2天前';
            } else {
                // 格式：7月22日 或 4月5日
                var m = raw.match(/(\d+)月(\d+)日/);
                if (m) {
                    var pm = parseInt(m[1], 10);
                    var pd = parseInt(m[2], 10);
                    if (pm && pd) {
                        var tryYear = curYear;
                        var postMs = Date.UTC(tryYear, pm - 1, pd);
                        var nowMs = Date.UTC(curYear, curMon - 1, curDay);
                        // 如果帖子日期比今天大（未来），说明是跨年帖，逐年回退直到日期合理
                        while (postMs > nowMs && tryYear > curYear - 20) {
                            tryYear--;
                            postMs = Date.UTC(tryYear, pm - 1, pd);
                        }
                        var diff = Math.round((nowMs - postMs) / 86400000);
                        if (diff <= 0) ago = '今天';
                        else if (diff === 1) ago = '昨天';
                        else ago = diff + '天前';
                    }
                }
            }
            if (!ago) continue;
            var tag = document.createElement('span');
            tag.className = 'yh-ago';
            tag.textContent = ago;
            tag.style.cssText = 'color:#e67e22;font-size:11px;margin-right:4px;font-weight:bold';
            right.insertBefore(tag, right.firstChild);
        }
    }
    // 10. 图片点击放大（支持滚轮/双指缩放）
    function f_imgZoom() {
        if (!S.imgZoom) return;
        var imgs = document.querySelectorAll('.bbscontent img, .retext img, .content img');
        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i];
            if (img.getAttribute('data-yh-zoom') === '1') continue;
            img.setAttribute('data-yh-zoom', '1');
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', function(e) {
                if (e) { e.preventDefault(); e.stopPropagation(); }
                var src = this.getAttribute('src') || '';
                if (!src) return;
                if (src.indexOf('http') !== 0) {
                    try { src = new URL(src, location.origin).href; } catch (e2) { return; }
                }
                showImageZoom(src);
            });
        }
    }
    function showImageZoom(src) {
        var overlay = document.createElement('div');
        overlay.className = 'yh-zoom-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483647;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;cursor:zoom-out;-webkit-user-select:none;user-select:none;touch-action:none;';
        var img = document.createElement('img');
        img.src = src;
        img.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;border-radius:4px;box-shadow:0 4px 30px rgba(0,0,0,.5);transition:transform .2s ease;cursor:grab;will-change:transform;';
        img.draggable = false;
        overlay.appendChild(img);
        document.body.appendChild(overlay);
        var scale = 1, originX = 0, originY = 0, startX = 0, startY = 0, startScale = 1, pinching = false;
        var lastDist = 0, lastCenterX = 0, lastCenterY = 0;
        function applyTransform() {
            img.style.transform = 'translate(' + originX + 'px,' + originY + 'px) scale(' + scale + ')';
        }
        function close() {
            try { if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay); } catch (e) {}
        }
        // 点遮罩关闭
        overlay.addEventListener('click', function(e) { if (e.target === overlay) close(); });
        // 鼠标拖拽平移（拖拽期间移动＞3px 视为拖动，不触发关闭）
        var dragging = false, dragStartX = 0, dragStartY = 0, dragOX = 0, dragOY = 0;
        var _dragMoved = false;
        img.addEventListener('mousedown', function(e) {
            if (e.button !== 0) return;
            dragging = true;
            _dragMoved = false;
            dragStartX = e.clientX; dragStartY = e.clientY;
            dragOX = originX; dragOY = originY;
            img.style.cursor = 'grabbing';
            img.style.transition = 'none'; // 拖拽时取消过渡，丝滑跟随
        });
        document.addEventListener('mousemove', function(e) {
            if (!dragging) return;
            if (Math.abs(e.clientX - dragStartX) > 3 || Math.abs(e.clientY - dragStartY) > 3) {
                _dragMoved = true;
            }
            originX = dragOX + (e.clientX - dragStartX);
            originY = dragOY + (e.clientY - dragStartY);
            applyTransform();
        });
        document.addEventListener('mouseup', function() {
            if (dragging) {
                dragging = false;
                img.style.cursor = 'grab';
                img.style.transition = 'transform .2s ease'; // 恢复过渡
            }
        });
        // 点图片关闭（第二次点击退出；拖拽后不触发关闭）
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            if (_dragMoved) { _dragMoved = false; return; }
            close();
        });
        // 移动端单指拖拽平移
        var _touchDrag = false, _touchMoved = false;
        var _touchStartX = 0, _touchStartY = 0, _touchOX = 0, _touchOY = 0;
        overlay.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
                _touchDrag = true;
                _touchMoved = false;
                var t = e.touches[0];
                _touchStartX = t.clientX; _touchStartY = t.clientY;
                _touchOX = originX; _touchOY = originY;
                img.style.transition = 'none';
            }
        }, {passive:true});
        overlay.addEventListener('touchmove', function(e) {
            if (e.touches.length === 1 && _touchDrag) {
                var t = e.touches[0];
                if (Math.abs(t.clientX - _touchStartX) > 3 || Math.abs(t.clientY - _touchStartY) > 3) {
                    _touchMoved = true;
                }
                originX = _touchOX + (t.clientX - _touchStartX);
                originY = _touchOY + (t.clientY - _touchStartY);
                applyTransform();
            }
        }, {passive:false});
        overlay.addEventListener('touchend', function(e) {
            if (_touchDrag) {
                _touchDrag = false;
                img.style.transition = 'transform .2s ease';
                if (_touchMoved) {
                    // 拖拽过，不触发关闭
                    _dragMoved = true;
                    setTimeout(function() { _dragMoved = false; }, 500);
                }
            }
        }, {passive:true});
        // 滚轮缩放
        overlay.addEventListener('wheel', function(e) {
            e.preventDefault();
            var delta = e.deltaY > 0 ? -0.1 : 0.1;
            var newScale = Math.max(0.2, Math.min(10, scale + delta));
            // 以鼠标位置为中心缩放
            var rect = img.getBoundingClientRect();
            var mx = e.clientX - rect.left;
            var my = e.clientY - rect.top;
            var ratio = newScale / scale;
            originX = mx - ratio * (mx - originX);
            originY = my - ratio * (my - originY);
            scale = newScale;
            applyTransform();
        }, {passive:false});
        // 双指缩放
        overlay.addEventListener('touchstart', function(e) {
            if (e.touches.length === 2) {
                pinching = true;
                startScale = scale;
                var dx = e.touches[0].clientX - e.touches[1].clientX;
                var dy = e.touches[0].clientY - e.touches[1].clientY;
                lastDist = Math.sqrt(dx * dx + dy * dy);
                lastCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                lastCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            }
        }, {passive:true});
        overlay.addEventListener('touchmove', function(e) {
            if (e.touches.length === 2 && pinching) {
                e.preventDefault();
                var dx = e.touches[0].clientX - e.touches[1].clientX;
                var dy = e.touches[0].clientY - e.touches[1].clientY;
                var dist = Math.sqrt(dx * dx + dy * dy);
                var ratio = dist / lastDist;
                var newScale = Math.max(0.2, Math.min(10, startScale * ratio));
                scale = newScale;
                applyTransform();
            }
        }, {passive:false});
        overlay.addEventListener('touchend', function(e) {
            if (e.touches.length < 2) pinching = false;
        }, {passive:true});
        // 键盘 ESC 关闭
        var keyHandler = function(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', keyHandler); } };
        document.addEventListener('keydown', keyHandler);
    }
    // 主循环
    function safe(fn) { try { fn(); } catch (e) { try { console.log('[YH] err', e); } catch (e2) {} } }
    function run() {
        // 设置按钮优先注入，避免其它功能报错导致列表页没有齿轮
        safe(initSettings);
        safe(f_newTab);
        safe(f_topBtn);
        safe(f_lazyLoad);
        safe(f_repeat);
        safe(f_eatMeat);
        safe(f_opTag);
        safe(f_threadView);
        safe(f_ubb);
        if (!inIframe) safe(f_splitView);
        if (!inIframe) safe(f_splitStyleCheck);
        if (!inIframe) safe(f_floatPreview);
        safe(f_timeDisplay);
        safe(f_imgZoom);
    }

    // 初始化
    var inIframe = window.self !== window.top;
    function boot() {
        run();
        setInterval(run, 2000);
        safe(f_autoUpdate);
    }
    if (document.body) boot();
    else document.addEventListener('DOMContentLoaded', boot);
    // 全站兜底：列表页/帖子页都确保设置按钮存在
    function forceSettings() { try { initSettings(); } catch (e) {} }
    forceSettings();
    setTimeout(forceSettings, 200);
    setTimeout(forceSettings, 800);
    setTimeout(forceSettings, 2000);
    setTimeout(forceSettings, 5000);
    setInterval(forceSettings, 2000);
    // 监听 DOM 变化（列表无限加载时）
    try {
        var mo = new MutationObserver(function() { forceSettings(); });
        if (document.documentElement) mo.observe(document.documentElement, {childList:true, subtree:true});
    } catch (e) {}

    console.log('[YH] 初始化完成 v0.9.192 by Embrace/19299');
})();