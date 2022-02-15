<template>
  <el-dialog
    title="新增员工"
    :visible="dialogVisible"
    width="width"
    @close="closeDialog"
  >
    <el-form ref="elForm" :model="formData" :rules="rules">
      <el-form-item label="姓名" label-width="80px" prop="username">
        <el-input v-model="formData.username" />
      </el-form-item>
      <el-form-item label="手机号" label-width="80px" prop="mobile">
        <el-input v-model="formData.mobile" />
      </el-form-item>
      <el-form-item label="入职时间" label-width="80px" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" type="date" placeholder="选择日期" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="聘用形式" label-width="80px" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <!-- 遍历只能遍历组件的数据 -->
          <el-option v-for="item in employeeForm.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" label-width="80px" prop="workNumber">
        <el-input v-model="formData.workNumber" />
      </el-form-item>
      <el-form-item label="部门" label-width="80px" prop="departmentName">
        <el-input v-model="formData.departmentName" @focus="getDept" />
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="deptArray"
          default-expand-all=""
          :props="{ label: 'name' }"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" label-width="80px" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" type="date" placeholder="选择日期" style="width: 100%;" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addEmployee } from '@/api/employees'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/tranListToTreeData'
import employeeForm from '@/api/constant/employees'
export default {
  data() {
    return {
      dialogVisible: false,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '长度为1-4位', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [{ required: true, message: '不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      deptArray: [],
      showTree: false,
      loading: false,
      employeeForm: employeeForm
    }
  },
  methods: {
    submit() { // submit
      this.$refs.elForm.validate(async(valid) => {
        if (valid) {
          try {
            await addEmployee(this.formData)
            this.$message.success('添加成功')
            this.closeDialog()
            this.$emit('loadEmployeeList')
          } catch (error) {
            this.$message.error('提交失败')
          }
        } else {
          this.$message.error('表单填写有误')
        }
      })
    },
    closeDialog() { // close dialog
      this.dialogVisible = false
      this.$refs.elForm.resetFields()
    },
    async getDept() { // get departments
      this.showTree = true
      this.loading = true
      const res = await getDepartments()
      const deptArray = tranListToTreeData(res.depts, '')
      this.deptArray = deptArray
      this.loading = false
    },
    selectNode(selectInfo) { // selete tree node
      this.formData.departmentName = selectInfo.name
      this.showTree = false
    }
  }
}
</script>

<style>

</style>
