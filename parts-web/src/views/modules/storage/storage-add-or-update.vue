<template>
  <el-dialog :title="dataForm.partsId == 0 ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
      label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="配件编码" prop="partsId">
            <el-select v-model="dataForm.partsId" filterable placeholder="请选择" style="width:100%">
              <el-option v-for="item in partsList" :key="item.partsId" :label="item.prtsId" :value="item.partsId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配件名称" prop="partsName">
            <el-select v-model="partsName" filterable placeholder="请选择" style="width:100%">
              <el-option v-for="item in partsList" :key="item.partsId" :label="item.prtsName" :value="item.partsName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配件进价" prop="partsInPrice">
            <!-- <el-select v-model="dataForm.partsInPrice" filterable placeholder="请选择">
              <el-option v-for="item in partsList" :key="item.partsId" :label="item.prtsName" :value="item.partsId">
              </el-option>
            </el-select> -->
            <el-input v-model="dataForm.partsInPrice" placeholder="配件进价"></el-input>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="配件数量" prop="partsNum">
            <el-input v-model="dataForm.partsNum" placeholder="配件数量"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供货商" prop="supplierId">
            <el-input v-model="dataForm.supplierId" placeholder="供货商"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        visible: false,
        isNew: true,
        partsList: [],
        partsName: '',
        dataForm: {
          _id: '',
          partsId: '',
          partsName: '',
          partsInPrice: 0,
          partsNum: 0,
          supplierId: ''
        },
        isNew: true,
        dataRule: {
          partsId: [{
            required: true,
            message: '配件编码不能为空',
            trigger: 'blur'
          }],
          partsInPrice: [{
            required: true,
            message: '进价不能为空',
            trigger: 'blur'
          }]
        },
        // restaurants: [],
        state1: '',
      }
    },
    watch: {

      'dataForm.partsId': function (val, oldval) {
        console.log(val);
        let parts = this.partsList.filter(item => {
          return item.partsId == val
        })
        if (parts.length <= 0) {
          this.$message({
            type: 'warn',
            msg: '请选择正确编码'
          })
        }else{
            this.dataForm.partsId = parts[0].partsId
            this.dataForm.partsName = parts[0].partsName
            this.dataForm._id = parts[0]._id
        }
      },
      partsName: function (val, oldval) {
        // console.log(val);
        let parts = this.partsList.filter(item=>{
            return item.partsName == val
        })
        if(parts.length<=0){
             this.$message({
             type: 'warn',
             msg: '请选择正确名称'
             })
        }else{
            this.dataForm.partsId = parts[0].partsId
            this.dataForm.partsName = parts[0].partsName
            this.dataForm._id = parts[0]._id
        }
      }

    },
    methods: {
      init(row) {
        this.getPartsClass().then(res => {
          this.visible = true
        })
        // console.log(row);
        if (row) {
          //   this.dataForm = row
          this.isNew = false
        }

      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/storage/storage/save'),
              method: 'post',
              data: this.$http.adornData({
                storages:[this.dataForm]
              })
            }).then(({
              data
            }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.dataForm = {
                      partsId: '',
                      partsName: '',
                      partsInPrice: 0,
                      partsNum: 0,
                      supplierId: ''
                    }
                    this.partsName = ''
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      async getPartsClass() {
        this.$http({
          url: this.$http.adornUrl('/storage/parts/getAllList'),
          method: 'get'
        }).then(({
          data: res
        }) => {
          //   console.log(res.data);
          if (res.code == 0) {
            this.partsList = res.data
          } else {
            this.$message({
              type: 'error',
              msg: res.msg
            })
          }
        })
      },

    }
  }

</script>
