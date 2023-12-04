<!-- 第一种方式 父传子-->
<!-- <template>
  <div>
    子组件:
    <span>{{ inputName }}</span>
  </div>
</template>
<script>
export default {
  // 接受父组件的值
  props: {
    inputName: String,
    required: true,
  },
};
</script> -->
<!-- 第二种 子传父 自定义事件-->
<template>
  <div>
    子组件:
    <span>{{ childValue }}</span>
    定义一个子组件传值的方法 
     <input type="button" value="点击触发" @click="childClick" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      childValue: "我是子组件的数据",
    };
  },
  methods: {
    childClick() {
      // childByValue是在父组件on监听的方法
      // 第二个参数this.childValue是需要传的值
      this.$emit("childByValue", this.childValue);
    },
  },
};
</script>  
<!-- 第三种 .sync 修饰符 实现父子组件传值  vue3已经丢弃 把.sync都换成v-model --> 
<!-- <template>
  <div>
    我是子组件：
    <input type="text" :value="msg" @input="changeValFn" />
  </div>
</template>

<script>
export default {
  name: 'child',
  props: ['msg'],
  methods: {
    changeValFn(e) {
      this.$emit('update:msg', e.target.value)
    },
  },
}
</script> -->
