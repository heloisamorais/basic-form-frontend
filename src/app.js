import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { FormUser, ListUsers } from './components';

class App extends Component {

    render() {
        return (
            <Stacks />
        );
    }
}

const Stacks = StackNavigator({
    ListUsers: {
        screen: ListUsers,
        navigationOptions: {
            title: 'Basic Form',
            fontWeight: 'bold',
            headerLeft: null
        }
    },
    FormUser: {
        screen: FormUser,
        navigationOptions: {
            title: 'Basic Form',
            fontWeight: 'bold',
            headerLeft: null
        }
    }

});

export default App;
