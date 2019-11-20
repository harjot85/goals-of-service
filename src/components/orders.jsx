import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import moment from "moment";
import * as CONSTANT from '../utilities/constants';


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

//////////////////////////////////////////////////////////////////////////////////////
// NOTE: 
// Please bear in mind, this is s simple solution to the problem. 
// It does not account for all the edge cases 
// It can be expanded and improved 
// Some variety is used over consistency to show different ways 
// My main goal is to provide you some insight into my work
//////////////////////////////////////////////////////////////////////////////////////

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
        placedDate: "2019-10-11 3:23 pm",
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
        goalsOfService: "0"
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
    holidays: ["January 1", "February 18", "April 19", "December 25", "October 14"]
  };

  getServiceDaysByType = orderType => {
    const index = this.state.orderType.findIndex(x => x.category === orderType);
    const serviceDays = this.state.orderType[index].goalsOfService;
    return serviceDays;
  };

  // Main function 
  getShipmentDateByType = (orderType, orderPlacedDate) => {
    //pad days if weekend on the day of order placed
    //ASSUMPTION: If order is placed on weekday, it would start getting processed on the next business day
    var daysToPadIfWeekend = this.getDaysToAddIfWeekend(orderPlacedDate);
    var expectedShipment = moment(orderPlacedDate)
      .add(daysToPadIfWeekend, CONSTANT.DAYS)
      .format(CONSTANT.DATE_AND_TIME);

    //Add regular shipment days by Order Type
    let serviceDays = this.getServiceDaysByType(orderType);
    expectedShipment = moment(expectedShipment).add(serviceDays, CONSTANT.DAYS);

    // Add additional day to the shipment date if order is placed after 2pm on a weekday
    if (daysToPadIfWeekend === 0) {
      expectedShipment = this.isOrderedAfterTwo(expectedShipment)
        ? moment(expectedShipment).add(1, CONSTANT.DAYS)
        : expectedShipment;
    }

    //add 1 day to shipment if holiday on the day of shipment
    //does not account for consecutive holidays
    var isHoliday = this.state.holidays.includes(
      moment(expectedShipment).format("MMMM DD")
    );
    if (isHoliday) moment(expectedShipment).add(1, CONSTANT.DAYS);

    //pad days if weekend on the day of shipment
    var padDays = this.getDaysToAddIfWeekend(expectedShipment);
    expectedShipment = moment(expectedShipment).add(padDays, CONSTANT.DAYS);

    return moment(expectedShipment).format(CONSTANT.DATE);
  };

  // helper function
  getDaysToAddIfWeekend = date => {
    var day = moment(date)
      .format("dd")
      .toLowerCase();
    var addDays = 0;
    if (day === CONSTANT.SATURDAY) {
      addDays = 2;
    } else if (day === CONSTANT.SUNDAY) {
      addDays = 1;
    }
    return addDays;
  };

  //helper function
  //This function will take the date the order was placed and will check the time
  //If the order was placed after 2:00pm, it will add 1 business day to the expected shipment day
  isOrderedAfterTwo = date => {
    var orderTime = moment(date)
      .format(CONSTANT.TIME)
      .valueOf();
    var orderDeadlineTime = moment(CONSTANT.ORDER_DEADLINE_FOR_DAY, CONSTANT.TIME)
      .format(CONSTANT.TIME)
      .valueOf();
    return moment(orderTime, CONSTANT.TIME).isAfter(moment(orderDeadlineTime, CONSTANT.TIME));
  };

  render() {
    return (
      <>
        <div style={{ margin: "5rem 10%" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2>Goals of Service</h2>
            <hr />
          </div>
          <OrderHeader />
          <hr />
          {this.state.orders.map(order => (
            <Row
              key={order.number}
              style={{ borderBottom: "1px solid #E8E8E8", marginTop: "2rem" }}
            >
              <Col>{order.number}</Col>
              <Col>{order.type}</Col>
              <Col>{moment(order.placedDate).format(CONSTANT.DATE_AND_TIME)}</Col>
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
