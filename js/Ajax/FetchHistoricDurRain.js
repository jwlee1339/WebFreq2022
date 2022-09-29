// FetchHistoricDurRain.js
// 2022-01-13


import { Ajax } from '../../Common/FetchTimeOut.js';

// API 位址
import { IntensityUrl } from "./url.js";

import { EnableButtons,DisableButtons, ClearTables } from '../main.js';

export let dataJson = {
    stId: undefined,
    data: undefined
}


let spin = '<i class="fa fa-cog fa-spin fa-2x fa-fw"></i><span class="sr-only">Loading...</span>';

// 取得歷史各延時降雨資料
// input
//   autority : 'cwb'(預設) or 'wra'
// output
//   0  : OK
//   -1 : error

export let FetchHistoricDurRain = async (authority) => {

    authority = authority || 'cwb'

    // stId : 測站編號
    let stId = $("#stid-select :selected").val();
    dataJson.stId = stId;

    $("#loading-indicator").html(spin);
    let url = IntensityUrl + `${stId}?authority=${authority}`;
    // console.log({ url : url})
    let timeLimit = 10 * 1000;
    try{
        let json = await Ajax(url, {}, timeLimit);
        dataJson.data = json;
        if (dataJson.data.year == undefined) {
            console.log({ url: url })
            console.log("讀取歷史數據發生錯誤");
            $("#historic-Chart").html(`<h4>讀取歷史數據發生錯誤</h4>`);
            EnableButtons();
            ClearTables();
            $("#loading-indicator").html("");
            EnableButtons();
            return -1;
        }

        
        $("#loading-indicator").html("");
        EnableButtons();
    } catch(error){
        console.log({ url: url })
        console.log({ dataJson: dataJson })
        console.log("讀取歷史數據發生錯誤，或連線時間超過 10 秒! Error=", error);
        return -1;
    }
    return 0;
}