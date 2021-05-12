<template>
  <div class="mod-storage_storage">
      <!-- 材料单 -->
    <el-drawer title="材料单" direction='rtl' size='60%' :visible.sync="drawer">
      
      <el-table show-summary :data="detailDatas" @selection-change="handleSelectionChange" Checkbox border
        style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <template v-for="item in drawerTableHead">
          <el-table-column v-if="item.name == 'outNum'" :prop="item.name" :label="item.label" :key="item.name">
            <template slot-scope="scope">
              <el-input v-model="scope.row.outNum"></el-input>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.name == 'price'" :prop="item.name" :label="item.label" :key="item.name">
            <template slot-scope="scope">
              <el-input v-model="scope.row.price"></el-input>
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
            <el-button type="text" size="small" @click="deleteHandle(scope.row.index)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top:10px">
          <el-col :span="4" :offset="1">
              <el-button @click="submitParts()" type="primary">提交材料单</el-button>
          </el-col>
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
      <el-table :data="dataList" @selection-change="handleSelectionChange" Checkbox border style="width: 100%">
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

  </div>
</template>
<script>
  import mixins from '@/mixin/view-mixin'
  export default {
    mixins: [mixins],
    data() {
      return {
        mixinOptions: {
          getDataList: '/storage/storage/getDataList',
          createdIsNeed: false,
        },
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
          name: 'inPrice',
          label: '平均进价'
        }, {
          name: 'storageNum',
          label: '库存数量'
        }],
        multipleSelection: [],
        detailDatas: [],
        drawer: false,
        drawerTableHead: [{
            name: 'partsId',
            label: '配件编码'
          }, {
            name: 'partsName',
            label: '配件名称'
          }, {
            name: 'inPrice',
            label: '平均进价'
          }, {
            name: 'storageNum',
            label: '库存数量'
          }, {
            name: 'outNum',
            label: '出库数量'
          },
          {
            name: 'price',
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
    components: {},
    activated() {
      this.dataList = [{
        partsId: "PJ0001",
        partsName: '测试配件1',
        inPrice: 100,
        storageNum: 30
      }]
    },
    methods: {
      reset() {
        this.dataForm = {}
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      addTodetails() {
        let tempDetails = JSON.parse(JSON.stringify(this.detailDatas))
        if (this.detailDatas.length == 0) {
          this.detailDatas = JSON.parse(JSON.stringify(this.multipleSelection))
        } else {
          for (let index in this.multipleSelection) {
            tempDetails.filter((item, i) => {
              if (item.partsId == this.multipleSelection[index].partsId) {
                this.detailDatas[i] = this.multipleSelection[index]
              } else {
                this.detailDatas.push(this.multipleSelection[index])
              }
              return i
            })
          }
        }
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
      },
      deleteHandle(index) {
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
      submitParts(){
          
      },
    }
  }

</script>
<style>
  .el-table .cell {
    text-align: center !important;
  }

  /* .el-input {
    width: 130px;
  } */

</style>
