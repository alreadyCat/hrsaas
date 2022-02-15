<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="登录账户设置" name="accountSetting">
            <account-setting />
          </el-tab-pane>
          <el-tab-pane label="个人详情" name="personalDetail">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <personal-detail />
          </el-tab-pane>
          <el-tab-pane label="岗位信息" name="postInfo">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <post-info />
          </el-tab-pane>
        </el-tabs>

      </el-card>
    </div>
  </div>
</template>

<script>
import accountSetting from './components/accountSetting.vue'
import PersonalDetail from './components/personalDetail.vue'
import PostInfo from './components/postInfo.vue'
export default {
  components: { accountSetting, PersonalDetail, PostInfo },
  data() {
    return {
      activeName: 'accountSetting',
      userId: this.$route.params.id
    }
  }
}
</script>

<style>

</style>
