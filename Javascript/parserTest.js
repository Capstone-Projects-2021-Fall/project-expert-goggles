// Create objects which contain list of d3 functions, confirm that parser reads functions and reaches correct conclusion

const chai = window.chai
const expect = chai.expect

const visLineChart = { };
visLineChart.funcList = ["line"];
visLineChart.argList = [];
visLineChart.sender = "ExpertGoggles";
visLineChart.iframeList = [];



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
     it('Candlestick Charts should be recognized', () => {
        expect(parseType(visCandlestickChart)).to.equal('candlestick_chart') 
     })
     it('Circle Packing Charts should be recognized', () => {
        expect(parseType(visCirclePackingChart)).to.equal('circle_packing_chart') 
     })
})