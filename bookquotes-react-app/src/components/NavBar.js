import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import QuoteGrid from './QuoteGrid';
import data from '../assets/DummyList.json';
import GridQuoteTile from "./GridQuoteTile";

const NavBar = (props) => {

    const isSearched = props.searchResults.length === 0 ? false : true;

    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    React.useEffect(() => {
        if(isSearched){
            setValue("4");
        } else {
            setValue("1");
        }
      },[isSearched]);

    let gridItems = data.map((item) => (
        <GridQuoteTile quoteData={item} key={item.postId}/>
      ));

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
                    <QuoteGrid gridItems={gridItems}/>
                    {/* <QuoteGrid gridItems={gridItems}/> */}
                </TabPanel>
                {/* My Quotes */}
                <TabPanel value="2" index={1}>
                    Item Two
                </TabPanel>
                {/* Bookmarked */}
                <TabPanel value="3" index={2}>
                    Item Three
                </TabPanel>
                {/* Search Results */}
                <TabPanel value="4" index={3}>
                    Item Four
                </TabPanel>
            </TabContext>
        </Box>
    );
}

export default NavBar;