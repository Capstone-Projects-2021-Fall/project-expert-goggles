// Create objects which contain list of d3 functions, confirm that parser reads functions and reaches correct conclusion

const chai = window.chai
const expect = chai.expect

const visLineChart = { };
visLineChart.funcList = ["select", "timeParse", "scaleTime", "timeFormat", "scaleLinear", "line", "tsv", "extent", "axisBottom", "axisLeft", "format"];
visLineChart.argList = [];
visLineChart.sender = "ExpertGoggles";
visLineChart.iframeList = [];

const visAreaChart = { };
visLineChart.funcList = ["select", "timeParse", "scaleTime", "timeFormat", "scaleLinear", "area", "tsv", "extent", "max", "axisBottom", "axisLeft", "format"];
visLineChart.argList = [];
visLineChart.sender = "ExpertGoggles";
visLineChart.iframeList = [];

const visBarChart = { };
visLineChart.funcList = ["format", "linear", "0", "ordinal", "range", "axis", "select", "qualify", "csv", "dispatch", "rebind", "max", "transition"];
visLineChart.argList = [];
visLineChart.sender = "ExpertGoggles";
visLineChart.iframeList = [];

const visBoxPlot = { };
visLineChart.funcList = ["csv", "dispatch", "rebind", "functor", "select", "qualify", "acending", "quantile", "range", "linear", "0", "format"];
visLineChart.argList = [];
visLineChart.sender = "ExpertGoggles";
visLineChart.iframeList = [];

const visCirclePackingChart = { };
visLineChart.funcList = ["select", "format", "pack", "json", "hierarchy"];
visLineChart.argList = [];
visLineChart.sender = "ExpertGoggles";
visLineChart.iframeList = [];

const visDifferenceChart= { };
visLineChart.funcList = ["format", "scale", "linear", "0", "rebind", "axis", "area", "select", "qualify", "tsv", "dispatch", "extent", "min", "max", "biscect", "day" , "transition", "range"];
visLineChart.argList = [];
visLineChart.sender = "ExpertGoggles";
visLineChart.iframeList = [];

const visHeatmap = { };
visLineChart.funcList = ["scaleSequential", "json", "select", "rgb"];
visLineChart.argList = [];
visLineChart.sender = "ExpertGoggles";
visLineChart.iframeList = [];

const visHistogram = { };
visLineChart.funcList = ["select", "histogram", "ordinal", "linear", "0", "axis", "rebind", "range", "format", "min", "max", "bisect", "qualify", "transition"];
visLineChart.argList = [];
visLineChart.sender = "ExpertGoggles";
visLineChart.iframeList = [];
//difference chart, heatmap, histogram

describe('All guide types should be properly recognized', () => {
    it('Line Charts should be recognized', () => {
        expect(parseType(visLineChart)).to.equal('line_chart')
    })
    it('Area Charts should be recognized', () => {
       expect(parseType(visAreaChart)).to.equal('area_chart') 
    })
    it('Bar Charts should be recognized', () => {
        expect(parseType(visBarChart)).to.equal('bar_chart') 
     })
     it('Box Plots should be recognized', () => {
        expect(parseType(visBoxPlot)).to.equal('box_plot') 
     })
     it('Circle Packing Charts should be recognized', () => {
        expect(parseType(visCirclePackingChart)).to.equal('circle_packing_chart') 
     })
     it('Difference Chart should be recognized', () => {
        expect(parseType(visCirclePackingChart)).to.equal('Difference chart') 
     })
     it('Heatmap should be recognized', () => {
        expect(parseType(visCirclePackingChart)).to.equal('heatmap') 
     })
     it('Histogram should be recognized', () => {
        expect(parseType(visCirclePackingChart)).to.equal('histogram') 
     })
})