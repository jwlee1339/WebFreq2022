// main.js for Frequency Analysys
// 2021-12-17 refactored

"use strict";

import { DrawRainIntensity } from "./DrawHistograph.js";

import { FindReturnPeriod } from "./FindReturnPeriod.js";
import { FrequencyAnalysis, Global_FreqResults } from "./Frequency.js";
import { DrawKSChart } from "./DrawKSChart.js";
import { FetchStIds } from './Ajax/FetchStIds.js';
import { dataJson, FetchHistoricDurRain } from './Ajax/FetchHistoricDurRain.js';
import { AreaJson, FetchCountryBasinsOpts } from './Ajax/FetchBasinOpts.js';
import { StatisticsTable } from "./StatisticsTable.js";

// Global variables

let TrendLineCheck = false;

// 繪圖類別
let drawRainIntensity;

// 原始數據表
function generateTable(json) {
    if (json == null) return "(無資料)";
    let tr = "", td = "", th = "";
    // table head
    let Dur = json.dur;
    td = "<td>年</td>";
    for (let i = 0; i < Dur.length; i++) {
        td += `<td>${Dur[i]}<br/>分鐘</td>`;
    }
    th += `<tr class='w3-blue'>${td}</tr>`;
    // table body

    let nYr = json.year.length;
    for (let i = 0; i < nYr; i++) {
        td = `<td>${json.year[i]}</td>`;
        for (let j = 0; j < Dur.length; j++) {
            let ri = json.intens[i];
            td += `<td>${ri[j].toFixed(1)}</td>`;
        }
        tr += `<tr>${td}</tr>`;
    }
    return [th, tr];
}

// 讀取資料發生錯誤時，清除表格

export function ClearTables() {
    $("#text-message").css("display", "none");
    $("#text-message-warning").css("display", "none");
    $("#text-message-no").css("display", "block");
    $.plot("#KSTest-Chart", [], []);
    $.plot("#Prob-Chart", [], []);
    $.plot("#historic-Chart", [], []);
    let td = "<tr><td colspan=12>無資料</td></tr>";
    $("#test-results").html(td);
    $("#freqResults-table").html(td);
    td = "<tr><td colspan=6>無資料</td></tr>";
    $("#KSTest-tbody").html(td);
    td = "<tr><td colspan=17>無資料</td></tr>";
    $("#statistics-tbody").html(td);
    $("#intens-tbody").html(td);
}


// 資料複製到input框，以提供後續頻率分析之用
let CopyData = () => {
    let iDur = $("#duration-select :selected").index();
    let GlobalData = [];
    if (dataJson.data == null) {
        $("#dataToFreq").val("(無資料)");
    }
    for (let i = 0; i < dataJson.data.intens.length; i++) {
        GlobalData.push(dataJson.data.intens[i][iDur].toFixed(2));
    }
    $("#dataToFreq").val(GlobalData);
    $(".Freq-Duration").html("(" + dataJson.data.dur[iDur] + "分鐘)");
}

// 執行頻率分析
let StartFrequencyAnalysis = () => {
    let data = $("#dataToFreq").val();
    let frequencyAnalysis = new FrequencyAnalysis(data);
    frequencyAnalysis.render();
}

// 下載資料後，複製數據、頻率分析
let start = () => {

    drawRainIntensity = new DrawRainIntensity(dataJson.data, "#historic-Chart");

    let tr = generateTable(dataJson.data);
    $(".intens-thead").html(tr[0]);
    $("#intens-tbody").html(tr[1]);

    let statisticsTable = new StatisticsTable(dataJson.data, "#Statistics-Table");
    statisticsTable.render();

    // generate duration selection
    drawRainIntensity.generateDuration(dataJson.data.dur);
    drawRainIntensity.plotHisto(TrendLineCheck);

    CopyData();

    // 水文頻率分析
    StartFrequencyAnalysis();
}



function KSTbShow_Click() {
    let tmp = $("#KSTb").is(":hidden");
    if (!tmp) {
        $("#icon-KS-table").removeClass("glyphicon-chevron-up");
        $("#icon-KS-table").addClass("glyphicon-chevron-down");
    }
    else {
        $("#icon-KS-table").removeClass("glyphicon-chevron-down");
        $("#icon-KS-table").addClass("glyphicon-chevron-up");
    }
}

export let DisableButtons = () => {
    const buttons = document.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
}

// Enable buttons
export function EnableButtons() {
    const buttons = document.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
    }
}

// 重新更新畫面
// return 
//   0 : OK
//  -1 : NG

// 更新雨量站名稱及代碼

let refresh = async () => {
    let AreaType = $("input[name='AreaType']:checked")[0].id;
    let iBasin = $("#basin-select :selected").index();
    let authority = $("input[name='authority']:checked")[0].id;

    if (iBasin >= 0) {

        // 取得流域內所有雨量站名稱
        let code = await FetchStIds(AreaType, AreaJson.data[iBasin].Name);
        if (code != 0) {
            console.log("Error in FetchStIds()");
            return -1;
        }

        // 讀取歷年年最大降雨強度
        code = await FetchHistoricDurRain(authority);
        if (code != 0) {
            console.log("Error in FetchHistoricDurRain()");
            return -1;
        }
        if (dataJson.data.year.length != 0) {
            $("#text-message-no").css("display", "none");
            // 接續執行頻率分析
            start();
        } else {
            ClearTables();
        }
    }
    return 0;
}

// 更新縣市/流域

let refreshAll = async () => {
    DisableButtons();
    let AreaType = $("input[name='AreaType']:checked")[0].id;

    let code = await FetchCountryBasinsOpts(AreaType);

    if (code !== 0) {
        console.log("Error in FetchCountryBasinsOpts");
        EnableButtons();
        return -1;
    }

    refresh();
    EnableButtons();
    return 0;
}

// ----------------------- 註冊 ---------------------------

// 縣市或流域按鈕
$('input[type="radio"][name="AreaType"]').change(() => refreshAll());

// cwb或wra按鈕
$('input[type="radio"][name="authority"]').change(() => refreshAll());


$("#stid-select").change(async () => {
    DisableButtons();
    let authority = $("input[name='authority']:checked")[0].id;
    await FetchHistoricDurRain(authority);
    if (dataJson.data.year.length != 0) {
        $("#text-message-no").css("display", "none");
        // 接續執行頻率分析
        start();
    } else {
        ClearTables();
    }
    EnableButtons();
    let cname = $("#stid-select :selected").text();
    $(".sta-Cname").text(cname);
});

$("#basin-select").change(async () => {
    refresh();
});

// 重現期選項
$("#duration-select").change( () => {
    DisableButtons();
    drawRainIntensity.plotHisto(TrendLineCheck);
    CopyData();
    StartFrequencyAnalysis();
    EnableButtons();
});

$("#dataToFreq").change( () => {
    $(".Freq-Duration").html("(自定數據)");
    StartFrequencyAnalysis();
});

// 繪製趨勢線
$("#checkTrendLine").change(() => {
    TrendLineCheck = !TrendLineCheck;
    // console.log("TrendLineCheck = ", TrendLineCheck);
    drawRainIntensity.plotHisto(TrendLineCheck);
});

$("#mainForm").click(() => {
    let KSchart = new DrawKSChart(Global_FreqResults.results, "#KSTest-Chart", "#Prob-Chart");
    KSchart.render();
});


$("#FindReturnPeriod").click(function () {
    let rt = new FindReturnPeriod(Global_FreqResults.results);
    let value = $("#EstimateValue").val();
    rt.findRP(value);
});
// ----------------------------------------------------

// --------------- Start Here ------------------

window.onload = async () => {

    await refreshAll();
};
