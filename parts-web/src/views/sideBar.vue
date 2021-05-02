<template>
    <div class="sidebar">
        <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
            background-color="#545c64" text-color="#fff" >
               <el-menu-item index="1">仓库管理</el-menu-item>
             <el-menu-item index="2">客户管理</el-menu-item>
             <el-menu-item index="3">供货商管理</el-menu-item>
             <el-submenu index="4">
                 <template slot="title">表单管理</template>
                 <el-menu-item index="4-1">入库单</el-menu-item>
                 <el-menu-item index="4-2">出库单</el-menu-item>
                 <el-menu-item index="4-3">维修单</el-menu-item>
             </el-submenu>
             <el-submenu index="5">
                 <template slot="title">报表管理分析</template>
                 <el-menu-item index="5-1">销售情况分析</el-menu-item>
                 <el-menu-item index="5-2">客户消费分析</el-menu-item>
                 <el-menu-item index="5-3">入库情况分析</el-menu-item>
                 <el-menu-item index="5-2">出库情况分析</el-menu-item>
             </el-submenu>
        </el-menu>
    </div>
</template>

<style scoped>

</style>

<script>
    export default {
        name: 'side-bar',
        data() {
            return {}
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }
</script>
<style>
.sidebar{
    position: fixed;
    top: 50px;
    left: 0;
    bottom: 0;
    z-index: 1020;
    width: 230px;
    overflow: hidden;
}
</style>