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
      }
    );
  } else if (typeof $httpClient !== 'undefined') {
    // Surge
    $httpClient.get(url, function (error, response, data) {
      if (error) {
        console.log(error);
      } else {
        handleResponse(data, symbol);
      }
    });
  } else if (typeof $loon !== 'undefined') {
    // Loon
    $loon.fetch({ url: url }).then(
      (response) => {
        handleResponse(response.body, symbol);
      },
      (reason) => {
        console.log(reason.error);
      }
    );
  }
}

function handleResponse(data, symbol) {
  console.log("Response data:", data);
  
  let jsonData;
  try {
    jsonData = JSON.parse(data);
  } catch (e) {
    console.log("JSON parse error:", e);
    return;
  }

  console.log("Parsed JSON data:", jsonData);

  if (jsonData && jsonData.price) {
    let price = jsonData.price;
    let currencyInfo = symbol.name + symbol.symbol + '💲' + price;
    notificationContent.push(currencyInfo);
  } else {
    console.log("Price not found for symbol:", symbol.symbol);
    notificationContent.push(symbol.name + symbol.symbol + '💲' + 'N/A');
  }

  if (notificationContent.length === symbols.length) {
    sendNotification();
  }
}

function sendNotification() {
  let body = notificationContent.join('\n');

  if (typeof $task !== 'undefined') {
    // Quantumult X
    $notify(notificationTitle, '', body);
  } else if (typeof $httpClient !== 'undefined') {
    // Surge
    $notification.post(notificationTitle, '', body);
  } else if (typeof $loon !== 'undefined') {
    // Loon
    $notification.post(notificationTitle, '', body);
  }
}
