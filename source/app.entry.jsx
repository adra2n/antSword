//
// 程序入口
// -------
// create: 2015/12/20
// update: 2016/01/20
// 

'use strict';

const electron = global.require('electron');
const remote = electron.remote;
const ipcRenderer = electron.ipcRenderer;

import Menubar from './base/menubar';
import CacheManager from './base/cachemanager';

const antSword = window.antSword = {
  noxss: (html) => {
    return String(html).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }
};

// 加载模板代码
antSword['core'] = {};
['php', 'asp', 'aspx', 'custom'].map((_) => {
  antSword['core'][_] = require(`./core/${_}/index`);
});

// 加载显示语言
let _lang = localStorage.getItem('language') || navigator.language;
_lang = ['en', 'zh', 'jp'].indexOf(_lang) === -1 ? 'en' : _lang;
antSword['language'] = require(`./language/${_lang}`);

antSword['ipcRenderer'] = ipcRenderer;
antSword['CacheManager'] = CacheManager;
antSword['menubar'] = new Menubar();

// 加载模块列表
antSword['tabbar'] = new dhtmlXTabBar(document.getElementById('container'));
[
  'shellmanager',
  'settings',
  'plugin'
].map((_) => {
  let _module = require(`./modules/${_}/index`);
  new _module.default();
});
// 移除加载界面&&设置标题
$('#loading').remove();
document.title = antSword['language']['title'] || 'AntSword';