<template>
  <div class="mod-storage_storage">
    <!-- 材料单 -->
    <el-drawer title="材料单" direction='rtl' size='60%' :visible.sync="drawer" :modal='false'>
      <el-row style="margin: 5px 20px;border-top:1px solid;padding-top:5px">
        <el-col :span="6">
          <el-select v-model="custom" filterable placeholder="请选择顾客" style="width:100%">
            <el-option v-for="item in customsOption" :key="item.customId" :label="item.customName"
              :value="item.customId">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin: 5px 20px">
        <el-table show-summary :data="detailDatas"  border style="width: 100%">
          <template v-for="item in drawerTableHead">
            <el-table-column v-if="item.name == 'partsOutNum'" :prop="item.name" :label="item.label" :key="item.name">
              <template slot-scope="scope">
                <el-input v-model="scope.row.partsOutNum" @input='changeRowTotal($event,scope.row)' type="number"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.name == 'partsOutPrice'" :prop="item.name" :label="item.label"
              :key="item.name">
              <template slot-scope="scope">
                <el-input v-model="scope.row.partsOutPrice" @input='changeRowTotal($event,scope.row)' type="number"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.name == 'rowTotal'" :prop="item.name" :label="item.label" :key="item.name">
              <template slot-scope="scope">
                <el-input v-model="scope.row.rowTotal" :disabled="true"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-else :prop="item.name" :label="item.label" :key="item.name">
            </el-table-column>
          </template>
          <el-table-column prop="options" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deleteHandle(scope.$index)"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin: 10px 20px">
        <!-- <el-col :span="4" :offset="1"> -->
        <el-button @click="submitParts()" type="primary">提交材料单</el-button>
        <!-- </el-col> -->
      </el-row>

    </el-drawer>



    <el-row>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="配件编码:">
          <el-input clearable v-model="dataForm.partsId"></el-input>
        </el-form-item>
        <el-form-item label="配件名称:">
          <el-input clearable v-model="dataForm.partsName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()">查询</el-button>
          <el-button v-if="isAuth('storage:storage:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button @click="reset">重置</el-button>
          <!-- <el-button @click="drawer = true" type="primary" style="margin-left: 16px;">
            打开材料单
          </el-button> -->
        </el-form-item>
      </el-form>

    </el-row>
    <el-row>
      <el-table :data="dataList" @selection-change="handleSelectionChange" Checkbox border style="width: 100%"
        :row-key="getRowKey">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <template v-for="item in tableHead">
          <el-table-column :prop="item.name" :label="item.label" :key="item.name"></el-table-column>
        </template>
      </el-table>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-button style="margin-top:15px" type="primary" @click="addTodetails">添加到材料单</el-button>
        <el-button @click="drawer = true" type="primary"> 打开材料单</el-button>
      </el-col>

      <el-col :span="12">
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="page"
          :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="total"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-col>
    </el-row>
    <changeStorage v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></changeStorage>
  </div>
</template>
<script>
  import mixins from '@/mixin/view-mixin'
  import changeStorage from './storage-add-or-update'
  export default {
    mixins: [mixins],
    components: {
      changeStorage
    },
    data() {
      return {
        mixinOptions: {
          getDataList: '/storage/storage/getDataList',
          isPage: true,
          // createdIsNeed: false,
        },
        custom: '', //客户id
        customsOption: [],
        addOrUpdateVisible: false,
        dataForm: {
          partsId: '',
          partsName: ''
        },
        tableHead: [{
          name: 'partsId',
          label: '配件编码'
        }, {
          name: 'partsName',
          label: '配件名称'
        }, {
          name: 'partsInPrice',
          label: '平均进价'
        }, {
          name: 'partsNum',
          label: '库存数量'
        }],
        multipleSelection: [], //外层选中数据
        detailDatas: [], //材料单数据
        drawer: false,
        drawerTableHead: [{
            name: 'partsId',
            label: '配件编码'
          }, {
            name: 'partsName',
            label: '配件名称'
          }, {
            name: 'partsInPrice',
            label: '平均进价'
          }, {
            name: 'partsNum',
            label: '库存数量'
          }, {
            name: 'partsOutNum',
            label: '出库数量'
          },
          {
            name: 'partsOutPrice',
            label: '单价'
          }, {
            name: 'rowTotal',
            label: '小计'
          }
        ]
      }
    },
    watch: {
      //   detailDatas: function (val) {
      //     console.log(val);
      //   }
    },
    activated() {
      // this.dataList = [{
      //   partsId: "PJ0001",
      //   partsName: '测试配件1',
      //   inPrice: 100,
      //   storageNum: 30
      // }]
    },
    methods: {
      // 重置
      reset() {
        this.dataForm = {
          partsId: '',
          partsName: ''
        }
      },
      // 新增
      addOrUpdateHandle(row) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          // console.log(this.$refs.addOrUpdate);
          this.$refs.addOrUpdate.init(row)
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 添加到出库单
      addTodetails() {
        let tempDetails = JSON.parse(JSON.stringify(this.detailDatas))
        if (this.detailDatas.length == 0) {
          this.multipleSelection.forEach(item=>{
            item.partsOutNum = 0
            // console.log(item);
          })
          this.detailDatas = JSON.parse(JSON.stringify(this.multipleSelection))
        } else {
          for (let index in this.multipleSelection) {
            this.multipleSelection[index].partsOutNum = 0
            // console.log(this.multipleSelection[index].partsOutNum);
            let flag = true // 标识item是否可操作，操作过，说明有重复且已合并，后续的遍历不再操作
            tempDetails.filter((item, i) => {
              
              if (item.partsId == this.multipleSelection[index].partsId) {
                console.log(11111111111);
                console.log(item);
                console.log(this.multipleSelection[index]);
                this.detailDatas[i] = JSON.parse(JSON.stringify(this.multipleSelection[index]))
                flag = false
              } else if(i == tempDetails.length-1 && flag){
                console.log(222222222222222);
                this.detailDatas.push(JSON.parse(JSON.stringify(this.multipleSelection[index])))
              }
            })
          }
        }
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
      },
      // 删除操作
      deleteHandle(index) {
        console.log(index);
        let tempPromise = new Promise((res, rej) => {
          this.detailDatas.splice(index, 1)
          res(true)
        })
        tempPromise.then(res => {
          if (res == true) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          }
        })
      },
      // 提交出库单
      submitParts() {
        let flag = true
        for (let index in this.detailDatas) {
          let temp = this.detailDatas[index]
          if (temp.partsOutNum > temp.partsNum) {
            flag = false
            this.$message({
              type: 'error',
              message: '出库数量不能大于库存数量！',
              customClass: 'zZindex'
            })
          }
        }
        // if (this.custom == '') {
        //   flag = false
        //   this.$message({
        //     type: 'error',
        //     message: '请选择客户！',
        //     customClass: 'zZindex'
        //   })
        // }
        console.log(flag);
        if (flag) {
          this.$http({
            url: this.$http.adornUrl('/storage/storage/outDetail'),
            method: 'post',
            data: {
              details: this.detailDatas,
              custom: this.custom
            }
          })
        }
      },
      //刷新数据不清空选择的数据
      getRowKey(row) {
        return row.partsId
      },
      // 改变小计
      changeRowTotal(event, row) {
        // console.log(row);
        row.rowTotal = row.partsOutPrice * row.partsOutNum
      }
    }
  }

</script>
<style>
  .el-table .cell {
    text-align: center !important;
  }

  .zZindex {
    z-index: 3000 !important;
  }

  /* .el-input {
    width: 130px;
  } */

</style>
