import { ref, reactive } from 'vue'
import type { TableColumnsType } from 'ant-design-vue'

export function usePPTResource() {
  const loading = ref(false)
  const tableData = ref<any[]>([])
  
  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  const searchParams = reactive({
    keyword: '',
  })

  const columns: TableColumnsType = [
    {
      title: 'PPT名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
    },
  ]

  const fetchPPTList = async () => {
    loading.value = true
    try {
      const { data } = await getPPTList({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
      })
      tableData.value = data.list
      pagination.total = data.total
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    tableData,
    pagination,
    searchParams,
    columns,
    fetchPPTList,
  }
} 