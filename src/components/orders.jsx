import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import moment from "moment";

const DATE = "MMMM DD, YYYY";
const TIME = "hh:mm a";
const DATE_AND_TIME = "MMMM DD, YYYY, h:mm a";
const SUNDAY = "su";
const SATURDAY = "sa";

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
    //number property of orders object is used as a key, therefore, needs to be unique
    orders: [
      {
        number: "1001",
        type: "internet",
        placedDate: "2019-12-12 11:30 am",
        expectedShipmentDate: ""
      },
      {
        number: "1002",
        type: "internet",
        placedDate: "2019-12-12 3:30 pm",
        expectedShipmentDate: ""
      },
      {
        number: "1003",
        type: "phone",
        placedDate: "2019-10-11 10:23 am",
        expectedShipmentDate: ""
      },
      {
        number: "1004",
        type: "other",
        placedDate: "2019-12-21, 4:00 pm",
        expectedShipmentDate: ""
      }
    ],

    //here, goalsOfService represents days taken to process an order based on the category(how the order was placed)
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
        category: "other",
        goalsOfService: "3"
      }
    ],

    //dates fetched from Holidays table
    holidays: ["January 1", "February 18", "April 19", "December 25"]
  };

  getServiceDaysByType = orderType => {
    const index = this.state.orderType.findIndex(x => x.category === orderType);
    const serviceDays = this.state.orderType[index].goalsOfService;
    return serviceDays;
  };

  getShipmentDateByType = (orderType, orderPlacedDate) => {
    let serviceDays = this.getServiceDaysByType(orderType);
    let shipmentDate = moment(orderPlacedDate)
      .add(serviceDays, "days")
      .format(DATE_AND_TIME);

    // Add a day to the shipment date if order is placed after 2pm
    var expectedShipment = this.isOrderedAfterTwo(shipmentDate)
      ? moment(shipmentDate).add(1, "days")
      : shipmentDate;

    //add 1 day to shipment if holiday
    var isHoliday = this.state.holidays.includes(
      moment(expectedShipment).format("MMMM DD")
    );
    if (isHoliday) moment(expectedShipment).add(1, "days");

    //pad days if weekend
    var padDays = this.padShipmentDateIfWeekend(expectedShipment);
    expectedShipment = moment(shipmentDate).add(padDays, "days");

    return moment(expectedShipment).format(DATE);
  };

  padShipmentDateIfWeekend = date => {
    var day = moment(date)
      .format("dd")
      .toLowerCase();
    var addDays = 0;
    if (day === SATURDAY) {
      addDays = 2;
    } else if (day === SUNDAY) {
      addDays = 1;
    }
    return addDays;
  };

  //This function will take the date the order was placed and will check the time
  //If the order was placed after 2:00pm, it will add 1 business day to the expected shipment day
  isOrderedAfterTwo = date => {
    var orderTime = moment(date)
      .format(TIME)
      .valueOf();
    var orderDeadlineTime = moment("2:00 pm", TIME)
      .format(TIME)
      .valueOf();
    return moment(orderTime, TIME).isAfter(moment(orderDeadlineTime, TIME));
  };

  render() {
    return (
      <>
        <div style={{ margin: "5rem 15%" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2>Goals of Service</h2>
            <hr />
          </div>
          <OrderHeader />
          {this.state.orders.map(order => (
            <Row key={order.number}>
              <Col>{order.number}</Col>
              <Col>{order.type}</Col>
              <Col>{moment(order.placedDate).format(DATE_AND_TIME)}</Col>
              <Col>
                {this.getShipmentDateByType(order.type, order.placedDate)}
              </Col>
            </Row>
          ))}
        </div>
      </>
    );
  }
}

export default Orders;
