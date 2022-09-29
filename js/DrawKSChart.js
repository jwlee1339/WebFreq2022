
// DrawKSChart.js
// refactored at 2021-12-17


export class DrawKSChart {
    // json 
    // KSDOM : "#KSTest-Chart"
    // ProbDOM : "#Prob-Chart";

    constructor(json, KSDOM, ProbDOM) {
        this.json = json;
        this.KSDOM = KSDOM;
        this.ProbDOM = ProbDOM;
    }

    /* input
                 lines : [[obs, lowerBound, est, upperBound],...]
                 Dom   : chart id
               output
                 flot chart
            * line1 : est-est
              line2 : est-obs
              line3 : est-lowerBound
              line4 : est-upperBound
            */
    drawKSChart(lines) {

        let getLines = function (index) {
            let data = [];
            for (let i = 0; i < lines.length; i++) {
                let x = +lines[i][2];
                let y = +lines[i][index];
                if (y > 0.1)
                    data.push([x, y]);
                else data.push([x, null]);
            }
            return data;
        }
        let obs = getLines(0);
        let est = getLines(2);
        let lb = getLines(1);
        let ub = getLines(3);

        let dataset = [{
            label: "觀測",
            color: "#0033ff",
            data: obs,
            yaxis: 1,
            lines: { show: false },
            points: { show: true }
        },
        {
            label: "下限",
            color: "#ffeb3b",
            data: lb,
            lines: { show: true }
        },
        {
            label: "估計值",
            color: "#ff9800",
            data: est,
            lines: { show: true, lineWidth: 2 }
        },
        {
            label: "上限",
            color: "#f44336",
            data: ub,
            lines: { show: true }
        }];

        let userTickSize = 50;
        let barOptions = {
            series: {
            },
            xaxis: {
                axisLabel: "估計值"
            },
            yaxis: {
                position: "left"
                // axisLabel: "(m)",
            },
            grid: {
                hoverable: true
            },
            legend: {
                position: "nw",
                show: true
            },
            legend: {
                position: "nw",
                noColumns: 4,
                margin: [0, -22],
                show: true
            },
            tooltip: true,
            tooltipOpts: {
                content: "(%x.2, %y.2)"
            }
        };

        $.plot(this.KSDOM, dataset, barOptions);
    }

    /* input
         lines : [[prob, obs, lowerBound, est, upperBound],...]
         Dom   : chart id
       output
         flot chart
    * line1 : prob-est
      line2 : prob-obs
      line3 : prob-lowerBound
      line4 : prob-upperBound
    */
    drawProbChart(lines) {

        let getLines = function (index) {
            let data = [];
            for (let i = 0; i < lines.length; i++) {
                let x = +lines[i][0];
                let y = +lines[i][index];
                if (y > 0.1)
                    data.push([x, y]);
                else data.push([x, null]);
            }
            return data;
        }
        let obs = getLines(1);
        let est = getLines(3);
        let lb = getLines(2);
        let ub = getLines(4);

        let dataset = [{
            label: "觀測",
            color: "#0033ff",
            data: obs,
            yaxis: 1,
            lines: { show: false },
            points: { show: true }
        },
        {
            label: "下限",
            color: "#ffeb3b",
            data: lb,
            lines: { show: true }
        },
        {
            label: "估計值",
            color: "#ff9800",
            data: est,
            lines: { show: true, lineWidth: 2 }
        },
        {
            label: "上限",
            color: "#f44336",
            data: ub,
            lines: { show: true }
        }];

        let userTickSize = 50;
        let barOptions = {
            series: {
            },
            xaxis: {
                axisLabel: "機率(1-m/(N+1))"
            },
            yaxis: {
                position: "left"
                // axisLabel: "(m)",
            },
            grid: {
                hoverable: true
            },
            legend: {
                position: "nw",
                show: true
            },
            legend: {
                position: "nw",
                noColumns: 4,
                margin: [0, -22],
                show: true
            },
            tooltip: true,
            tooltipOpts: {
                content: "(%x.2, %y.2)"
            }
        };

        $.plot(this.ProbDOM, dataset, barOptions);
    }

    // prepare data for KS chart;
    generateKSdata = (ks) => {
        let data = [];
        for (let i = 0; i < ks.obs.length; i++) {
            data.push([ks.obs[i], ks.lowerBound[i], ks.est[i], ks.upperBound[i]]);
        }
        return data;
    }

    // Probability Chart
    // prepare data for KS chart;
    generateProbdata = (ks) => {
        let data = [];
        for (let i = 0; i < ks.obs.length; i++) {
            data.push([1.0 - ks.prob[i], ks.obs[i], ks.lowerBound[i], ks.est[i], ks.upperBound[i]]);
        }
        return data;
    }

    genKS = (ks) => {
        let tr = "", td = "";
        let markColor;

        for (let i = 0; i < ks.obs.length; i++) {
            let o = ks.obs[i];
            markColor = "w3-text-green";
            td = `<td>${o.toFixed(1)}</td>`;
            td += `<td>${ks.prob[i].toFixed(2)}</td>`;
            td += `<td>${ks.lowerBound[i].toFixed(2)}</td>`;
            td += `<td>${ks.est[i].toFixed(2)}</td>`;
            td += `<td>${ks.upperBound[i].toFixed(2)}</td>`;
            if (ks.mark[i] === "-" || ks.mark[i] === "+")
                markColor = "w3-text-red";
            td += `<td class='${markColor}'><strong>${ks.mark[i]}</strong></td>`;
            tr += `<tr>${td}</tr>`;
        }
        return tr;
    }

    render() {

       
        let iDist = $("#mainForm :checked").val();

        let tr = this.genKS(this.json[iDist].KSTest_Results);

        $("#KSTest-tbody").html(tr);

        // draw KS chart
        let ksData = this.generateKSdata(this.json[iDist].KSTest_Results);

        this.drawKSChart(ksData);

        let distString = "";
        switch (+iDist) {
            case 0: distString = "常態分布"; break;
            case 1: distString = "對數常態分布"; break;
            case 2: distString = "皮爾森第三類分布"; break;
            case 3: distString = "對數皮爾森第三類分布"; break;
            case 4: distString = "極端值第一類分布"; break;
        }
        distString = "<strong>" + distString + "(95%)" + "</strong>";
        $(".KS-Chart-Title").html(distString);


        // draw Prob chart
        let ProbData = this.generateProbdata(this.json[iDist].KSTest_Results);

        this.drawProbChart(ProbData);
    }
}