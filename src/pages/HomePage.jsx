import React from 'react'
import { itemDateFormatter } from '../utility/dateUtils';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { numberToCommaString } from '../utility/numberUtils';
import Filters from '../components/pages/HomePage/Filters';
// import alert from '../utility/alert'

const HomePage = () => {
    // let pageNo = 1;
    const [pageNo, setPageNo] = React.useState(1);
    const [itemList, setItemList] = React.useState([]);
    const [noMoreItems, setNoMoreItems] = React.useState(false); //load more disable 1
    const [filters, setFilters] = React.useState({})
    console.log(filters);

    const getFiltersQuery = () => {

        console.log('1');
        return Object.keys(filters).length > 0 ? '&' + (Object.keys(filters).map(key => `${key}=${filters[key]}`).join('&')) : ''
    }

    React.useEffect(() => {
        setPageNo(1)
        // fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/items?page=1&type=${filters.type}&propertyType=${filters.propertyType} `)
        fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/items?page=1${getFiltersQuery()} `)
            .then((response) => response.json())
            .then((data) => {
                if (data.data.length > 0) {
                    setItemList(data.data)
                }
                else {
                    setNoMoreItems(true); //load more disable 2
                    // alert('No Item Exists', 'error')
                }
            })
    }, [filters])
    // console.log('itemList ', itemList);
    //LOAD MORE FUNCTIONALITY
    const getNewPage = () => {
        // pageNo++;
        fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/items?page=${pageNo + 1}${getFiltersQuery()}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.data.length > 0) {
                    setItemList([...itemList, ...data.data]);
                }
                else {
                    setNoMoreItems(true) //load more disable 3
                    // alert('No more item', 'error')
                }
            });
        setPageNo(pageNo + 1);
    }
    return (
        <>
            <Filters filters={filters} setFilters={setFilters} />

            <div className='item-list'>
                {
                    itemList.length > 0 && itemList.map(
                        (item, key) => <ItemCard key={item.id} {...item} />
                    )
                }
            </div>
            <div className="next-page">
                {
                    noMoreItems ?
                        <Button variant="contained" disabled> {/*//load more disable 4*/}
                            No More Items
                        </Button>
                        :
                        <Button variant="contained" onClick={getNewPage}> {/*//load more disable 5 */}
                            Load More
                        </Button>
                }
            </div>
        </>
    )
}
const ItemCard = ({ id, title, imgList, listType, location, price, createdAt }) => {
    // const formattedCreatedTime = new Date(createdAt).toLocaleDateString();
    // console.log(formattedCreatedTime);
    return (
        <div className="item-card-container">
            <Link to={`/item/${id}`}>
                <div className="item-card">
                    <div className="item-card-imgs">
                        {/* <img src={imgList[0]} /> */}{/**FOR SINGLE IMAGE */}
                        {
                            imgList.length > 0
                                ? (imgList.map((img, idx) => <img src={img} key={idx} />))
                                : (<div>No Image</div>)
                        }
                    </div>
                    <div className="img-card-body">
                        <div className="img-card-price">₹ {numberToCommaString(price)}</div>
                        <div className="img-card-title">{title}</div>
                        <div className="img-card-location">{location}</div>
                        {/* <div className="img-card-row-space-between"> */}
                        {/* </div> */}
                    </div>
                    <div className="img-card-footer">
                        <div>{listType}</div>
                        {/* <div>{createdAt}</div> */}
                        <div>{itemDateFormatter(createdAt)}</div> {/*date 4*/}
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default HomePage;