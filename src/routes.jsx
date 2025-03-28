import { LayoutDashboard, Calendar, Layers, Home } from "lucide-react";
import Shift from "./pages/Shift";
import Block from "./pages/Block";
import Room from "./pages/Room";
import RoomSchedule from "./pages/RoomSchedule";


export const routes = [
  { path: "/shifts", name: "Shifts", icon: <Calendar />, element: <Shift /> },
  { path: "/blocks", name: "Blocks", icon: <Layers />, element: <Block /> },
  { path: "/rooms", name: "Rooms", icon: <LayoutDashboard />, element: <Room /> },
  { path: "/schedule", name: "Room Schedule", element: <RoomSchedule /> },
];
