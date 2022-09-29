// url.js
// 2022-01-13

let BaseURL = "http://localhost:18099";

// 縣市或流域
export let FreqBaseURL = `${BaseURL}/Freq/`

// 取得流域名稱及編碼
export var BasinUrl = `${BaseURL}/Freq/Basins`;

// 流域雨量站名稱及編碼API
export var RstBaseBasin = `${BaseURL}/Freq/RstInBasin/`;

// 取得縣市名稱編碼
export let CountyUrl = `${BaseURL}/Freq/County`;

// 縣市雨量站名稱與代碼
export let RstBaseCounty = `${BaseURL}/Freq/RstInCounty/`

// 取得降雨強度，各重現期統計參數
export var IntensityUrl = `${BaseURL}/Freq/RainIntensity/`;

// 統計檢定及頻率分析
export var ProbTestAndFreqUrl = `${BaseURL}/Freq/ProbTestFreq`