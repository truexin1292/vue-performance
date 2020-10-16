<template>
  <el-popover popper-class="pop-group" placement="bottom" width="300" trigger="click" ref="selectGroup" @show="show">
    <div class="main-body">
      <el-input
        v-model.trim="value"
        :placeholder="'请输入' + text + '名称'"
        @input="debounceInput"
        @clear="debounceInput"
        clearable
      />
      <el-checkbox v-if="!maxLength" class="all-btn" v-model="checkAll" @change="handleCheckAllChange">
        全部
      </el-checkbox>
      <el-checkbox-group v-model="selectSiteList" @change="handleCheckedCitiesChange" :max="maxLength">
        <div ref="groupHover" class="content-wrap" @scroll="onScroll">
          <div class="tree-phantom" :style="`height: ${phantomHeight}px`"></div>
          <div class="tree-content" :style="`transform: translateY(${startIndex * itemHeight}px)`">
            <el-checkbox v-for="v in renderList" :label="v.key" :key="v.key">
              {{ v.label }} <span class="delete-place-color" v-show="v.isactive === 'N'">已删除</span>
            </el-checkbox>
          </div>
          <div class="no-data" v-if="renderList.length">暂无数据</div>
        </div>
      </el-checkbox-group>
    </div>
    <p slot="reference" class="pop-group-btn" :class="addClass">
      {{
        selectSiteList.length === siteList.length
          ? '全部'
          : selectSiteList.length === 0
          ? '请选择' + text
          : '已选择' + selectSiteList.length + '个' + text
      }}
      <span class="el-icon-arrow-right" />
    </p>
  </el-popover>
</template>

<script>
import { clearAll, debounce, throttle } from '@/library/utils';

class BigData {
  list = []; // 扁平化的tree
  filterList = []; // 根据关键词过滤后的list
}

export default {
  props: {
    confirmModal: [Function],
    addClass: [String],
    maxLength: [Number],
    text: {
      type: String,
      default: '场地',
    },
  },
  computed: {
    // 过滤掉 hidden 节点
    unHiddenList() {
      return this.count ? this.big.filterList : [];
    },
    // 虚拟高度，与隐藏的数量有关
    phantomHeight() {
      return this.unHiddenList.length * this.itemHeight;
    },
    renderList() {
      return this.unHiddenList.slice(this.startIndex, this.endIndex);
    },
  },
  watch: {
    selectSiteList(val) {
      this.confirmModal(val);
    },
  },
  data() {
    this.big = null;
    return {
      value: '', // 关键词
      siteList: [],
      selectSiteList: [],
      checkAll: true,

      count: 1, // 用于视图更新
      itemHeight: 30, // 每一项的高度
      startIndex: 0, // 渲染的开始区间
      endIndex: 70, // 渲染的结束区间
      throttleSrcoll: '', // 节流
      debounceInput: '',
    };
  },
  created() {
    this.big = new BigData();
  },
  methods: {
    show() {
      this.$nextTick(() => {
        this.$refs['groupHover'].scrollTop = this.scrollTop;
      });
    },
    setData(val) {
      this.throttleSrcoll = throttle(this.setRenderRange, 80);
      this.debounceInput = debounce(this.searchGroup, 300);

      this.clear();
      this.big.list = val;
      this.init();
    },
    // 清空内存占用
    clear() {
      this.count = 1;
      this.value = ''; // 关键词
      this.startIndex = 0; // 渲染的开始区间
      this.endIndex = 70; // 渲染的结束区间
      clearAll(this.big.list);
      if (this.big) {
        this.big.list = []; // 扁平化的tree
        this.big.filterList = []; // 根据关键词过滤后的list
      }
    },
    init() {
      this.big.filterList = this.big.list;
      if (this.maxLength) {
        const maxList = [];
        this.big.list.forEach((v, i) => {
          if (this.maxLength > i) {
            maxList.push(v.key);
          }
        });
        this.selectSiteList = maxList;
      } else {
        this.selectSiteList = this.big.list.map(v => v.key);
      }
      this.backToTop();
    },
    // 回到顶部
    backToTop() {
      this.$nextTick(() => {
        this.$refs['groupHover'].scrollTop = 0;
        this.setRenderRange();
      });
    },
    // 设置可见区域的区间
    setRenderRange(scrollTop = this.$refs['groupHover'].scrollTop) {
      const count = Math.ceil(this.$el.clientHeight / this.itemHeight) + 40; // 可见项数
      const startIndex = Math.floor(scrollTop / this.itemHeight);
      this.startIndex = startIndex > 20 ? startIndex - 20 : 0;
      this.endIndex = this.startIndex + count;
      this.scrollTop = scrollTop;
      console.log(this.startIndex, this.endIndex, this.$refs['groupHover'].scrollTop);
      this.setCount();
    },
    // 根据 count 触发 computed ******
    setCount() {
      this.count++;
    },
    // 监听滚动
    onScroll() {
      this.throttleSrcoll();
    },
    searchGroup() {
      this.backToTop();
      this.selectSiteList = [];
      this.checkAll = false;
      if (!this.value) {
        this.big.filterList = this.big.list;
        return;
      }
      this.big.filterList = this.big.list.filter(v => v.label.indexOf(this.value) > -1);
      this.setCount();
    },
    handleCheckAllChange(val) {
      this.checkAll = val;
      this.selectSiteList = val ? this.big.filterList.map(v => v.key) : [];
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.big.filterList.length;
    },
    beforeDestroy() {
      this.clear();
    },
  },
};
</script>

<style lang="less" scoped>
.pop-group-btn {
  width: 160px;
  height: 32px;
  line-height: 32px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  padding-left: 10px;
  position: relative;
  cursor: pointer;
  display: inline-block;

  .el-icon-arrow-right {
    position: absolute;
    top: 8px;
    right: 10px;
  }
}

.pop-group {
  .main-body {
    padding: 10px 10px 0 10px;
  }

  .el-input {
    display: block;
  }

  .el-checkbox-group {
    height: 300px;
    overflow: auto;
  }

  .no-data {
    padding-top: 20px;
    text-align: center;
    height: 300px;
  }

  .el-checkbox {
    margin-top: 15px;
    width: 200px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.delete-place-color {
  color: #f00;
  opacity: 0.3;
}

.content-wrap {
  position: relative;
  overflow: auto;
  padding: 0 10px;
  flex: 1;
  height: 100%;

  .tree-phantom {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: -1;
  }

  .tree-content {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
  }
}
</style>
