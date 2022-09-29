// FrequencyAnalysis.js
// refactored at 2021-12-18

import { Ajax } from "../Common/FetchTimeOut.js";
import { ProbTestAndFreqUrl } from "./Ajax/url.js";
import { DrawKSChart } from "./DrawKSChart.js";
import { StatisticTestSummary } from "./StatisticTestSummary.js";
import { FreqResultsTabls } from "./FreqResultsTable.js";

export let Global_FreqResults = {
    data: undefined,
    results: undefined
};

export class FrequencyAnalysis {

    constructor(data) {
        this.data = data;
    }

    // 取得頻率分析結果
    // 輸入 
    //   data : 資料序列
    async FetchResults() {

        if (this.data === undefined || this.data.length == 0) {
            console.log({ message: "讀取頻率分析結果發生錯誤!" })
            return undefined;
        }
        Global_FreqResults.data = this.data;

        // console.log({data : data})
        let url = ProbTestAndFreqUrl + `?data=${this.data}`
        let timeLimit = 10000;
        try {
            let json = await Ajax(url, {}, timeLimit);
            Global_FreqResults.results = json;
            return json;

        } catch (error) {
            console.log("FetchResults() Error! ", error);
            return undefined;
        }

    }


    // 頻率分析主程式
    async render() {
        let values = this.data.split(",");
        if (values.length == 0) {
            console.log("FrequencyAnalysis() : No data!");
            console.log({ values: values });
        }
        else if (values.length > 5) {
            $("#text-message").css("display", "none");

            if (values.length > 20) {
                $("#text-message-warning").css("display", "none");
            } else {
                $("#text-message-warning").css("display", "block");
            }
            // 呼叫API取得頻率分析結果
            let json = await this.FetchResults();

            if (json !== undefined) {
                // 頻率分析結果表
                let freqResultsTable = new FreqResultsTabls(json, "Freq-Results-Table")
                freqResultsTable.render();

                // console.log({json: json})
                // KS 檢定圖
                let KSchart = new DrawKSChart(json, "#KSTest-Chart", "#Prob-Chart");
                KSchart.render();

                // 統計檢定總覽
                let testSummary = new StatisticTestSummary(json, "test-results");
                testSummary.render();
            }
        }
        else {
            $("#text-message-warning").css("display", "none");
            $("#text-message").css("display", "block");
            let td = "<tr><td colspan=12>統計年份少於五年</td></tr>";
            $("#test-results").html(td);
            $("#Freq-Results-Table").html(td);
        }
    }
}