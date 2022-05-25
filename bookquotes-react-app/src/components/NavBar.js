import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import QuoteGrid from './QuoteGrid';
import data from '../assets/DummyList.json';
import GridQuoteTile from "./GridQuoteTile";
import request from 'superagent';

const NavBar = (props) => {

    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [recentData, setRecentData] = React.useState(data);
    const [userData, setUserData] = React.useState(data);
    const [markedData, setMarkedData] = React.useState(data);

    React.useEffect(() => {
        switch (true) {
            case value === '1':
                callQuotesAPI(null);
                break;
            case value === '2':
                callQuotesAPI('aahmed');
                break;
            case value === '3':
                setMarkedData(data);
                break;
            case value === '4':
                break;
            default:
                console.log("default");
        }
    }, [value]);

    // handle request to aws api

    const callQuotesAPI = (userName) => {
        request
            .get("https://7cdlx16y58.execute-api.us-east-2.amazonaws.com/prod/quotes")
            .query(userName !== null ? { userId: userName } : null)
            .set('content-type', 'application/json')
            .then((res) => {
                if (userName !== null) {
                    setUserData(res.body.quotes);
                } else {
                    setRecentData(res.body.quotes);
                }
            });
    }

    // plug in typesense search result data

    const isSearched = props.searchResults?.length === 0 ? false : true;
    const [searchData, setSearchData] = React.useState([]);
    React.useEffect(() => {
        if (isSearched) {
            setValue("4");
            setSearchData(props.searchResults);
        } else {
            setValue("1");
            setSearchData([]);
        }
    }, [isSearched, props.searchResults]);

    // create tiled list from data results

    let searchItems = searchData.map((item) => (
        <GridQuoteTile quoteData={item} key={item.postId} />
    ));

    let recentItems = recentData.map((item) => (
        <GridQuoteTile quoteData={item} key={item.postId} />
    ));

    let userItems = userData.map((item) => (
        <GridQuoteTile quoteData={item} key={item.postId} />
    ));

    let markedItems = markedData.map((item) => (
        <GridQuoteTile quoteData={item} key={item.postId} />
    ));

    // create NavBar body and plug data into Grid

    return (
        <Box sx={{ width: '100%', typography: 'body1' }} className="nav-bar-area">
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="tab nav">
                        <Tab label="Recent Quotes" value="1" />
                        <Tab label="My Quotes" value="2" />
                        <Tab label="Bookmarked" value="3" />
                        <Tab label="Search Results" value="4" disabled={!isSearched} />
                    </TabList>
                </Box>
                {/* Recent Quotes */}
                <TabPanel value="1" index={0}>
                    <QuoteGrid gridItems={recentItems} />
                </TabPanel>
                {/* My Quotes */}
                <TabPanel value="2" index={1}>
                    <QuoteGrid gridItems={userItems} />
                </TabPanel>
                {/* Bookmarked */}
                <TabPanel value="3" index={2}>
                    <QuoteGrid gridItems={markedItems} />
                </TabPanel>
                {/* Search Results */}
                <TabPanel value="4" index={3}>
                    <QuoteGrid gridItems={searchItems} />
                </TabPanel>
            </TabContext>
        </Box>
    );
}

export default NavBar;