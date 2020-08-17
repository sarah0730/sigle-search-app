import React , { useState, useCallback, useEffect } from 'react';
import { connect, useHistory, useDispatch } from 'umi';
import {  SearchBar, Toast, Flex } from 'antd-mobile';
import { StarFilled, ForkOutlined , CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import _ from 'lodash';
import styles from './index.less';

const FlexItem = Flex.Item;

interface NodeItem {
  node: NodeItemProps
}
interface NodeItemProps {
  resourcePath:string,
  updatedAt:string,
  description:string,
  forkCount:number,
  stargazers: NumProps,
  starCount:number,
  url:string,
}
interface NumProps{
  totalCount:number
}
const ListPage = () => {
  //路径跳转 searchPage
  const history = useHistory(); 
  const dispatch = useDispatch();
  //获取搜索页面的值
  const searchName = localStorage.getItem('searchName');
  //index页面搜索框值
  const [listSearchName, setListSearchName] = useState(searchName);
  //列表数据源
  const [dataSource, setDataSource] = useState<NodeItemProps[]>([]);
  //错误信息显示
  const [error, setError] = useState('');
  //页面加载
  const [loading, setLoading] = useState(false)
  //查询参数
  const variables = {
    first: 40,
    after: null,
    query: listSearchName ,
    type: "REPOSITORY"
  };
  //列表高度
  const [listHeight, setListHeight] = useState<Number>()
  //排序 - star
  const [starSort, setStarSort] = useState(true);
  const starDesc = () => {
    setStarSort(!starSort);
    const sort = starSort ? 'asc' : 'desc';
    const newDataSource: any = _.orderBy(dataSource, ['starCount'], [sort]);
    setDataSource(newDataSource);
  };
  //排序 - fork
  const [forkSort, setForkSort] = useState(true)
  const forkDesc = () => {
    setForkSort(!forkSort);
    const sort = forkSort ? 'asc' :'desc';
    const newDataSource: any = _.orderBy(dataSource, 'forkCount', [sort]);
    setDataSource(newDataSource);
  };

  //排序更新时间 - time
  const [timeSort, setTimeSort] = useState(true)
  const timeDesc = () => {
    setTimeSort(!timeSort);
    const sort = timeSort ? 'asc' : 'desc';
    const newDataSource: any = _.orderBy(dataSource, ['updatedAt'], [sort]);
    setDataSource(newDataSource);
  };
  const selectList = useCallback(async () => {
    setLoading(true);
     dispatch({
      type: 'list/queryList',
      payload:variables,
      callback:(data:any)=>{
        setLoading(false);
        if( data.status === 200){
          if(data.data.data && data.data.data.search){
            const result:Array<NodeItem> = data.data.data.search.edges;
            const newData:Array<NodeItemProps> = [];
            result.map(item=>{
              const { node } = item;
              return newData.push({ 
                resourcePath: node.resourcePath, 
                description: node.description ,
                forkCount: node.forkCount,
                updatedAt: node.updatedAt,
                stargazers: node.stargazers,
                starCount: node.stargazers.totalCount,
                url:node.url
              })
            })
            setDataSource(newData)
   
          }else{
            Toast.fail(data.data.errors.message,5)
          }
        }
        else{
          Toast.fail("连接失败!",3)
        }
      },
      errback:(err:Error)=>{
        setLoading(false);
        setError(err.message)
      }
    })
    
  }, [dispatch]);
  useEffect(() => {
    if(listSearchName){
      selectList();
    }
    setListHeight(window.innerHeight - 72 )
   
  }, [dispatch]);
  return (
    <div className={styles.warp}>
      <SearchBar
        onFocus={() => history.push('/search')}
        value={listSearchName||""}
        onCancel={val => {
          localStorage.removeItem('searchName');
          setListSearchName('');
          setDataSource([])
        }}
      />
      <Spin spinning={loading} tip={'数据加载中...'} style={{marginTop:'50%'}}>
        <div className={styles.warp__sortBox__bg}>
          <Flex className={styles.warp__sortBox__content}>
            <FlexItem className={styles.warp__sortBox__content_star} onClick={starDesc}>
              <span>Star</span>
              {starSort ? <CaretDownOutlined /> : <CaretUpOutlined />}
            </FlexItem>
            <FlexItem className={styles.warp__sortBox__content_fork} onClick={forkDesc}>
              <span>Fork</span>
              {forkSort ? <CaretDownOutlined /> : <CaretUpOutlined />}
            </FlexItem>
            <FlexItem className={styles.warp__sortBox__content_time} onClick={timeDesc}>
              <span>更新时间</span>
              {timeSort ? <CaretDownOutlined /> : <CaretUpOutlined />}
            </FlexItem>
          </Flex>
        </div>
        <div style={{overflow:'scroll',height:`${listHeight}px`}}>
  
          {
            error ?
              <span className={styles.warp__error}>错误提示:{error}</span>
            : null
          }
          <ul className={styles.warp__list}>
            {
              dataSource.map((item:any,index:number)=>{
                return <li key={index} className={styles.warp__list_item}>
                        <Flex>
                          <FlexItem className={styles.warp__list_item_title}><a target="_blank"  href={item.url}>{item.resourcePath ? item.resourcePath : '--'}</a></FlexItem>
                        </Flex>
                        <div className={styles.warp__list_item_description}> { item.description ? item.description : '--'  }</div>
                        <Flex>
                          <FlexItem><StarFilled  style={{color:'#fb8c34',marginRight:4}}/>{item.stargazers.totalCount ? item.stargazers.totalCount : '--'}</FlexItem>
                          <FlexItem><ForkOutlined  style={{color:'#fb8c34',marginRight:4}}/>{item.forkCount ? item.forkCount : '--'}</FlexItem>
                          <FlexItem className={styles.warp__list_item_time}>{ item.updatedAt && item.updatedAt? item.updatedAt.substr(0,10):'--'}</FlexItem>
                        </Flex>
                      </li>
              })
            }
          </ul>
      </div>
      </Spin>
    </div>
  );
}
export default connect()(ListPage);
