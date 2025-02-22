import { Container, Row, Col, ListGroup, Card } from "react-bootstrap";
import StackedBarChart from "../components/charts/StackedBarChart";
import StockAreaChart from "../components/charts/StockAreaChart";

export default function DefaultDashboard() {
  const totalEarnings = 100;
  const totalOrders = 10;
  const totalIncome = 1000;
  const totalLoss = 0;
  return (
    <Container className="p-2 space-y-2">
      <Row className="h-[200px] ">
        <Col md={4} className="bg-white rounded">
          <div className="">Total earning</div>
          {totalEarnings}$
        </Col>
        <Col md={4} className="bg-white rounded">
          <div className="">Total orders</div>
          {totalOrders}
        </Col>
        <Col md={4} className="bg-white rounded">
          <div className="bg-blue-200">total-income:{totalIncome}</div>
          <div className="bg-blue-300">total-loss:{totalLoss}</div>
        </Col>
      </Row>
      <Row className="h-[600px]">
        <Col md={6} className="bg-white rounded">
          <span>Graph about something</span>
          <div className="w-full h-full flex items-center">
            <StackedBarChart />
          </div>
        </Col>
        <Col md={6} className="bg-white rounded">
          <span className=" text-dark p-3">Big Box 2</span>
          <StockAreaChart />
          <ul className="bg-gray-100 space-y-2">
            <li className="bg-gray-200">1</li>
            <li className="bg-gray-200">2</li>
            <li className="bg-gray-200">3</li>
            <li className="bg-gray-200">4</li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}
