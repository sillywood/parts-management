// import http from '@/utils'


// export default {
//   data() {
//     return {
//       mixinOperation: {
//         dataList: [],
//         getDataIsPage: false,
//         limit: 10,
//         page: 1,
//         getDataListUrl: '',
//         createdIsNeed: false,
//         total: 0,
//         dataForm: {

//         }
//       }
//     }
//   },
//   methods: {
//     getDataList: function () {
//       this.$http({
//         url: this.getDataListUrl,
//         method: 'get',
//         params: {
//           dataForm: dataForm
//         }
//       }).then(({
//         data: res
//       }) => {
//         if (res.code == 0) {
//           if (this.getDataIsPage) {
//             this.dataList = res.data.list
//             this.total = res.data.total
//           } else {
//             this.dataList = res.data
//           }

//         } else {
//           this.$message({
//             type: 'error',
//             message: res.msg
//           })
//         }
//       })
//     }
//   }
// }


export default {
  created () {
    if (this.mixinOptions.createdIsNeed){
      this.getDataList()
    }
  },
  data() {
    return {
      mixinOptions:{
        getDataList:'',
        isPage:false,
        createdIsNeed:true
      },
      dataForm:{},
      dataListLoading:false,
      dataList: [],
      page: 1,
      pageSize: 10,
      total: 0,
    }
  },
  methods: {
    getDataList() {
      this.page = 1
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(this.mixinOptions.getDataList),
        method: 'get',
        params: this.$http.adornParams({
          ...this.dataForm,
          page: this.page,
          limit: this.pageSize
        })
      }).then(({
        data
      }) => {
        if (data && data.code === 0) {
          this.dataList = this.mixinOptions.isPage?data.page.list:data.data
          this.total = this.mixinOptions.isPage?data.page.total:0
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
    }
  }
}