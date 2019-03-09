import React, { Component } from "react";
import { Route } from "react-router-dom";

import { News, Projects, Profile, Header } from "../../components";

import { Container, StyledSwitch } from "./style";

class Dashboard extends Component {
  render() {
    return (
      <Container>
        <Header />
        <StyledSwitch>
          <Route path="/dashboard/news" component={News} />
          <Route path="/dashboard/projects" component={Projects} />
          <Route path="/dashboard/profile" component={Profile} />
        </StyledSwitch>
      </Container>
    );
  }
}

export default Dashboard;
