import http from '@/api/http'

export const check = async () => {
  let { data } = await http.get('getUser')
  return data
}
