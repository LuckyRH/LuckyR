<template>
  <div class="app-container">
    <!-- （ref是用来给DOM元素或者子组件注册引用信息的，引用的信息会根据$refs进行注册。
          如果ref再普通的DOM元素上使用的话，引用的信息就是元素；如果是在子组件上使用，引用信息就是组件实例） -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="学生学号" prop="studentNo">
        <el-input
          v-model="queryParams.studentNo"
          placeholder="请输入学生学号"
          clearable
          @keyup.enter.native="handleQuery"
        />
        <!-- 回车就可以搜索的意思 -->
      </el-form-item>
      <el-form-item label="状态" prop="sState">
        <el-select v-model="queryParams.sState" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="sDate">
        <el-date-picker
          v-model="queryParams.sDates"
          type="datetimerange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          @change="dateFormat"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery(true)"
          >搜索</el-button
        >
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery('queryForm')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row>
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
        >新增</el-button
      >
      <!--导入Excel-->
      <el-button
        type="success"
        icon="el-icon-upload2"
        @click="handleExcelImportSuccess"
        v-hasPermi="['system:student:import']"
      >
        导入
      </el-button>
      <!--导出Excel-->
      <el-button
        type="success"
        icon="el-icon-upload"
        @click="infantMessageExport"
      >
        导出Excel
      </el-button>
      <el-button type="primary" @click="change('zh')">点击切换中文</el-button>
      <el-button type="primary" @click="change('en')">点击切换英文</el-button>
      <el-button type="primary" plain @click="jump">跳转</el-button>
    </el-row>
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 表格数据 -->
    <el-table
      v-if="refreshTable"
      :data="
        studentList.slice((queryParams.currentPage - 1) * queryParams.pagesize, queryParams.currentPage * queryParams.pagesize)
      "
      row-key="studentNo"
      highlight-current-row
      border
      stripe
      fit
    >
      <el-table-column
        prop="image"
        :label="$t('lang.message.image')"
        width="200"
        v-if="showColumn.image"
      >
        <template slot-scope="scope">
          <el-image
            :src="require('D:/images/' + scope.row.image)"
            style="width: 60px; height: 60px"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="pic"
        :label="$t('lang.message.image')"
        width="150"
        v-if="showColumn.pic"
      >
        <template slot-scope="scope">
          <el-image
            :src="require('../../../assets/image/' + scope.row.pic)"
            :preview-src-list="[
              require('../../../assets/image/' + scope.row.pic),
            ]"
            style="width: 60px; height: 60px"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="studentNo"
        :label="$t('lang.message.studentNo')"
        width="200"
        v-if="showColumn.studentNo"
      ></el-table-column>
      <el-table-column
        prop="sName"
        :label="$t('lang.message.sName')"
        width="200"
        v-if="showColumn.sName"
      ></el-table-column>
      <el-table-column
        prop="sAge"
        :label="$t('lang.message.sAge')"
        width="200"
        v-if="showColumn.sAge"
      ></el-table-column>
      <el-table-column
        prop="sSex"
        :label="$t('lang.message.sSex')"
        width="200"
        v-if="showColumn.sSex"
      ></el-table-column>
      <el-table-column
        prop="phone"
        :label="$t('lang.message.phone')"
        width="100"
        v-if="showColumn.phone"
      ></el-table-column>
      <el-table-column
        prop="sDate"
        :label="$t('lang.message.sDate')"
        width="200"
        v-if="showColumn.sDate"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.sDate, "{y}-{m}-{d} {h}:{m}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sState"
        :label="$t('lang.message.sState')"
        width="100"
        type="primary"
        v-if="showColumn.sState"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
        <template slot="header">
          <i
            class="el-icon-setting"
            style="font-size: 22px; cursor: pointer"
            @click="showColumnOption"
          ></i>
        </template>
      </el-table-column>
    </el-table>
     <!-- 
        @size-change //  pageSize 改变时会触发 每页条数
        @current-change //  currentPage 改变时会触发 当前页
        :current-page //  默认false
        background//  是否为分页按钮添加背景色
        :page-sizes // 每页显示个数选择器的选项设置 这是下拉框可以选择的，每选择一行，要展示多少内容 类似：[10, 20, 30, 40, 50, 100]
        page-sizes=显示当前行的条数
        layout // 组件布局，子组件名用逗号分隔
       :total // 总条目数,一般从展示列表的总数获取
     -->
     <!-- 分页 -->
      <el-pagination
        :current-page="queryParams.pagenum"
        :page-size="queryParams.pagesize"
        :page-sizes="[1, 2, 5]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.studentList.length"
      >
      </el-pagination>
    <transition name="fade">
      <div class="columnOption" v-show="isShowColumn">
          <div class="head">选择显示字段</div>
          <div class="body">
            <!-- disabled 不能选属性-->
            <el-checkbox v-model="checkList.image">上传照片</el-checkbox>
            <el-checkbox v-model="checkList.pic">学生图片</el-checkbox>
            <el-checkbox v-model="checkList.studentNo" disabled>学生学号</el-checkbox>
            <el-checkbox v-model="checkList.sName">学生姓名</el-checkbox>
            <el-checkbox v-model="checkList.sAge">学生年龄</el-checkbox>
            <el-checkbox v-model="checkList.sSex">学生性别</el-checkbox>
            <el-checkbox v-model="checkList.phone">学生电话</el-checkbox>
            <el-checkbox v-model="checkList.sDate">日期</el-checkbox>
            <el-checkbox v-model="checkList.sState">状态</el-checkbox>
          </div>
          <div class="footer">
            <el-button size="small" type="primary" plain @click="saveColumn"
              >保存列配置</el-button
            >
        </div>
      </div>
    </transition>
    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="80px"
        method="post"
        enctype="multipart/form-data"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="学生图片" prop="pic">
              <el-input v-model="form.pic" placeholder="请输入学生图片" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="学生姓名" prop="sName">
              <el-input v-model="form.sName" placeholder="请输入学生姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="学生年龄" prop="sAge">
              <el-input
                v-model="form.sAge"
                placeholder="请输入学生年龄"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="学生性别" prop="sSex">
              <el-input
                v-model="form.sSex"
                placeholder="请输入学生性别"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="学生电话" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入学生电话"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="创建时间" prop="sDate">
              <el-date-picker
                clearable
                v-model="form.sDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="状态" prop="sState">
              <el-input
                v-model="form.sState"
                placeholder="请输入状态"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="上传图片" prop="image">
              <el-upload
                list-type="picture-card"
                action="dd"
                :on-change="handleImage"
                :on-remove="handleRemove"
                :on-preview="handlePictureCardPreview"
                :auto-upload="false"
              >
                <i class="el-icon-plus"></i>
                <!--  -->
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="" />
                </el-dialog>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
    
    <script>
import {
  listStudent,
  delStudent,
  updateStudent,
  addStudent,
  selectStudentNo,
  exportExcel,
} from "@/api/system/student";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getToken } from "@/utils/auth";
import { en, zh } from "@/main";
export default {
  en,
  zh,
  name: "student",
  components: { Treeselect },
  data() {
//  const 不用var
    return {
      rules: {
        phone:[
               { required: true, message: '请输入手机号码', trigger: 'blur' },
               { validator:function(rule,value,callback){
                // 拆分
                            if(/^1[34578]\d{9}$/.test(value) == false){
                                   callback(new Error("请输入正确的手机号"));
                            }else{
                                   callback();
                            }
                          }, trigger: 'blur'
                },]
      },
      isShowColumn: false,
      checkList: {},
      showColumn: {
        pic: true,
        image: true,
        studentNo: true,
        sName: true,
        sAge: true,
        sSex: true,
        sDate: true,
        sState: true,
        phone: true,
      },
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/student/import",
      },
      dialogImageUrl: "",
      dialogVisible: false,

      options: [
        {
          value: "0",
          label: "离校",
        },
        {
          value: "1",
          label: "在校",
        },
      ],
      ids: [],
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      studentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        sDate: null,
        sState: null,
        sDates: [],
        pic: "",
        startTime: "",
        endTime: "",
        query: "",
        image: "",
        // 当前页数
        pagenum: 1,
        // 显示一页多少条数据
         pagesize: 5,
         currentPage:1
      },
      // 表单参数
      form: {
        phone: "",
      },
      //图片集合
      formdataa: "",
      data: "",
    };
  },
  showColumn: false,
  created() {
    this.getList();
  },
  watch: {
    // 监听复选框配置列所有的变化
    checkList: {
      handler: function (newnew) {
        // console.log(newnew);
        this.showColumn = newnew;
      },
    },
  },
  mounted() {
    // 发请求得到checkListInitData的列的名字
    this.checkList = {
      image: true,
      pic: true,
      studentNo: true,
      sName: true,
      sAge: true,
      sSex: true,
      sDate: true,
      sState: true,
      phone: true,
    };
  },
  methods: {
    jump() {
      // let routeData = this.$router.resolve({ path: '/tu' });
      // window.open(routeData.href, '_blank');
      this.$router.push({ path: "/system/tu/tu" });
    },
    change(lang) {
      // this.$i18n.locale = this.currentLanguage;
      //切换方法
      localStorage.setItem("lang", lang);
      window.location.reload();
       //localSotrage是不响应的，为了演示效果所以直接调用刷新
    },
    //自定义列配置
    showColumnOption() {
      this.isShowColumn = true;
    },
    saveColumn() {
      this.isShowColumn = false;
    },
    // 导入
    handleExcelImportSuccess() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    // 文件上传中处理
    handleFileUploadProgress() {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response) {
      this.upload.open = false;
      this.upload.isUploading = false;
      //什么意思
      this.$refs.upload.clearFiles();
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    //导出
    infantMessageExport() {
      exportExcel(this.data);
      this.$message.success("导出成功！");
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 上传图片
    handleImage(file) {
      console.log(file);
      this.formdataa = new FormData();
      this.formdataa.append("file", file.raw);
    },
    //监听 pagesize 改变的事件
    handleSizeChange(newsize) {
      //   //最新的条数（newsize）赋值给 动态的 pagesize
      this.queryParams.pagesize = newsize;
      this.queryParams.currentPage = 1;
      console.log(this.queryParams.pagesize);
      //   //获取到最新一页显示的数据  重新发送axios请求 这里是封装好的请求方法
      // this.getList();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryParams.currentPage = newPage;
      console.log(this.queryParams.currentPage);
      //   //获取到最新显示的页码值  重新发送axios请求 这里是封装好的请求方法
      // this.getList();
    },

    dateFormat(picker) {
      this.queryParams.startTime = this.queryParams.sDates[0];
      this.queryParams.endTime = this.queryParams.sDates[1];
      // this.queryParams.startTime = picker[0],
      // this.queryParams.endTime = picker[1]
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        studentNo: null,
        pic: null,
        sName: null,
        sAge: null,
        sSex: null,
        sDate: null,
        sState: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery(queryForm) {
      this.queryParams.sDates = "";
      // resetFields()elementui提供的表单方法
      this.$refs[queryForm].resetFields();
    },
    /** 查询学生列表 */
    getList() {
      listStudent(this.queryParams).then((response) => {
        //console.log(JSON.stringify(response));
        // rows指的是key值 然后value是数据响应的值传递到前端里面
        this.studentList = response.rows;
        // console.log(this.studentList.length);
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加";
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const studentNo = row.studentNo || this.ids;
      selectStudentNo(studentNo).then((response) => {
        this.open = true;
        this.title = "修改";
        // data[0] 加上这个 修改点击单行 原来的数据才会显示
        this.form = response.data[0];
      });
    },
    /** 提交按钮 */
    submitForm(formPhone) {
      //用 studentNo判断 执行修改还是新增
      this.$refs[formPhone].validate((valid) => {
        if (valid) {
          if (this.form.studentNo != null) {
            updateStudent(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.formdataa.append("sName", this.form.sName);
            // console.log(this.form);
            this.formdataa.append("sAge", this.form.sAge);
            this.formdataa.append("sSex", this.form.sSex);
            this.formdataa.append("pic", this.form.pic);
            this.formdataa.append("sDate", this.form.sDate);
            this.formdataa.append("sState", this.form.sState);
            this.formdataa.append("image", this.form.image);
            // this.formdataa.append('image',file.name);
            addStudent(this.formdataa).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除名称为"' + row.studentNo + '"的数据项？')
        .then(function () {
          return delStudent(row.studentNo);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>
    <style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>