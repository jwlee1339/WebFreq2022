// FindReturnPeriod.js
// refactored at 2021-12-17
// estimate return period
// 估計重現期

export class FindReturnPeriod {

    constructor(Global_FreqResults) {
        this.RpStr = ["<1.11", "1.11~2", "2~5", "5~10", "10~20", "10~25",
            "25~50", "50~100", "100~200", "200~500", ">500"];
        this.data = Global_FreqResults;
    }


    // input : q = [Q1.11, Q2,...];
    findReturnPeriod(value, q) {
        // search it
        let n = q.length;
        if (value < q[0])
            return this.RpStr[0] + "年";
        if (value > q[n - 1])
            return this.RpStr[n] + "年";

        let i = 1;
        for (i = 1; i < n - 1; i++) {
            if (value < q[i])
                break;
        }
        let k = i;
        return this.RpStr[k] + "年";
    }

    // UI : find return period
    // value :水文量
    findRP(value) {
        
        let q = [];
        for (let i = 0; i < this.data.length; i++) {
            let dist = this.data[i];
            q = [];
            for (let j = 0; j < dist.estmateResults.length - 1; j++) {
                q.push(dist.estmateResults[j]);
            }
            let s = this.findReturnPeriod(value, q);
            console.log("Estimate of " + value + " = " + s);
            $("#estimatedResult_" + i).text(s);
        }
    }
}