import React, {Component} from 'react';
import {AppRegistry, ToastAndroid} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import '../lib/default';
import axios from 'axios';
import {
    Button,
    Col,
    Form,
    Grid,
    Input,
    Item,
    Label,
    Row,
    Text,
    Container,
    Spinner
} from 'native-base';
import update from 'react-addons-update';
import Globals from "../Globals";

class FormUser extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            loading: false,
            form: {
                name: '',
                email: '',
                id: null
            },
            errorMsg: ''
        };
    }

    componentDidMount() {
        let params = this.props.navigation.state.params;

        if (params) {
            let newState = update(this.state, {
                form: {
                    name: {
                        $set: params.name
                    },
                    email: {
                        $set: params.email
                    },
                    id: {
                        $set: params.id
                    }
                }
            });

            this.setState(newState);
        }
    }

    submit = () => {
        this.setState({ loading: true });
        const { name, email, id } = this.state.form;

        axios.post('/api/user/create', {
            name,
            email,
            id
        }).then(() => {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'ListUsers' })],
            });
            this.props.navigation.dispatch(resetAction);

            this.setState({ loading: false, errorMsg: false });

        }).catch(error => {
            this.setState({ loading: false, errorMsg: error.response.data.message });
        });
    };

    createButton = () => {
        if (this.state.loading) {
            return (<Spinner color={Globals.COLOR.PRIMARY_COLOR} />);
        }
        return (
            <Button
                onPress={this.submit}
                style={{ backgroundColor: Globals.COLOR.PRIMARY_COLOR, marginTop: 50 }}
            >
                <Text>Enviar</Text>
            </Button>
        )
    };

    render() {
        return (
            <Grid>
                <Row>
                    <Container>
                        <Form >
                            <Item floatingLabel>
                                <Label>Informe seu nome</Label>
                                <Input
                                    value={this.state.form.name}
                                    onChangeText={name => {
                                        let newState = update(this.state, {
                                            form: {
                                                name: {
                                                    $set: name
                                                }
                                            }
                                        });

                                        this.setState(newState);
                                    }}
                                />
                            </Item>
                            <Item floatingLabel>
                                <Label>Informe seu email</Label>
                                <Input
                                    value={this.state.form.email}
                                    onChangeText={email => {
                                        let newState = update(this.state, {
                                            form: {
                                                email: {
                                                    $set: email
                                                }
                                            }
                                        });

                                        this.setState(newState);
                                    }}
                                />
                            </Item>
                            <Grid >
                                <Row>
                                    <Col />
                                    <Col>
                                        {this.createButton()}
                                    </Col>
                                    <Col />
                                </Row>
                            </Grid>
                        </Form>
                    </Container>
                </Row>
                <Row>
                    <Col/><Col><Label style={{ color: 'red' }}>{this.state.errorMsg}</Label></Col><Col/>
                </Row>
            </Grid>
        );
    }
}

AppRegistry.registerComponent('FormUser', () => FormUser);
export { FormUser };
