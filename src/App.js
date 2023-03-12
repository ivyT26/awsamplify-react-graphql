import React, {Component} from "react";

import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";

class App extends Component {
    render() {
        const { signOut } = this.props;
        return (
          <View className="App">
            <Card>
              <Heading level={1}>We now have Auth!</Heading>
            </Card>
            <Button onClick={signOut}>Sign Out</Button>
          </View>
        );
    }
}

export default withAuthenticator(App);