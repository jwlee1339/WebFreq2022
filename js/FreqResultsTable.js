// FreqResultsTabls.js
// 2022-01-14

// 頻率分析結果表

export class FreqResultsTabls{
    // json : json data from api
    // DOM : "Freq-Results-Table"
    constructor(json, DOM)
    {
        this.json = json;
        this.DOM = DOM;
    }

    // 生成表格

    genTable = () => {
        let tr = "", td = "";
        for (let i = 0; i < this.json.length; i++) {
            let dist = this.json[i];
            td = `<td>${dist.probDist}</td>`;
            for (let j = 0; j < dist.estmateResults.length - 1; j++) {
                td += `<td>${dist.estmateResults[j].toFixed(1)}</td>`;
            }
            td += `<td id='estimatedResult_${i}' class='w3-yellow'>-</td>`;
            tr += `<tr>${td}</tr>`;
        }
        return tr;
    }

    genHTML(tr){
        let html = `
        <div class="table-responsive">
        <table class="table table-bordered table-striped table-condensed">
            <thead>
                <tr class="w3-green">
                    <td>機率分布</td>
                    <td>1.11年</td>
                    <td>2年</td>
                    <td>5年</td>
                    <td>10年</td>
                    <td>20年</td>
                    <td>25年</td>
                    <td>50年</td>
                    <td>100年</td>
                    <td>200年</td>
                    <td>500年</td>
                    <td>估計結果</td>
                </tr>
            </thead>
            <tbody>${tr}</tbody>
        </table>
    </div>
        `
        return html;
    }

    render(){
        let tr = this.genTable();
        let html = this.genHTML(tr);
        
        document.getElementById(this.DOM).innerHTML = html;
    }
}