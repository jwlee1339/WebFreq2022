// StatisticsTable.js
// 2022-01-13

// 各延時降雨量統計表

export class StatisticsTable {

    constructor(json, DOM) {
        this.json = json;
        this.DOM = DOM;
    }
    TableTitle(){
        let Dur = this.json.dur;
        let td = "<td>年</td>";
        for (let i = 0; i < Dur.length; i++) {
            td += `<td>${Dur[i]}<br/>分鐘</td>`;
        }
        let th = `<tr class='w3-blue'>${td}</tr>`;
        return th;
    }
    // each row of 各延時降雨量統計表
    TableRow (tb, nDigit) {
        let td1 = "";
        if (tb == null) return "<td>--</td>"
        for (let j = 0; j < this.json.dur.length; j++) {
            let ri = tb[j];
            if (ri == "NaN") {
                td1 += "<td>--</td>";
            } else {
                td1 += `<td>${ri.toFixed(nDigit)}</td>`;
            }
        }
        return td1;
    }

    // 各延時降雨量統計表
    generateStatistics() {
        if (this.json == null) return;
        let tr = "", td = "";
        td = "<td>最小值</td>";
        let td1 = this.TableRow(this.json.Min, 1);
        tr += "<tr>" + td + td1 + "</tr>";

        td = "<td>最大值</td>";
        td1 = this.TableRow(this.json.Max, 1);
        tr += "<tr>" + td + td1 + "</tr>";

        td = "<td>平均值</td>";
        td1 = this.TableRow(this.json.Mean, 1);
        tr += "<tr>" + td + td1 + "</tr>";

        td = "<td>標準偏差</td>";
        td1 = this.TableRow(this.json.Std, 2);
        tr += "<tr>" + td + td1 + "</tr>";

        td = "<td>變異係數</td>";
        td1 = this.TableRow(this.json.Cv, 3);
        tr += "<tr>" + td + td1 + "</tr>";

        td = "<td>偏態係數</td>";
        td1 = this.TableRow(this.json.Cs, 3);
        tr += "<tr>" + td + td1 + "</tr>";

        return tr;
    }

    genHTML(title, tr) {
        let html =
            `
        <div class="row">
        <div class="col-12">
            <p class="w3-xlarge w3-center">
                <span class="sta-Cname"></span>
                各延時降雨量統計表
                
            </p>
            <div class="table-responsive">
                <table class="table table-bordered table-striped table-condensed">
                    <thead>${title}</thead>
                    <tbody>${tr}</tbody>
                </table>
            </div>
        </div>
    </div>`
        return html;
    }

    render() {
        let title = this.TableTitle();
        let tr = this.generateStatistics();
        let html = this.genHTML(title, tr);
        $(this.DOM).html(html);
    }
}