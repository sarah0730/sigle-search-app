/*
 * @Author: gaofengjiao 
 * @Date: 2020-08-11 13:56:08 
 * @Last Modified by: gaofengjiao
 * @Last Modified time: 2020-08-11 14:26:47
 */
import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryList } from '../services';

export interface StateType {

}
export interface ListType {
  namespace: string;
  state: StateType;
  effects: {
    queryList: Effect;
  },
}

const List: ListType = {
  namespace: 'list',
  state: {
  },
  effects: {
    *queryList({ payload, callback, errback }, { call, put }) {
      try {
        const response =  yield call(queryList, payload);
        if(callback && typeof callback === "function"){
           callback(response)
        }
      } catch (err) {
         if(errback && typeof errback === "function"){
           errback(err)
         }
      }
      
    
    },
  },
}

export default List;