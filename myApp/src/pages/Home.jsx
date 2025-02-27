import { Container, Row, Col, ListGroup } from "react-bootstrap";
import DefaultDashboard from "../dashboards/DefaultDashboard";
import { useState } from "react";

export default function Home() {
  const [activeDashboard, setActiveDashboard] = useState(<DefaultDashboard />);

  const handleNavigation = (component, url) => {
    setActiveDashboard(component);
    window.history.pushState(null, "", url); // Changes URL without reloading
  };

  return (
    <Container fluid className="bg-gray-100">
      <Row>
        <Col md={3}>
          <TaskBar onNavigate={handleNavigation} />
        </Col>
        <Col className="p-2 " md={9}>
          {activeDashboard}
        </Col>
      </Row>
    </Container>
  );
}

function TaskBar({ onNavigate }) {
  const items1 = [
    {
      name: "Default",
      component: <DefaultDashboard />,
      href: "/dashboard-statistics",
    },
    { name: "Analytics", href: "/dashboard-analytics" },
  ];
  const items2 = [
    { name: "Statistics", href: "/dashboard-statistics" },
    { name: "Data", href: "/dashboard-data" },
    { name: "Chart", href: "/dashboard-chart" },
  ];
  const items3 = [
    { name: "Users", href: "/dashboard-users" },
    { name: "Customers", href: "/dashboard-customers" },
    { name: "Employees", href: "/dashboard-employees" },
    {
      name: "Items",
      component: <itemsDashboard />,
      href: "/dashboard-statistics",
    },
    { name: "Orders", href: "/dashboard-orders" },
    { name: "Mail", href: "/dashboard-mail" },
    { name: "Messages", href: "/dashboard-messages" },
    { name: "Logs", href: "/dashboard-logs" },
  ];
  return (
    <Container className="">
      <div className="h-[50px]">
        <span className="font-semibold text-xl">Dashboard</span>
      </div>
      <ListGroup className="gap-2 mb-3 flex flex-col">
        {items1.map((item, index) => (
          <ListGroup.Item
            key={index}
            action
            onClick={() => onNavigate(item.component, item.url)}
            className="bg-gray-100 rounded cursor-pointer"
          >
            {item.name}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <h4 className="font-semibold">Widget</h4>
      <ListGroup className="gap-2 mb-3 flex flex-col">
        {items2.map((item, index) => (
          <ListGroup.Item
            key={index}
            action
            onClick={() => onNavigate(item.component, item.url)}
            className="bg-gray-100 rounded cursor-pointer"
          >
            {item.name}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <h4 className="font-semibold">Application</h4>
      <ListGroup className="gap-2 mb-3 flex flex-col">
        {items3.map((item, index) => (
          <ListGroup.Item
            key={index}
            action
            onClick={() => onNavigate(item.component, item.url)}
            className="bg-gray-100 rounded cursor-pointer"
          >
            {item.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}
