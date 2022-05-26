import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Dialog from '@mui/material/Dialog';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import QuoteGrid from './QuoteGrid';
// import data from '../assets/DummyList.json';
import GridQuoteTile from "./GridQuoteTile";
import request from 'superagent';

const NavBar = (props) => {
    
    // handle request to aws api
    const loggedInUserId = props.userId;

    const callQuotesAPI = React.useCallback((userName) => {
        request
            .get(props.apiUrl + "quotes")
            .query(userName !== null ? { userId: userName } : null)
            .set('content-type', 'application/json')
            .then((res) => {
                if (userName !== null) {
                    setUserData(res.body.quotes);
                } else {
                    setRecentData(res.body.quotes);
                }
            });
    }, [props.apiUrl]);

    const callBookmarkAPI = React.useCallback((userName) => {
        request
            .get(props.apiUrl + "bookmark")
            .query({ userId: userName })
            .set('content-type', 'application/json')
            .then((res) => {
                setMarkedData(res.body.quotes);
            });
    }, [props.apiUrl]);

    const handleAddBookmark = (postId) => {
        console.log(loggedInUserId);
        if(loggedInUserId !== undefined && loggedInUserId.length > 0){
            request
            .post(props.apiUrl + "bookmark")
            .send({ postId: postId, userId: loggedInUserId })
            .set('content-type', 'application/json')
            .then((res) => {
                if(res.body.Operation === 'SAVE'){
                    setOpenDialog(true); 
                    setDialogText('Bookmark Added!');
                }
            });
        } else {
            setOpenDialog(true); 
            setDialogText('Please Sign In!')
        }

    }
    const handleRemoveBookmark = (postId) => {
        request
            .delete(props.apiUrl + "bookmark")
            .send({ postId: postId, userId: loggedInUserId })
            .set('content-type', 'application/json')
            .then((res) => {
                if(res.body.Operation === 'SAVE'){
                    setOpenDialog(true); 
                    setDialogText('Bookmark Removed!')
                }
            });
    }

    const [dialogText, setDialogText] = React.useState('');
    const [openDialog, setOpenDialog] = React.useState(false);
    const handleDialogClose = () => {setOpenDialog(false); setDialogText('');};

    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [recentData, setRecentData] = React.useState([]);
    const [userData, setUserData] = React.useState([]);
    const [markedData, setMarkedData] = React.useState([]);
    const isLoggedIn = props.userId?.length === 0 ? false : true;

    React.useEffect(() => {
        switch (true) {
            case value === '1':
                callQuotesAPI(null);
                break;
            case value === '2':
                callQuotesAPI(props.userId);
                break;
            case value === '3':
                callBookmarkAPI(props.userId);
                break;
            case value === '4':
                break;
            default:
                console.log("default");
        }

    }, [value, props.userId, callBookmarkAPI, callQuotesAPI]);

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
        <GridQuoteTile quoteData={item} key={item.postId} handleAddBookmark={handleAddBookmark} isMarked={false}/>
    ));

    let recentItems = recentData.map((item) => (
        <GridQuoteTile quoteData={item} key={item.postId} handleAddBookmark={handleAddBookmark} isMarked={false}/>
    ));

    let userItems = userData.map((item) => (
        <GridQuoteTile quoteData={item} key={item.postId} handleAddBookmark={handleAddBookmark} isMarked={false}/>
    ));

    let markedItems = markedData.map((item) => (
        <GridQuoteTile quoteData={item} key={item.postId} handleRemoveBookmark={handleRemoveBookmark} isMarked={true}/>
    ));

    // create NavBar body and plug data into Grid

    return (
        <Box sx={{ width: '100%', typography: 'body1' }} className="nav-bar-area">
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="tab nav">
                        <Tab label="Recent Quotes" value="1" />
                        <Tab label="My Quotes" value="2" disabled={!isLoggedIn} />
                        <Tab label="Bookmarked" value="3" disabled={!isLoggedIn} />
                        <Tab label="Search Results" value="4" disabled={!isSearched} />
                    </TabList>
                </Box>
                {/* Recent Quotes */}
                <TabPanel value="1" index={0}>
                    <QuoteGrid gridItems={recentItems} />
                    <Dialog onClose={handleDialogClose} open={openDialog}><Box component="span" sx={{ p: 2}}>{dialogText}</Box></Dialog>
                </TabPanel>
                {/* My Quotes */}
                <TabPanel value="2" index={1}>
                    <QuoteGrid gridItems={userItems} />
                    <Dialog onClose={handleDialogClose} open={openDialog}><Box component="span" sx={{ p: 2}}>{dialogText}</Box></Dialog>
                </TabPanel>
                {/* Bookmarked */}
                <TabPanel value="3" index={2}>
                    <QuoteGrid gridItems={markedItems} />
                    <Dialog onClose={handleDialogClose} open={openDialog}><Box component="span" sx={{ p: 2}}>{dialogText}</Box></Dialog>
                </TabPanel>
                {/* Search Results */}
                <TabPanel value="4" index={3}>
                    <QuoteGrid gridItems={searchItems} />
                    <Dialog onClose={handleDialogClose} open={openDialog}><Box component="span" sx={{ p: 2}}>{dialogText}</Box></Dialog>
                </TabPanel>
            </TabContext>
        </Box>
    );
}

export default NavBar;