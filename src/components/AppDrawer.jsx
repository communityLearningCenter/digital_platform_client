import React from "react";
import {
  Box,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Collapse,
} from "@mui/material";

import {  
  Home as HomeIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  //PersonAdd as RegisterIcon,
  AssignmentInd as RegisterIcon,
  Login as LoginIcon,
  AssignmentInd as StudRegisterIcon,
  LocalLibrary as StuListIcon,
  Group as VTListIcon,
  HomeWork as LCIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import ClassIcon from '@mui/icons-material/Class';

import reportCard from "/report-card_5.png";
import { useApp } from "../ThemedApp";
import { useNavigate } from "react-router-dom";

function ReportCardIcon(props) {
  return (
    <img
      src={reportCard}
      alt="Report Card"
      style={{
        width: 20,
        height: 22,
        display: "block",
        ...props.style,
      }}
    />
  );
}

// 🔑 Menu config per role
const menuConfig = {
  "System Admin": [
    { label: "Dashboard", icon: <DashboardOutlinedIcon/>, path: (auth) => `/dashboard`},
    { label: "Profile", icon: <ProfileIcon />, path: (auth) => `/profile/${auth.id}` },
    { label: "Teachers", icon: <VTListIcon />, children: [
        { label: "Teachers Registeration", icon: <RegisterIcon />, path: "/teachersregisteration" },
        { label: "Teachers List", icon: <VTListIcon />, path: "/teachers" },]
    },
    { label: "Students", icon: <StuListIcon />, children: [
      { label: "Student Registeration", icon: <StudRegisterIcon />, path: "/registration" },
      { label: "Student List", icon: <StuListIcon />, path: "/students" },]
    },    
    { label: "Exam Results", icon: <ReportCardIcon />, children: [
      { label: "Exam Results", icon: <ReportCardIcon />, path: "/examresult" },
      { label: "Exam Results List", icon: <ReportCardIcon />, path: "/examresultlist" },]
    }, 
    { label: "Teaching Materials", icon: <ClassIcon />, path: (auth) => `/teachingmaterials/${auth.id}` },
    { label: "Setup", icon: <SettingsTwoToneIcon/>, children: [
      { label: "Learning Centers", icon: <LCIcon />, path: "/learningcenters" },
      { label: "Academic Years", icon: <CalendarMonthTwoToneIcon />, path: "/acayrs" },]
    },
    //{ label: "Calculate Avg Grade", icon: <ReportCardIcon />, path: "/calgrade" },
  ],
  "Volunteer Teacher": [
    { label: "Profile", icon: <ProfileIcon />, path: (auth) => `/profile/${auth.id}` },
    { label: "Students", icon: <StuListIcon />, children: [
      { label: "Student Registeration", icon: <StudRegisterIcon />, path: "/registration" },
      { label: "Student List", icon: <StuListIcon />, path: "/students" },]
    },  
    { label: "Exam Results", icon: <ReportCardIcon />, children: [
      { label: "Exam Results", icon: <ReportCardIcon />, path: "/examresult" },
      { label: "Exam Results List", icon: <ReportCardIcon />, path: "/examresultlist" },]
    },  
    { label: "Teaching Materials", icon: <ClassIcon />, path: (auth) => `/teachingmaterials/${auth.id}` },
  ],
  Guest: [
    { label: "Register", icon: <RegisterIcon />, path: "/register" },
    { label: "Login", icon: <LoginIcon />, path: "/" },
  ],
};

export default function AppDrawer() {
  const { showDrawer, setShowDrawer, auth, setAuth } = useApp();
  const [openMenus, setOpenMenus] = React.useState({});
  const navigate = useNavigate();

  const role = auth ? auth.role : "Guest";
  const menuItems = menuConfig[role] || [];

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <Drawer
      open={showDrawer}
      onClose={() => setShowDrawer(false)}
      sx={{
        "& .MuiDrawer-paper": {
          width: 300,
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          mt: 10
        },
      }}
    >
      {/* Header (fixed at the top) */}
      <Box
        sx={{
          width: "100%",
          height: 130,
          bgcolor: "banner",
          position: "relative",
          flexShrink: 0, // prevents shrinking when small screen
        }}
      >
        <Box
          sx={{
            gap: 2,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            position: "absolute",
            left: 20,
            bottom: -30,
          }}
        >
          <Avatar
            src={auth && auth.avatarUrl ? auth.avatarUrl : undefined}
            sx={{
              width: 94,
              height: 94,
              color: "white",
              background: "#ef6c00",
            }}
          />
          <Typography sx={{ fontWeight: "bold" }}>
            {auth ? auth.name : "Guest"}
          </Typography>
        </Box>
      </Box>

      {/* Scrollable menu */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 6 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton sx={{ py: 1.5, minHeight: 52 }}
              onClick={() => {
                navigate("/home");
                setShowDrawer(false);
              }}
            >
              <ListItemIcon sx={{ minWidth: 57 }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
              <Box sx={{ width: 24 }} /> {/* spacer for alignment */}
            </ListItemButton>
          </ListItem>
          <Divider />

          {menuItems.map((item, index) => {
            const hasChildren = Array.isArray(item.children);

            return (
              <React.Fragment key={index}>
                {/* Parent */}
                <ListItem disablePadding>
                  <ListItemButton  sx={{ py: 1.5, minHeight: 52 }}
                    onClick={() =>{
                      if(hasChildren) {
                        toggleMenu(item.label);
                      }
                      else {
                        typeof item.path === "function"
                        ? navigate(item.path(auth))
                        : navigate(item.path);
                        setShowDrawer(false);          
                      }}       
                    }
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                    {hasChildren &&
                      (openMenus[item.label] ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      ))}
                  </ListItemButton>
                </ListItem>

                {/* Children */}
                {hasChildren && (
                  <Collapse
                    in={openMenus[item.label]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.children.map((child, i) => (
                        <ListItemButton
                          key={i}
                          sx={{ pl: 6 }}
                          onClick={() => {
                            navigate(child.path);
                            setShowDrawer(false);
                          }}
                        >
                          <ListItemIcon>{child.icon}</ListItemIcon>
                          <ListItemText primary={child.label} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}

          {/* {menuItems.map(({ label, icon, path }, index) => (
            <ListItem key={index}>
              <ListItemButton
                onClick={() =>
                  typeof path === "function" ? navigate(path(auth)) : navigate(path)
                }
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText>{label}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))} */}

          {auth && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  localStorage.removeItem("token");
                  setAuth(null);
                  navigate("/");
                  setShowDrawer(false);
                }}
              >
                <ListItemIcon sx={{ minWidth: 57 }}>
                  <LogoutIcon color="error" />
                </ListItemIcon>
                <ListItemText>Logout
                  <Box sx={{ width: 24 }} /> {/* spacer for alignment */}
                </ListItemText>
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );
}
