// omnibox 演示
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
	console.log('inputChanged: ' + text);
	if (!text) return;

	try {
		var result = []
		chrome.bookmarks.search(text, function (re) {
			re.forEach((data, index) => {
				if (data.url !== undefined) {
					result[index] = { content: data.url, description: data.title }
				}
			})
			suggest(result)
		})
	} catch (e) {
		console.error('error ', e)
	} finally {
		suggest(result)
	}
});

// 当用户接收关键字建议时触发
chrome.omnibox.onInputEntered.addListener((text) => {
	console.log('inputEntered: ' + text);
	if (!text) return;
	openUrlCurrentTab(text);
});

// 获取当前选项卡ID
function getCurrentTabId(callback) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		if (callback) callback(tabs.length ? tabs[0].id : null);
	});
}

// 当前标签打开某个链接
function openUrlCurrentTab(url) {
	getCurrentTabId(tabId => {
		chrome.tabs.update(tabId, { url: url });
	})
}
