import http from '@/api/http'

export const add = async (task) => {
  let { data } = await http.post('newtask', task)
  return data
}
export const all = async (task) => {
  let { data } = await http.get('/alltasks')
  return data
}
export const delById = async (_id) => {
  let { data } = await http.post('delById', { _id, _id })
  return data
}
export const editTask = async (task) => {
  let { data } = await http.post('taskedit', task)
  return data
}
