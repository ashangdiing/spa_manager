<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/reportGainings">收支报表</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>收支报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="10" class="search">
        <el-col :span="10">
          <!-- 时间框框 -->
          <span class="demonstration">时间</span>
          <el-date-picker
            v-model="queryParams.dateTime"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="birthdayPickerOptions"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-value="queryParams.dateTime"
          ></el-date-picker>
        </el-col>

        <!-- //显示所有用户 -->

        <el-col :span="10">
          时间类型
          <el-radio-group v-model="queryParams.type" size="mini" @change="changeStatus">
            <el-radio-button label="年"></el-radio-button>
            <el-radio-button label="月"></el-radio-button>
            <el-radio-button label="日"></el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <!-- 工具区 -->
      <el-col :span="10">
           <span class="demonstration">收入情况</span>
        <el-table
          ref="multipleTable"
          :data="reportGainings.list"
          :border="true"
          :highlight-current-row="true"
          :stripe="true"
          :reserve-selection="true"
            show-summary
        >
          <el-table-column label="交易类型" prop="typeDetials" width="100px"></el-table-column>
          <el-table-column label="收入\支出" prop="totalTransactionAmount" width="180px"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="10">
           <span class="demonstration">收入详细情况</span>
        <el-table
          ref="multipleTable"
          :data="reportGainingsDetials.list"
          :border="true"
          :highlight-current-row="true"
          :stripe="true"
          :reserve-selection="true"
          show-summary
        >
          <el-table-column label="交易类型" prop="type" width="100px"></el-table-column>
          <el-table-column label="交易类型详细" prop="typeDetials" width="200px"></el-table-column>
          <el-table-column label="收入\支出" prop="totalTransactionAmount" width="180px"></el-table-column>
        </el-table>
      </el-col>
    </el-card>
  </div>
</template>

<script>
import qs from "qs";
export default {
  watch: {
    queryParams: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        if (val.dateTime) {
          this.changeStatus();
        }
      },
      deep: true
    }
  },
  data() {
    return {
      queryParams: {
        dateTime: "",
        type: "日",
        // datePattern: "yyyyMMdd",
        datePattern: "yyyyMM"
        // datePattern: "yyyy",
      },
      reportGainings: {
        list: []
      },
      reportGainingsDetials: {
        list: []
      },
      birthdayPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          },
          {
            text: "两周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 14);
              picker.$emit("pick", date);
            }
          },
          {
            text: "30天前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", date);
            }
          },
          {
            text: "90天前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", date);
            }
          },
          {
            text: "半年前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一年前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  created() {
    this.queryParams.dateTime = this.getDateTime();
    this.changeStatus();
  },
  methods: {
    getReportGainingsList() {
      this.$http
        .get("/api/rest/report/reportGainings/?1=1", {
          params: this.queryParams
        })
        .then(res => {
          if (res.status != 200) return this.messag.error("获取数据异常");
          this.reportGainings.list = res.data.data;
          console.log("reportGainings", this.reportGainings.list);
        });
    },
    getReportGainingsDetialsList() {
      this.$http
        .get("/api/rest/report/reportGainingsDetials/?1=1", {
          params: this.queryParams
        })
        .then(res => {
          if (res.status != 200) return this.messag.error("获取数据异常");
          this.reportGainingsDetials.list = res.data.data;
          console.log("reportGainingsDetials", this.reportGainings.list);
        });
    },
    //
    changeStatus() {
      console.log("queryParams.type:", this.queryParams.type);
      if (this.queryParams.type == "年") {
        this.queryParams.datePattern = "yyyy";
      } else if (this.queryParams.type == "月") {
        this.queryParams.datePattern = "yyyyMM";
      } else {
        this.queryParams.datePattern = "yyyyMMdd";
      }
      this.getReportGainingsList();
      this.getReportGainingsDetialsList();
    },
     // 时间格式
    getDateTime() {
      var t = new Date();
      var year = t.getFullYear(),
        month = t.getMonth() + 1,
        day = t.getDate(),
        hour = t.getHours(),
        min = t.getMinutes(),
        sec = t.getSeconds();
      var newTime =
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day) +
        " " +
        (hour < 10 ? "0" + hour : hour) +
        ":" +
        (min < 10 ? "0" + min : min) +
        ":" +
        (sec < 10 ? "0" + sec : sec);

      console.log("clock" + newTime);
      return newTime;
    }
  }
};
</script>