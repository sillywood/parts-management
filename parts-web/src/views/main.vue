<template>
    <div id="nav">
        <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->
       <el-container>
           <el-header>
               <navBar></navBar>
           </el-header>
           <el-container>
               <el-aside width="200px">
                   <sideBar></sideBar>
               </el-aside>
               <el-main>Main</el-main>
           </el-container>
       </el-container>
        
        
    </div>
</template>

<style scoped>

</style>

<script>
import navBar from '@/views/navBar'
import sideBar from '@/views/sideBar'
    export default {
        components: {
          navBar:navBar,
          sideBar:sideBar,
        },
        data() {
            return {}
        }
    }
</script>