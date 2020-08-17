import axios from 'axios';
import { list } from '@/api/list';
import query from './query'
export interface ListProps {
  searchName: string;
}

export async function queryList(variables:any) {
    return axios.post(list.queryList, { query, variables},{
      headers: {
        Authorization: `token 681f469ef7dfcf0570df364aa402e1c7ca10c1ae`
      },
    })
}