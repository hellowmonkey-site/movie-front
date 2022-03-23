import Avatar from "@/component/Avatar";
import { TableData } from "@/config/type";
import { deleteAdmin, getAdminList, IAdmin } from "@/service/admin";
import { Button, message, Modal, Table } from "ant-design-vue";
import { defineComponent, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const dataSource = ref<IAdmin[]>([]);
    const columns = [
      {
        dataIndex: "id",
        title: "ID",
      },
      {
        dataIndex: "username",
        title: "登录账号",
      },
      {
        key: "avatar",
        title: "头像",
        customRender({ record }: TableData) {
          return <Avatar src={record.avatar} />;
        },
      },
      {
        key: "role",
        title: "角色",
        customRender({ record }: TableData) {
          return Array.from(record.role).join(",");
        },
      },
      {
        dataIndex: "home_url",
        title: "首页地址",
      },
      {
        key: "action",
        title: "操作",
        customRender({ record }: TableData) {
          return (
            <>
              <RouterLink to={{ name: "system-admin-edit", params: { id: record.id } }} class="mar-r-2-item ant-btn ant-btn-primary">
                编辑
              </RouterLink>
              <Button
                class="mar-r-2-item"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: `确认要删除${record.title}吗？`,
                    onOk: () => {
                      return deleteAdmin(record.id).then(() => {
                        fetchData();
                      });
                    },
                  });
                }}
              >
                删除
              </Button>
            </>
          );
        },
      },
    ];

    function fetchData() {
      const hide = message.loading("数据加载中...");
      getAdminList()
        .then(data => {
          dataSource.value = data;
        })
        .finally(() => {
          hide();
        });
    }

    onMounted(() => {
      fetchData();
    });

    return () => (
      <>
        <div class="d-flex justify-end mar-b-3">
          <RouterLink to={{ name: "system-admin-add" }} class="ant-btn">
            添加
          </RouterLink>
        </div>
        <Table bordered columns={columns} pagination={false} dataSource={dataSource.value}></Table>
      </>
    );
  },
});
