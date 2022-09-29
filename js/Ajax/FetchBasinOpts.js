// FetchBasinOpts.js
// 2022-01-13


import { Ajax } from '../../Common/FetchTimeOut.js';

// API 位址
import { FreqBaseURL } from "./url.js";

export let AreaJson = {
    AreaType: undefined,
    data: undefined
}


let spin = '<i class="fa fa-cog fa-spin fa-2x fa-fw"></i><span class="sr-only">Loading...</span>';

// 依縣市或流域，取得雨量站基本資料
// input
//   AreaType : 
export let FetchCountryBasinsOpts = async (AreaType) => {

    AreaJson.AreaType = AreaType;
    let url = `${FreqBaseURL}${AreaType}`;

    // console.log({ url: url });
    let timeLimit = 10000;
    $("#loading-indicator").html(spin);

    try {
        let json = await Ajax(url, {}, timeLimit);
        // console.log(json);
        if (json == null) {
            console.log("讀取流域名稱與編碼發生錯誤!");
            return -1;
        }
        AreaJson.data = json;
        let opts = "";
        for (let i = 0; i < json.length; i++) {
            opts += `<option value='${json[i].Name}'>${json[i].Cname} (${json[i].Name})</option>`;
        }
        //opts += "<option value='NULL'>未分類</option>";
        $("#basin-select").html(opts);
        $("#loading-indicator").html("");
    }
    catch (error){
        console.log("FetchBasinOpts() error : ", error);
        return -1;
    }
   return 0;
}
