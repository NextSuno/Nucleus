let symbols = [
  { symbol: 'BTC', name: '比特币' },
  { symbol: 'ETH', name: '以太坊' },
  { symbol: 'BNB', name: '币安币' },
  { symbol: 'XRP', name: '瑞波币' },
  { symbol: 'ADA', name: '艾达币' },
  { symbol: 'DOGE', name: '狗狗币' },
  { symbol: 'LTC', name: '莱特币' },
  { symbol: 'SOL', name: '索拉纳' },
  { symbol: 'TRX', name: '波场币' }
];

let notificationTitle = '加密货币汇率';
let notificationContent = [];
let completedRequests = 0; // 记录完成的请求数

for (let i = 0; i < symbols.length; i++) {
  let symbol = symbols[i];
  let url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol.symbol}USDT`;

  if (typeof $task !== 'undefined') {
    // Quantumult X
    $task.fetch({ url: url }).then(
      (response) => {
        handleResponse(response.body, symbol);
      },
      (reason) => {
        console.log(reason.error);
        completedRequests++; // 即使失败也记录完成
        checkIfAllRequestsComplete();
      }
    );
  } else if (typeof $httpClient !== 'undefined') {
    // Surge / Loon
    $httpClient.get(url, function (error, response, data) {
      if (error) {
        console.log(error);
        completedRequests++; // 即使失败也记录完成
        checkIfAllRequestsComplete();
      } else {
        handleResponse(data, symbol);
      }
    });
  }
}

function handleResponse(data, symbol) {
  try {
    let jsonData = JSON.parse(data);
    let price = jsonData.price;

    if (price) {
      let currencyInfo = `${symbol.name} (${symbol.symbol}): 💲${price}`;
      notificationContent.push(currencyInfo);
    } else {
      console.log(`未获取到价格: ${symbol.symbol}`);
    }
  } catch (error) {
    console.log(`解析错误: ${error.message}`);
  } finally {
    completedRequests++; // 无论成功与否，计数器都增加
    checkIfAllRequestsComplete();
  }
}

function checkIfAllRequestsComplete() {
  if (completedRequests === symbols.length) {
    sendNotification();
  }
}

function sendNotification() {
  let body = notificationContent.length > 0 ? notificationContent.join('\n') : '未能获取任何价格数据。';

  if (typeof $task !== 'undefined') {
    // Quantumult X
    $notify(notificationTitle, '', body);
  } else if (typeof $httpClient !== 'undefined') {
    // Surge / Loon
    $notification.post(notificationTitle, '', body);
  }
}
