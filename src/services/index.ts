import axios from 'axios';
import { list } from '@/api/list';
import query from './query'
export interface ListProps {
  searchName: string;
}

export async function queryList(variables:any) {
    return axios.post(list.queryList, { query, variables},{
      headers: {
        Authorization: `token 730b5a0520c2117c1c27b807b8ed31626ee85769`
      },
    })
}