// ReadStIdOfBasin.js
// 2022-01-13

import { Ajax } from '../../Common/FetchTimeOut.js';

// API 位址
import { RstBaseBasin, RstBaseCounty } from "./url.js";

export let RstBase = {
    basinId: undefined,
    data: undefined
}

let spin = '<i class="fa fa-cog fa-spin fa-2x fa-fw"></i><span class="sr-only">Loading...</span>';

// 取得縣市或流域所有雨量站名稱及編碼

export let FetchStIds = async (AreaType, basinId) => {

    
    RstBase.basinId = basinId;

    $("#loading-indicator").html(spin);
    let url;
    if (AreaType === 'Basins') {
        url = RstBaseBasin + basinId;
        if (basinId === undefined || basinId.length === 0) {
            basinId = "1140";
        }
    }
    else if (AreaType === 'County')
    {
        url = RstBaseCounty + basinId;
        if (basinId === undefined || basinId.length === 0) {
            basinId = "A";
        }
    }
    else {
        console.log("尚未指定縣市或流域! AreaType = ", AreaType);
        return -1;
    }

    // console.log({ url: url })
    let timeLimit = 10 * 1000; // seconds
    try {
        let json = await Ajax(url, {}, timeLimit);
        RstBase.data = json;
        $("#loading-indicator").html("");
        // 雨量站選項
        let opts = "";
        for (let i = 0; i < RstBase.data.length; i++) {
            opts += `<option value='${RstBase.data[i].RstId}'>${RstBase.data[i].RstCname} (${RstBase.data[i].RstId})</option>`;
        }
        // console.log({opts : opts})
        $("#stid-select").html(opts);
        let cname = $("#stid-select :selected").text();
        $(".sta-Cname").text(cname);

    }
    catch (error) {
        console.log("ReadStIdOfBasin() 連線時間超過 5 秒! Error=", error);
        return -1;
    }
    return 0;
}