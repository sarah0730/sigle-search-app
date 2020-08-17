/*
 * @Author: gaofengjiao 
 * @Date: 2020-08-11 09:24:17 
 * @Last Modified by: gaofengjiao
 * @Last Modified time: 2020-08-11 13:47:20
 */
import React from 'react'
import { useHistory } from 'umi'
import { useLocalStorage } from 'react-use'
import { Tag, Divider, Button } from 'antd'
import { SearchBar } from 'antd-mobile';
import styles from './index.less'
const PlaceholderConfig: {
  [key: string]: string;
} = {
  '/search': '关键字',
};

const HistoryConfig = {
  maxLength: 10, //历史记录最大条数
  title: '历史记录', //历史记录标题
  clearText: '清除历史记录' , // 清除历史记录文字
}
const SearchPage = () => {
  const history = useHistory();
  //获取当前路径
  const key:string = history.location.pathname;
  // 使用hook缓存 获取当前历史记录、set、remove函数
  const [values = [], setValue, remove] = useLocalStorage(key);
  const onSearch = (val:string) => {
    // @ts-ignore
    const index = values.indexOf(val);
    // 历史记录中存在该条记录, 则删除
    if(index > -1){
      values.splice(index, 1)
    }
    //超过最大范围,第一条记录删除
    if(values.length >= HistoryConfig.maxLength){
      values.pop();
    }
    // @ts-ignore
    setValue([val, ...values]);
    //带参数跳转
    localStorage.setItem('searchName', val);
    history.push(`${key.replace('/search','')}`)

  }
  return (
    <>
      <SearchBar placeholder={`请输入${PlaceholderConfig[key]}`} onSubmit={onSearch}/>
      <div className={styles.history__content}>
        <h4>{ HistoryConfig.title }</h4>
        {
          values?.map(item => <Tag key={item} onClick={onSearch.bind(null,item)}>{ item }</Tag>)
        }
      </div>
      <Divider>
        <Button type="link" onClick={remove}>
          { HistoryConfig.clearText} 
        </Button>
      </Divider>
    </>
  )
}
export default SearchPage