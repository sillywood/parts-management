<template>
  <div class="mod-storage">
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
          <el-button v-if="isAuth('storage:parts:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button  @click="rest">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table :data="dataList" border style="width: 100%">
        <template v-for="item in tableHead">
          <el-table-column :prop="item.name" :label="item.label" :key="item.name"></el-table-column>
        </template>
        <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
          <template slot-scope="scope">
            <el-button v-if="isAuth('storage:parts:update')" type="text" size="small"
              @click="addOrUpdateHandle(scope.row)">修改</el-button>
            <el-button v-if="isAuth('storage:parts:delete')" type="text" size="small"
              @click="deleteHandle(scope.row._id)">
              删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="page"
      :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="total"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <partsAddOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></partsAddOrUpdate>
  </div>
</template>
<script>
  import partsAddOrUpdate from '@/views/modules/storage/parts-add-or-update'
  export default {
    data() {
      return {
        addOrUpdateVisible: false,
        dataForm: {
          partsId: '',
          partsName: ''
        },
        dataList: [
          //   {
          //   partsId: '1',
          //   partsName: '配件1'
          // }
        ],
        page: 1,
        pageSize: 10,
        total: 0,
        tableHead: [{
          name: 'partsId',
          label: '配件编码'
        }, {
          name: 'partsName',
          label: '配件名称'
        }]
      }
    },
    components: {
      partsAddOrUpdate: partsAddOrUpdate
    },
    activated() {
      this.getDataList()
    },
    methods: {
      getDataList() {
        // console.log(2222222222222);
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/storage/parts/getDataList'),
          method: 'get',
          params: this.$http.adornParams({
            "partsName": this.dataForm.partsName,
            "partsId": this.dataForm.partsId,
            'page': this.page,
            'limit': this.pageSize,
          })
        }).then(({
          data
        }) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.total = data.page.total
          } else {
            this.dataList = []
            this.total = 0
          }
          this.dataListLoading = false
        })
      },
      sizeChangeHandle(val) {
        this.pageSize = val
        this.page = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle(val) {
        this.page = val
        this.getDataList()
      },
      deleteHandle(id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/storage/parts/delete'),
            method: 'post',
            data: {
              id: id
            }
          }).then(({
            data: res
          }) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                msg: '操作成功！'
              })
              this.getDataList()
            } else {
              this.$message({
                type: 'err',
                msg: res.msg
              })
            }

          })
        })
      },
      addOrUpdateHandle(row) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(row)
        })
      },
      rest() {
        this.dataForm = {
          partsId: '',
          partsName: ''
        }
      }
    }
  }

</script>
<style>
  .el-table .cell {
    text-align: center !important;
  }

</style>
