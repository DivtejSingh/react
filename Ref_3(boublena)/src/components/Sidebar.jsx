import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Box, Collapse, Drawer, List, ListItem, ListItemText } from '@mui/material';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';

const Sidebar = ({ openSidebar, setOpenSidebar }) => {
  const dataToDisplay = useSelector((state)=>state?.category?.category)
  const [open, setOpen] = useState(true);
  const [openSecondLevel, setOpenSecondLevel] = useState({});

  const handleClick = () => {
    setOpen(!open);
  };

  const toggleSecondLevel = (category, event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenSecondLevel((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  // Filter out categories with a total of 0
  const filteredNavigation = dataToDisplay?.data
    ? Object.fromEntries(
      Object.entries(dataToDisplay.data).filter(([category, items]) => {
        return items.some((item) => item.total > 0);
      })
    )
    : {};

  return (
    <Drawer open={openSidebar} onClose={() => setOpenSidebar(false)} sx={{ zIndex: 99 }} className="z-10">
      <Box sx={{ width: { xs: '98vw', sm: '47vw', md: '33vw', lg: '26vw' } }}>
        <CloseIcon
          onClick={() => setOpenSidebar(false)}
          sx={{ textAlign: 'right', position: 'absolute', right: '45px', top: '15px', cursor: 'pointer' }}
        />
        <ul className="pt-20 px-10">
          <List>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setOpenSidebar(false)}>
              <ListItem button>
                <ListItemText primary="Home" />
              </ListItem>
            </NavLink>
            <ListItem button onClick={handleClick}>
              <ListItemText primary="Categories" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={!open} timeout="auto" unmountOnExit>
              {filteredNavigation &&
                Object.entries(filteredNavigation).map(([category, items]) => {
                  return (
                    <React.Fragment key={category}>
                      <HashLink to={`/#${category}`} onClick={() => setOpenSidebar(false)}>
                        {items[0].status > 0 && (
                          <ListItem sx={{ color: '#000', pl: 5 }} button>
                            <ListItemText primary={category} />
                            {items[0].is_parent ? (
                              <span onClick={(event) => toggleSecondLevel(category, event)}>
                                {openSecondLevel[category] ? <ExpandLess /> : <ExpandMore />}
                              </span>
                            ) : null}
                          </ListItem>
                        )}
                      </HashLink>

                      {items[0].is_parent > 0 && (
                        <Collapse in={openSecondLevel[category]} timeout="auto" unmountOnExit>
                          <List>
                            {items[0].content.map((subCat) => {
                              if (subCat.status == 1) {
                                return (
                                  <HashLink key={subCat.cat_id} to={`/#${subCat.cat_name}`} onClick={() => setOpenSidebar(false)}>
                                    <ListItem button sx={{ pl: 8 }}>
                                      <ListItemText primary={subCat.cat_name} />
                                    </ListItem>
                                  </HashLink>
                                )
                              }
                            })}
                          </List>
                        </Collapse>
                      )}
                    </React.Fragment>
                  );
                })}
            </Collapse>
            <NavLink to="/about_us" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setOpenSidebar(false)}>
              <ListItem button>
                <ListItemText primary="About" />
              </ListItem>
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setOpenSidebar(false)}>
              <ListItem button>
                <ListItemText primary="Contact" />
              </ListItem>
            </NavLink>
          </List>
        </ul>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
