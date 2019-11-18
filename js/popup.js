function getDate() {
  let myDate = new Date()
  let year = myDate.getFullYear()
  let month = myDate.getMonth() + 1
  let date = myDate.getDate()
  let h = myDate.getHours()
  let m = myDate.getMinutes()
  let s = myDate.getSeconds()
  let now = year + '-' + conver(month) + '-' + conver(date) + ' ' + conver(h) + ':' + conver(m) + ':' + conver(s)
  return now
}

//日期时间处理
function conver(s) {
  return s < 10 ? '0' + s : s
}

// 提交认证
document.getElementById('commit').onclick = function () {
  let https = document.getElementById('repos').value
  let tmp = https.split('/')
  let username = tmp[tmp.length - 2]
  let repos = tmp[tmp.length - 1]
  let token = document.getElementById('token').value

  chrome.storage.local.set({ 'username': username, 'repos': repos, 'token': token }, () => {
    let bg = chrome.extension.getBackgroundPage()
    let github = new bg.Github()
    github.create('bookmarks/create')
    chrome.notifications.create(null, {
      type: 'basic',
      iconUrl: 'img/icon.png',
      title: '保存配置',
      message: '认证配置成功'
    })
  })
}

// 清空标签
document.getElementById('clear').onclick = function () {
  let bg = chrome.extension.getBackgroundPage()
  bg.clearBookmarks()
}

// 删除远程书签
document.getElementById('clearonline').onclick = function () {
  let files = document.getElementById('filename').value
  if (files !== '' && files !== undefined) {
    let bg = chrome.extension.getBackgroundPage()
    let github = new bg.Github()
    github.delete('bookmarks/' + files, '删除' + files)

    $('#message-success').innerText = '远程删除成功'
    clearAndFadeMessage($('#message-success'))
  } else {
    $('#message-error').innerText = '未选定文件名'
    clearAndFadeMessage($('#message-error'))
  }
}

// 全量同步上传
document.getElementById('upload').onclick = function () {
  let files = document.getElementById('filename').value
  if (files !== '' && files !== undefined) {
    let bg = chrome.extension.getBackgroundPage()
    let github = new bg.Github()
    github.updateTags('bookmarks/' + files, getDate())

    $('#message-success').innerText = '同步上传成功'
    clearAndFadeMessage($('#message-success'))
  } else {
    $('#message-error').innerText = '未选定文件名'
    clearAndFadeMessage($('#message-error'))
  }
}

// 全量同步下载
document.getElementById('download').onclick = function () {
  let files = document.getElementById('filename').value
  if (files !== '' && files !== undefined) {
    let bg = chrome.extension.getBackgroundPage()
    let github = new bg.Github()
    github.get('bookmarks/' + files)

    $('#message-success').innerText = '更新下载成功'
    clearAndFadeMessage($('#message-success'))
  } else {
    $('#message-error').innerText = '未选定文件名'
    clearAndFadeMessage($('#message-error'))
  }
}

let $ = (selector) => {
  return document.querySelector(selector)
}

document.getElementById('toggle').onclick = function () {
  toggleSettings()
}

function toggleSettings() {
  let main = $('#main')
  let setting = $('#setting')
  if (main.style.display === 'block') {
    setting.style.display = 'block'
    main.style.display = 'none'
  } else {
    setting.style.display = 'none'
    main.style.display = 'block'
  }
}

function switch2Main() {
  let main = $('#main')
  let setting = $('#setting')
  setting.style.display = 'none'
  main.style.display = 'block'
}

function switch2Setting() {
  let main = $('#main')
  let setting = $('#setting')
  setting.style.display = 'block'
  main.style.display = 'none'
}

function clearAndFadeMessage(element, time = 3000) {
  setTimeout(() => {
    element && (element.innerText = '')
  }, time)
}

window.onload = function () {
  let key = ['username', 'repos', 'token', 'localnum']
  let username;
  let repos;
  let token;
  let localnum;
  let bg = chrome.extension.getBackgroundPage();

  chrome.storage.local.get(key, function (result) {
    username = result.username;
    repos = result.repos;
    token = result.token;
    localnum = result.localnum;

    if (localnum === '' || localnum === undefined) {
      bg.countBookmarks($('#count-local'))
    }

    if (token === '' || token === undefined) {
      $('#message-error').innerText = '未配置认证信息'
      clearAndFadeMessage($('#message-error'))
    } else {
      $('#repos').value = 'https://github.com/' + username + '/' + repos
      $('#token').value = token

      switch2Main()
    }
  })

  // 获取目录
  let github = new bg.Github();
  github.getlist('bookmarks/', $('#greetings'), $('#count-repo'));
}