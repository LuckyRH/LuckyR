import Vue from "vue";
import VueI18n from "vue-i18n";
//引入自定义语言配置
import developZh from './zh';
import developEn from './en';
//引入UI框架语言配置---elementui
import locale from 'element-ui/lib/locale'; 
import enLocale from 'element-ui/lib/locale/lang/en';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
Vue.use(VueI18n);
const i18n = new VueI18n({
 locale: localStorage.lang || "zh",
 messages: {
   'zh': {
     ...developZh,
     ...zhLocale
   },   // 中文语言包
   'en': {
     ...developEn,
     ...enLocale
   }   //英文语言包
 }
});
locale.i18n((key, value) => i18n.t(key, value))
export default i18n;
