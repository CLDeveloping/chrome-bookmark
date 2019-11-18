// 清空标签
function clearBookmarks() {
    chrome.bookmarks.getTree((re) => {
        removeall(re);
        chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'img/icon.png',
            title: '书签',
            message: '清空完毕'
        })
    })
}

// 统计书签个数
function countBookmarks(element) {
    chrome.bookmarks.getTree((re) => {
        var n = counted(re, 0);
        element.innerText = n
    })
}

function counted(data, num) {
    data.forEach((v) => {
        if (v.url === undefined) {
            num = counted(v.children, num)
        } else {
            num += 1
        }
    })
    return num
}

// 清空三级目录或书签信息
function removeall(data) {
    data[0].children.forEach((v) => {
        v.children.forEach((vv) => {
            if (vv.url === undefined) {
                chrome.bookmarks.removeTree(vv.id, function (rs) { })
            } else {
                chrome.bookmarks.remove(vv.id, function (rs) { })
            }
        })
    })
}

// 递归全量导入
// bookmark ( object )
// parentId ( optional string )
// Defaults to the Other Bookmarks folder.
// index ( optional integer )
// title ( optional string )
// url ( optional string )
function addAll(data, parentname) {
    data.forEach((v) => {
        if (parentname === '') {
            if (v.children !== undefined) {
                addAll(v.children, v.id)
            } else {
                var tmp = {
                    parentId: v.id,
                    title: v.title,
                    url: v.url
                }
                chrome.bookmarks.create(tmp, function (rrs) { })
            }
        } else {
            if (v.children !== undefined) {
                var tmp = {
                    parentId: parentname,
                    title: v.title
                }
                // Unchecked runtime.lastError: Can't find parent bookmark for id.
                chrome.bookmarks.create(tmp, function (rs) {
                    addAll(v.children, rs.id)
                })
            } else {
                var tmp = {
                    parentId: parentname,
                    title: v.title,
                    url: v.url
                }
                chrome.bookmarks.create(tmp, function (rrs) { })
            }
        }
    })
}
