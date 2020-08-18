import axios from 'axios';
import { list } from '@/api/list';
import query from './query'
export interface ListProps {
  searchName: string;
}

export async function queryList(variables:any) {
    return axios.post(list.queryList, { query, variables},{
      headers: {
        Authorization: `token 75a4ebfb4eba91b1b23f8ff7ef89e01cccf11961`
      },
    })
}