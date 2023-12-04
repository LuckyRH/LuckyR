<!-- 第一种方式 父传子 props-->
<!--<template>
  <div>
    父组件:
    <input type="text" v-model="name" />
    <br />
    <br />
    引入子组件
    <child :inputName="name"></child>
  </div>
</template>
<script>
import child from "./child.vue";
export default {
  components: {
    child,
  },
  data() {
    return {
      name: "",
    };
  },
};
</script>-->

<!-- 第二种 子传父 -->
<template>
  <div>
    父组件:
    <span>{{ name }}</span>
    <br />
    <br />
    <!-- 引入子组件 定义一个on的方法监听子组件的状态--> 
    <child v-on:childByValue="childByValue"></child>
  </div>
</template>
<script>
import child from "./child";
export default {
  components: {
    child,
  },
  data() {
    return {
      name: "",
    };
  },
  methods: {
    childByValue: function (childValue) {
      // childValue就是子组件传过来的值
      this.name = childValue;
    },
  },
};
</script> 
<!-- 第三种 .sync 修饰符 实现父子组件传值 vue3已经丢弃--> 
<!-- <template>
  <div class="parent">
    <h1>我是父组件：{{ msg }}</h1>
    <child v-bind:msg.sync="msg"></child> -->
    <!-- <child :msg.sync="msg"></child>
  </div>
</template>

<script>
import child from './child'
export default {
  name: 'parent',
  components: {
    child,
  },
  data() {
    return {
      msg: 'hello!',
    }
  },
}
</script> -->
