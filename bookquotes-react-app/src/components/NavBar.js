import React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

const NavBar = () => {
    return (
        <div className="nav-bar-area">
            <form action="">
                <ButtonGroup className="main-btn-grp" variant="text" size="large" aria-label="large text button group">
                    <Button>Recent Quotes</Button>
                    <Button>My Quotes</Button>
                    <Button>Bookmarked</Button>
                </ButtonGroup>
            </form>
        </div>
    );
}

export default NavBar;