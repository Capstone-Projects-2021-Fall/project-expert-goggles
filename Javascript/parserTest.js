// Create objects which contain list of d3 functions, confirm that parser reads functions and reaches correct conclusion

const chai = window.chai;
const expect = chai.expect;

const visLineChart = { };
visLineChart.funcList = ["select", "timeParse", "scaleTime", "timeFormat", "scaleLinear", "line", "tsv", "extent", "axisBottom", "axisLeft", "format"];
visLineChart.argList = [];
visLineChart.sender = "ExpertGoggles";
visLineChart.iframeList = [];

const visAreaChart = { };
visAreaChart.funcList = ["select", "timeParse", "scaleTime", "timeFormat", "scaleLinear", "area", "tsv", "extent", "max", "axisBottom", "axisLeft", "format"];
visAreaChart.argList = [];
visAreaChart.sender = "ExpertGoggles";
visAreaChart.iframeList = [];

const visBarChart = { };
visBarChart.funcList = ["format", "linear", "0", "ordinal", "range", "axis", "select", "qualify", "csv", "dispatch", "rebind", "max", "transition"];
visBarChart.argList = [];
visBarChart.sender = "ExpertGoggles";
visBarChart.iframeList = [];

const visBoxPlot = { };
visBoxPlot.funcList = ["csv", "dispatch", "rebind", "functor", "select", "qualify", "acending", "quantile", "range", "linear", "0", "format"];
visBoxPlot.argList = [];
visBoxPlot.sender = "ExpertGoggles";
visBoxPlot.iframeList = [];

const visCirclePackingChart = { };
visCirclePackingChart.funcList = ["select", "format", "pack", "json", "hierarchy"];
visCirclePackingChart.argList = [];
visCirclePackingChart.sender = "ExpertGoggles";
visCirclePackingChart.iframeList = [];

const visDifferenceChart= { };
visDifferenceChart.funcList = ["format", "scale", "linear", "0", "rebind", "axis", "area", "select", "qualify", "tsv", "dispatch", "extent", "min", "max", "biscect", "day" , "transition", "range"];
visDifferenceChart.argList = [];
visDifferenceChart.sender = "ExpertGoggles";
visDifferenceChart.iframeList = [];

const visHeatmap = { };
visHeatmap.funcList = ["scaleSequential", "json", "select", "rgb"];
visHeatmap.argList = [];
visHeatmap.sender = "ExpertGoggles";
visHeatmap.iframeList = [];

const visHistogram = { };
visHistogram.funcList = ["select", "histogram", "ordinal", "linear", "0", "axis", "rebind", "range", "format", "min", "max", "bisect", "qualify", "transition"];
visHistogram.argList = [];
visHistogram.sender = "ExpertGoggles";
visHistogram.iframeList = [];
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
        expect(parseType(visDifferenceChart)).to.equal('Difference chart')
     })
     it('Heatmap should be recognized', () => {
        expect(parseType(visHeatmap)).to.equal('heatmap')
     })
     it('Histogram should be recognized', () => {
        expect(parseType(visHistogram)).to.equal('histogram')
     })
})