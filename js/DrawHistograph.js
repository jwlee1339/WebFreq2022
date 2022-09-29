// DrawHistograph.js
// 2021-12-17 refactored
// 2022-01-13 改為class

// 繪製歷年降雨強度柱狀圖

export class DrawRainIntensity {

    // data : 從伺服器取得之歷年降雨強度資料
    // DOM : "#historic-Chart"
    constructor(data, DOM) {
        this.dataJson = data;
        this.DOM = DOM;
    }


    // 線性迴歸
    // y = m * x + b
    // input xy = [{date : date, intens: intensity }]
    // output { slope: m, intercept: b, cor: cor };

    LinearRegresstion(xy) {
        // retrieve data from xy
        let x = [], y = [];
        for (let i = 0; i < xy.length; i++) {
            x.push(xy[i].date);
            y.push(xy[i].intens);
        }
        // find average of x, y
        let xAvg = 0.0;
        let yAvg = 0.0;
        for (let i = 0; i < x.length; i++) {
            xAvg += Number(x[i]);
            yAvg += Number(y[i]);
        }
        xAvg = xAvg / x.length;
        yAvg = yAvg / y.length;

        // compute m
        let sumx = 0.0;
        let sumy = 0.0;
        let sumyy = 0.0;

        for (let i = 0; i < x.length; i++) {
            sumx += (x[i] - xAvg) * (y[i] - yAvg);
            sumy += (x[i] - xAvg) * (x[i] - xAvg);
            sumyy += (y[i] - yAvg) * (y[i] - yAvg);
        }
        let m = sumx / sumy;
        let b = yAvg - xAvg * m;

        // compute coorelation coefficient
        let cor = sumx / Math.sqrt(sumy) / Math.sqrt(sumyy);
        return { slope: m, intercept: b, cor: cor };
    }

    // 準備資料
    prepareData(iDur) {
        let data = [];
        let date = this.dataJson.year;
        for (let i = 0; i < date.length; i++) {
            data.push({ date: date[i], intens: this.dataJson.intens[i][iDur] });
        }
        return data;
    }

    // 降雨直方圖
    // input :  lines = [[datetime, rain, predY],...]

    drawHistograph(lines, avg, dom) {
        let d = [];
        let maxY = Number(-1.0);
        let sum = Number(0);
        let e = [];
        let predY = [];

        for (let i = 0; i < lines.length; i++) {
            let p = [];
            let tm = lines[i][0];
            p.push(tm);
            let y = parseFloat(lines[i][1]);
            let rain;
            if (y < -999) {
                y = null;
                rain = Number(0);
            } else {
                if (maxY < y) maxY = y;
                rain = y;
            }
            p.push(y);   // y
            d.push(p);
        }

        // prepare predY
        // console.log({ lines: lines })
        if (lines[0].length > 2) {
            for (let i = 0; i < lines.length; i++) {
                predY.push([lines[i][0], lines[i][2]]);
            }
        }

        let r = lines.length;
        let Line_avg = [[d[0][0], avg], [d[r - 1][0], avg]];
        let dataset = [{
            label: "雨量(mm)",
            color: "#009688",// teal   //"#2196F3",  // blue
            data: d,
            yaxis: 1,
            bars: {
                show: true,
                barWidth: 0.9,
                fillColor: { colors: [{ opacity: 0.5 }, { opacity: 1 }] },
                lineWidth: 1,
                align: "center"
            }
        },
        {
            label: "平均值",  // w3-orange
            color: "#ff9800",
            data: Line_avg,
            lines: { show: true }
        },
        {
            label: "趨勢線",
            color: "#e91e63",  // w3-pink
            data: predY,
            dashes: { show: true }
        }];

        let Ymax = maxY * 1.33;
        if (Ymax < maxY) Ymax = Math.ceil(maxY / 10) * 10;
        let Ytick = 20;
        if (maxY > 200 && maxY < 1000)
            Ytick = 50;
        if (maxY >= 1000)
            Ytick = 100;
        let barOptions = {
            series: {
            },
            xaxis: {
                tickFormatter: function (val, axis) { return val.toFixed(0) },
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 14,
                axisLabelFontFamily: '微軟正黑體',
                axisLabelPadding: 40
            },
            yaxes: [{
                position: "left",
                axisLabelFontSizePixels: 12,
                min: 0.0,
                max: Ymax,
                tickSize: Ytick,
                axisLabel: "降雨量(mm)"
            }
            ],
            grid: {
                hoverable: true
            },
            legend: {
                position: "nw",
                noColumns: 3,
                margin: [0, -22],
                show: true
            },
            tooltip: true,
            tooltipOpts: {
                content: "年份：%x年，雨量：%y.1 mm"
            }
        };
        $.plot(dom, dataset, barOptions);
        return;
    } // end of function()

    // 產生降雨延時選項
    generateDuration(array) {
        if (array == null) return "";
        let userIndex = $("#duration-select :selected").index();
        let opt = "";
        for (let i = 0; i < array.length; i++) {
            if (i == userIndex)
                opt += `<option selected>${array[i]}</option>`;
            else
                opt += `<option>${array[i]}</option>`;
        }
        $("#duration-select").html(opt);
    }

    // 繪製組體圖 趨勢線

    plotHisto(TrendLineCheck) {

        let iDur = $("#duration-select :selected").index();
        let data = this.prepareData(iDur);

        // console.log({ data: data })
        // push into data1 to draw

        let data2 = [];
        for (let i = 0; i < data.length; i++) {
            data2.push([data[i].date, data[i].intens]);
        }

        if (TrendLineCheck) {
            let results = this.LinearRegresstion(data);
            let x = 0, y = 0;
            let data1 = [];
            for (let i = 0; i < data.length; i++) {
                x = +data[i].date;
                y = +data[i].intens;
                let predY = results.slope * x + results.intercept;
                data1.push([x, y, predY]);
            }
            this.drawHistograph(data1, this.dataJson.Mean[iDur], this.DOM);
            let s = `<strong>平均值: ${this.dataJson.Mean[iDur].toFixed(1)}`;
            s += `(mm), 年增率: ${results.slope.toFixed(2)}(mm/yr)</strong>`;
            $("#chart-subtitle").html(s);
        }
        else {
            this.drawHistograph(data2, this.dataJson.Mean[iDur], this.DOM);
            let s = `<strong>平均值: ${this.dataJson.Mean[iDur].toFixed(1)}`;
            s += "(mm)</strong>";
            $("#chart-subtitle").html(s);
        }
    }
}

