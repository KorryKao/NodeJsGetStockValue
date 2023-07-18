const https = require('https');
const inputArray = ['2330', '2317', '2454', '2609', '2615', '1101', '2539', '9945', '2915', '2603'];
const result = transformArray(inputArray);
const url = 'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?json=1&delay=0&ex_ch='+result;

https.get(url, (response) => {
  let data = '';

  response.on('data', (chunk) => {
    data += chunk;
  });

  response.on('end', () => {
    try {
      const output = parseJsonData(data);
      console.log(output);
	  const timestamp = new Date().toLocaleString();
	  console.log(timestamp);
	  console.log();
    } catch (error) {
      console.error('解析 JSON 資料時發生錯誤：', error.message);
    }
  });
}).on('error', (error) => {
  console.error('發送 HTTP 請求時發生錯誤：', error.message);
});

function transformArray(arr) {
  const transformedArray = arr.map(item => `tse_${item}.tw`);
  const joinedString = transformedArray.join('%7C');
  return joinedString;
}

function parseJsonData(jsonData) {
  const data = JSON.parse(jsonData);
  const result = data.msgArray.map(item => {
    let zValue;
    if (item.z !== '-') {
      zValue = item.z;
    } else if (item.b.includes ("_")) {
		if (item.b.split('_')[0] === '0.0000') {
			zValue = item.u;
		}
		else{
			zValue = item.b.split('_')[0];
		}
    } else{
      zValue = item.y;
	}
 	var z = (zValue*1).toFixed(2);
	let Check=(z-item.y).toFixed(2);
	let UpDown;
	if(Check==0){
		UpDown = ` ${Check}`;
	}
	else if(Check>0){
		UpDown = `△${Check}`;
	}
	else{
		Check = (item.y - z).toFixed(2);
		UpDown = `▼${Check}`;
	}
    return `${item.c} = ${z} ${UpDown}`;
  });
  return result.join('\n');
}