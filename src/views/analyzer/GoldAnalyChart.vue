<script>
import { Line } from "vue-chartjs";
import { getStyle, hexToRgba } from "@coreui/coreui/dist/js/coreui-utilities";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";
import { random } from "@/shared/utils";
import { formatDate } from "@/shared/date";
import VueResource from "vue-resource";
import Vue from "vue";
import layer from "vue-layer";
Vue.use(VueResource);
Vue.prototype.$layer = layer(Vue);

let vue;
let Utils = {
  _this :'',
  register:function($this){
      this._this = $this;
  },
  /**
   * 数据刷新
   */
  reloadChart: function(opt) {
    switch (opt) {
      case 0:
        this.api.loadDay();
        break;
      case 1:
        this.api.loadWeek();
        break;
      case 2:
        this.api.loadMonth();
        break;
      case 3:
        this.api.loadYear();
        break;
      default:
        break;
    }
    console.log(opt);
  },
  api: {
    loadDay: function() {
      this.load(0);
    },
    loadWeek: function() {
      this.load(1);
    },
    loadMonth: function() {
      this.load(2);
    },
    loadYear: function() {
      this.load(3);
    },
    load: function(opt) {
      vue.$http.get("/api/data/gold/load/"+opt).then(
        function(res) {
          console.log("load success!");
          if (res.data.code != "0x00000000") {
            vue.$layer.msg("数据加载失败");
            throw new Error("load data failed");
          }
          Utils._this.render(res.data.data);
        },
        function() {
          throw new Error("load data failed");
        }
      );
    }
  }
};

export default {
  enums: {
    ENUM_CHART_OPT_ARRAY: ["Day", "Week", "Month", "Year"]
  },
  extends: Line,
  props: ["height"],
  mounted() {
    vue = this;
    Utils.register(this);
    this.load();
  },
  refresh: function(opt) {
    let index = this.enums.ENUM_CHART_OPT_ARRAY.indexOf(opt);
    Utils.reloadChart(index);
  },
  methods: {
    /**
     * 加载黄金历史数据
     */
    load: function() {
      Utils.api.loadDay();
    },
    /**
     * 渲染表格
     */
    render: function(data) {
      const data1 = data.buyRates;
      const data2 = data.sellRates;
      const data3 = data.referPrices;
      const buyRate = getStyle("--success") || "#4dbd74";
      const sellRate = getStyle("--info") || "#20a8d8";
      const referPrice = getStyle("--danger") || "#f86c6b";
      
      this.renderChart(
        {
          labels: data.scales,
          datasets: [
            {
              label: "购买单价",
              backgroundColor: hexToRgba(buyRate, 10),
              borderColor: buyRate,
              pointHoverBackgroundColor: "#fff",
              borderWidth: 2,
              data: data1
            },
            {
              label: "出售单价",
              backgroundColor: "transparent",
              borderColor: sellRate,
              pointHoverBackgroundColor: "#fff",
              borderWidth: 2,
              data: data2
            },
            {
              label: "平均单价",
              backgroundColor: "transparent",
              borderColor: referPrice,
              pointHoverBackgroundColor: "#fff",
              borderWidth: 1,
              borderDash: [8, 5],
              data: data3
            }
          ]
        },
        {
          tooltips: {
            enabled: false,
            custom: CustomTooltips,
            intersect: true,
            mode: "index",
            position: "nearest",
            callbacks: {
              labelColor: function(tooltipItem, chart) {
                return {
                  backgroundColor:
                    chart.data.datasets[tooltipItem.datasetIndex].borderColor
                };
              }
            }
          },
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  drawOnChartArea: false
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  maxTicksLimit: 10,
                  stepSize: Math.ceil(20),
                  max: data.max + 20,
                  min: data.min==0 ? 250: data.min - 20
                },
                gridLines: {
                  display: true
                }
              }
            ]
          },
          elements: {
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4,
              hoverBorderWidth: 3
            }
          }
        }
      );
    }
  }
};
</script>
