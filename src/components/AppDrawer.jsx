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
} from "@mui/material";

import {
  Home as HomeIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  PersonAdd as RegisterIcon,
  Login as LoginIcon,
  AssignmentInd as StudRegisterIcon,
  LocalLibrary as StuListIcon,
  Group as VTListIcon,
  HomeWork as LCIcon,
} from "@mui/icons-material";

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
  "System Administrator": [
    { label: "Profile", icon: <ProfileIcon />, path: (auth) => `/profile/${auth.id}` },
    { label: "Teachers Registeration", icon: <VTListIcon />, path: "/teachersregisteration" },
    { label: "Teachers List", icon: <VTListIcon />, path: "/teachers" },
    { label: "Student Registeration", icon: <StudRegisterIcon />, path: "/registration" },
    { label: "Student List", icon: <StuListIcon />, path: "/students" },
    { label: "Learning Centers", icon: <LCIcon />, path: "/learningcenters" },
    { label: "Exam Results", icon: <ReportCardIcon />, path: "/examresult" },
    { label: "Exam Results List", icon: <ReportCardIcon />, path: "/examresultlist" },
  ],
  "Volunteer Teacher": [
    { label: "Profile", icon: <ProfileIcon />, path: (auth) => `/profile/${auth.id}` },
    { label: "Student Registeration", icon: <StudRegisterIcon />, path: "/registration" },
    { label: "Student List", icon: <StuListIcon />, path: "/students" },
    { label: "Exam Results", icon: <ReportCardIcon />, path: "/examresult" },
    { label: "Exam Results List", icon: <ReportCardIcon />, path: "/examresultlist" },
  ],
  Guest: [
    { label: "Register", icon: <RegisterIcon />, path: "/register" },
    { label: "Login", icon: <LoginIcon />, path: "/" },
  ],
};

export default function AppDrawer() {
  const { showDrawer, setShowDrawer, auth, setAuth } = useApp();
  const navigate = useNavigate();

  const role = auth ? auth.role : "Guest";
  const menuItems = menuConfig[role] || [];

  return (
    <Drawer
      open={showDrawer}
      onClose={() => setShowDrawer(false)}
      sx={{
        "& .MuiDrawer-paper": {
          width: 300,
          height: "100vh",
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
        <List onClick={() => setShowDrawer(false)}>
          <ListItem>
            <ListItemButton onClick={() => navigate("/home")}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText>Home</ListItemText>
            </ListItemButton>
          </ListItem>
          <Divider />

          {menuItems.map(({ label, icon, path }, index) => (
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
          ))}

          {auth && (
            <ListItem>
              <ListItemButton
                onClick={() => {
                  localStorage.removeItem("token");
                  setAuth(null);
                  navigate("/");
                }}
              >
                <ListItemIcon>
                  <LogoutIcon color="error" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );
}
