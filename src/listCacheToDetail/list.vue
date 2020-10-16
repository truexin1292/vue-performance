<template>
  <div class="list">
    <div class="search-item">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="审批人">
          <el-input v-model="formInline.user" placeholder="审批人" />
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="formInline.region" placeholder="活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="goOtherPage">其他页面</el-button>
      </div>
      <div>
        <SelectGroup :confirmModal="confirmModal" ref="selectGroup" />
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="list"
      border
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column prop="name" label="编号" align="center" />
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="toDetailPage(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="page-item"
    >
    </el-pagination>
  </div>
</template>

<script>
import SelectGroup from '../checkboxLazyList/list';
import { groupList } from '../mockData/mock';

export default {
  name: 'list',
  components: {
    SelectGroup,
  },
  data() {
    return {
      formInline: {
        user: '',
        region: '',
      },
      list: [],
      pageSize: 10,
      pageIndex: 1,
      total: 10000,
    };
  },
  created() {
    this.getTableData();
    this.getGroupList();
  },
  // 路由守卫 - 详情页面返回才缓存搜索分页条件，其他页面到列表页面都要清空数据重新获取列表
  beforeRouteEnter(to, from, next) {
    if (from.path === '/detail') {
      if (!to.meta.keepAlive) {
        to.meta.keepAlive = true;
      }
      next();
    } else {
      to.meta.keepAlive = false;
      next();
    }
  },
  methods: {
    // 获取场地
    getGroupList() {
      setTimeout(() => {
        const changeGroupList = groupList.map(v => ({ key: v.group_id, label: v.group_name, isactive: v.isactive }));
        this.$nextTick(() => {
          this.$refs.selectGroup.setData(changeGroupList);
        });
      });
    },
    // 场地选择确认
    confirmModal(list) {
      console.log('select-list: ');
    },
    // 搜索列表
    onSearch() {
      console.log('submit!');
    },
    // 进入详情页面
    toDetailPage(row) {
      this.$router.push({
        path: '/detail',
        query: row,
      });
    },
    // 获取列表
    getTableData() {
      setTimeout(() => {
        this.list = new Array(this.pageSize).fill('').map((v, i) => ({
          name: `name_${this.pageIndex}_${i}`,
          id: `id_${this.pageIndex}_${i}`,
        }));
      }, 1000);
    },
    // 选择列表数据
    handleSelectionChange(value) {
      console.log('选择', value);
    },
    // 一页显示多少条
    handleSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.getTableData();
    },
    // 选择第几页
    handleCurrentChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.getTableData();
    },
    // 进入其他页面
    goOtherPage() {
      this.$router.push({
        path: '/demo',
      });
    },
  },
};
</script>

<style lang="less" scoped>
.list {
  .page-item {
    margin-top: 20px;
  }
}
</style>
