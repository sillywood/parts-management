<template>
  <el-dialog :title="dataForm.partsId == 0 ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
      label-width="80px">
      <el-form-item label="配件编码" prop="id">
        <el-input :disabled="!isNew" v-model="dataForm.partsId" placeholder="配件编码"></el-input>
      </el-form-item>
      <el-form-item label="配件名称" prop="partsName">
        <el-input v-model="dataForm.partsName" placeholder="配件名称"></el-input>
      </el-form-item>
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
        dataForm: {
          partsId: '',
          partsName:''
        },
        isNew:true,
        dataRule:{
             partsName: [{
             required: true,
             message: '配件名称不能为空',
             trigger: 'blur'
             }],
        }
      }
    },
    methods: {
      init(row){
          // console.log(row);
          if(row){
              this.dataForm = row
              this.isNew = false
          }
          this.visible = true
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/storage/parts/${this.isNew ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'partsId': this.dataForm.partsId == 0 ? undefined:this.dataForm.partsId,
                'partsName':this.dataForm.partsName
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
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
