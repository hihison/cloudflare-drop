import * as React from 'react'
import { useEffect, useState } from 'preact/hooks'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/FileDownload'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { visuallyHidden } from '@mui/utils'
import { useRoute } from 'preact-iso'
import Info from '@mui/icons-material/InfoOutlined'
import LockClose from '@mui/icons-material/Lock'

import { Layout, LayoutProps } from '../../components'
import { createAdminApi } from '../../api'
import { humanFileSize } from '../../helpers'
import dayjs from 'dayjs'
import { ComponentChildren } from 'preact'
import { useDialogs } from '@toolpad/core/useDialogs'

function Div(props: { children?: ComponentChildren }) {
  return <div>{props.children}</div>
}

type Order = 'asc' | 'desc'

interface HeadCell {
  disablePadding: boolean
  id?: keyof FileType
  label: string
  width?: number
  tooltip?: string
}

const headCells: readonly HeadCell[] = [
  {
    disablePadding: true,
    label: '文件名',
  },
  {
    disablePadding: false,
    label: '分享码',
    width: 150,
  },
  {
    id: 'size',
    disablePadding: false,
    label: '大小',
    tooltip: '使用二进制单位：1 MiB = 1024 × 1024 字节，与 macOS 显示略有不同',
    width: 150,
  },
  {
    id: 'due_date',
    disablePadding: false,
    label: '有效期至',
    width: 150,
  },
  {
    disablePadding: true,
    label: '是否加密',
    width: 100,
  },
  {
    id: 'created_at',
    disablePadding: false,
    label: '创建时间',
    width: 150,
  },
  {
    disablePadding: true,
    label: '操作',
    width: 150,
  },
]

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (property: keyof FileType) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props
  const createSortHandler = (property?: keyof FileType) => () => {
    if (property) {
      onRequestSort(property)
    }
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.map((headCell) => {
          const Comp = headCell.id ? TableSortLabel : Div
          return (
            <TableCell
              width={headCell.width}
              key={headCell.id}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <Comp
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {headCell.tooltip && (
                  <Tooltip title={headCell.tooltip} arrow>
                    <Info color="disabled" sx={{ fontSize: '18px', ml: 1 }} />
                  </Tooltip>
                )}
                {orderBy === headCell.id ? (
                  // @ts-expect-error unknown
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </Comp>
            </TableCell>
          )
        })}
      </TableRow>
    </TableHead>
  )
}

interface EnhancedTableToolbarProps {
  numSelected: number
  onDelete: (event: Event) => void
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props

  return (
    <Toolbar
      className="flex-0 flex-shrink-0"
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          选中 {numSelected}
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          分享列表
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="批量删除">
          <IconButton onClick={props.onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

interface AdminProps extends LayoutProps {
  token: string
}

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

function AdminMain(props: AdminProps) {
  const setBackdropOpen = props.setBackdropOpen!
  const message = props.message!
  const token = props.token
  const adminApi = createAdminApi(token)
  const dialogs = useDialogs()

  const [order, setOrder] = React.useState<Order>('desc')
  const [orderBy, setOrderBy] = React.useState<keyof FileType>('created_at')
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [total, setTotal] = useState(0)
  const [rows, setRows] = useState<Array<FileType>>([])
  
  // Text preview state
  const [textPreview, setTextPreview] = useState<{
    open: boolean
    content: string
    filename: string
  }>({
    open: false,
    content: '',
    filename: ''
  })

  const fetchList = async (pageSize = page) => {
    setBackdropOpen(true)

    const response = await adminApi.list<{
      items: FileType[]
      total: number
    }>(pageSize, rowsPerPage, orderBy, order)
    if (response.result) {
      const { items, total } = response.data!
      setTotal(total)
      setRows(items)
      setSelected([])
    } else {
      message.error(response.message)
    }
    setBackdropOpen(false)
  }

  useEffect(() => {
    ;(async () => {
      setSelected([])
      await fetchList()
    })()
  }, [page, rowsPerPage, order, orderBy])

  const handleRequestSort = (property: keyof FileType) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    setPage(0)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if ((event?.target as HTMLInputElement)?.checked) {
      const newSelected = rows.map((n) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (_event: unknown, id: string) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }
    setSelected(newSelected)
  }

  const handleChangePage = async (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt((event?.target as HTMLInputElement)?.value, 10))
    setPage(0)
  }

  const createRemoveHandler = (id?: string) => async (event: Event) => {
    event.stopPropagation()
    const confirmed = await dialogs.confirm(
      '删除后无法恢复，请确认是否删除？',
      {
        okText: '确认',
        cancelText: '取消',
        title: !id ? '批量删除' : '删除分享',
      },
    )
    if (confirmed) {
      setBackdropOpen(true)
      const data = await adminApi.delete(id ?? selected)
      if (data.result) {
        setPage(0)
        await fetchList(0)
      } else {
        message.error(data.message)
        setBackdropOpen(false)
      }
    }
  }

  const createDownloadHandler = (file: FileType) => async (event: Event) => {
    event.stopPropagation()
    event.preventDefault()
    
    setBackdropOpen(true)
    
    try {
      // Check if this is a text file by type
      if (file.type === 'plain/string') {
        const content = await adminApi.getTextContent(file.id)
        setTextPreview({
          open: true,
          content,
          filename: file.filename
        })
        setBackdropOpen(false)
        return
      }
      
      // For non-text files, proceed with download
      await adminApi.downloadFile(file.id, file.filename)
      message.success('文件下载完成')
    } catch (error) {
      console.error('Download failed:', error)
      message.error('下载失败：' + (error as Error).message)
    } finally {
      setBackdropOpen(false)
    }
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = rowsPerPage - rows.length

  return (
    <Box
      sx={{ width: '100%' }}
      className="min-h-0 flex-1 overflow-hidden flex flex-col"
    >
      <Paper
        sx={{ width: '100%', mb: 2 }}
        className="min-h-0 flex-1 flex flex-col"
      >
        <EnhancedTableToolbar
          numSelected={selected.length}
          onDelete={createRemoveHandler()}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order || 'asc'}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows.map((row, index) => {
                const isItemSelected = selected.includes(row.id)
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        slotProps={{
                          input: {
                            'aria-labelledby': labelId,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      <Typography
                        title={row.filename}
                        className="text-ellipsis text-nowrap overflow-hidden"
                      >
                        {row.type === 'plain/string' ? '[文本]' : row.filename}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{humanFileSize(row.size)}</TableCell>
                    <TableCell>
                      <Tooltip
                        title={
                          row.due_date
                            ? dayjs(row.due_date).format(DATE_FORMAT)
                            : '永久有效'
                        }
                      >
                        <span>
                          {row.due_date
                            ? dayjs(row.due_date).fromNow()
                            : '永久有效'}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ fontSize: 0 }} padding="none">
                      {row.is_encrypted && (
                        <LockClose sx={{ fontSize: 18 }} color="action" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={dayjs(row.created_at).format(DATE_FORMAT)}
                      >
                        <span>
                          {row.created_at
                            ? dayjs(row.created_at).fromNow()
                            : ''}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell padding="none">
                      <Tooltip title="下载文件">
                        <IconButton
                          aria-label="download"
                          onClick={createDownloadHandler(row)}
                        >
                          <DownloadIcon color="action" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="删除分享">
                        <IconButton
                          aria-label="delete"
                          onClick={createRemoveHandler(row.id)}
                        >
                          <DeleteIcon color="action" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          className="flex-shrink-0"
          labelDisplayedRows={({ from, to, count }) =>
            `${from} - ${to} 共 ${count} 条`
          }
          labelRowsPerPage="分页大小"
          rowsPerPageOptions={[10]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Text Preview Dialog */}
      <Dialog
        open={textPreview.open}
        onClose={() => setTextPreview(prev => ({ ...prev, open: false }))}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <VisibilityIcon />
            {textPreview.filename}
          </div>
        </DialogTitle>
        <DialogContent>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            wordWrap: 'break-word',
            fontSize: '14px',
            fontFamily: 'monospace',
            maxHeight: '60vh',
            overflow: 'auto'
          }}>
            {textPreview.content}
          </pre>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setTextPreview(prev => ({ ...prev, open: false }))}
          >
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export function Admin() {
  const { params } = useRoute()
  return (
    <Layout>
      <AdminMain token={params.token} />
    </Layout>
  )
}
