import React, { Component } from "react";
import { Row, Col } from "reactstrap";

function OrderHeader() {
  return (
    <Row style={{ fontWeight: "bold" }}>
      <Col>Order Number</Col>
      <Col>Order Type</Col>
      <Col>Order Placed Date</Col>
      <Col>Expected Shipment Date</Col>
    </Row>
  );
}

class Orders extends Component {
  state = {
    orders: [
      {
        number: "1001",
        type: "internet",
        placedDate: "2019-12-12",
        expectedShipmentDate: ""
      },
      {
        number: "1002",
        type: "phone",
        placedDate: "2019-10-10",
        expectedShipmentDate: ""
      },
      {
        number: "1003",
        type: "unknown",
        placedDate: "2019-5-5",
        expectedShipmentDate: ""
      }
    ],

    orderType: [
      {
        category: "internet",
        goalsOfService: "1"
      },
      {
        category: "phone",
        goalsOfService: "2"
      },
      {
        category: "unknown",
        goalsOfService: "3"
      }
    ]
  };
  render() {
    return (
      <>
        <div style={{ margin: "5rem 25%" }}>
          <div style={{ textAlign: "center" , marginBottom: "2rem" }}>
            <h2>Goals of Service</h2>
            <hr/>
          </div>
          <OrderHeader />
          {this.state.orders.map(order => (
            <Row key={order.number}>
              <Col>{order.number}</Col>
              <Col>{order.type}</Col>
              <Col>{order.placedDate}</Col>
              <Col>{order.expectedShipmentDate}</Col>
            </Row>
          ))}
        </div>
      </>
    );
  }
}

export default Orders;
