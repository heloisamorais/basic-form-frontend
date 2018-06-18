import React, {Component} from 'react';
import {
    Container,
    Fab,
    Icon,
    List,
    ListItem,
    Spinner,
    Text,
    Grid,
    Row,
    Col,
    Item,
    Input,
    Label
} from 'native-base';
import Popup from 'react-native-popup';
import {NavigationActions} from 'react-navigation';
import {AsyncStorage} from 'react-native';
import '../lib/default';
import axios from 'axios';
import Globals from '../Globals';
import update from 'react-addons-update';

class ListUsers extends Component {

    _popup = {};
    _allUsers = [];

    constructor(props, context) {
        super(props, context);

        this.state = {
            users: [],
            loading: true,
            search: '',
            excluding: {}
        };
    }

    componentDidMount() {
        axios.get('/api/user').then((response) => {
            this._allUsers = response.data;
            this.setState({ users: response.data, loading: false });
        }).catch((error)=>{
            console.log(error);
        });
    }

    confirmDeleteUser = (user) => {
        this._popup.confirm({
            title: 'Apagar',
            content: ['Deseja realmente apagar ' + user.name + '?'],
            ok: {
                text: 'Sim',
                style: {
                    color: '#F44336'
                },
                callback: () => this.deleteUser(user),
            },
            cancel: {
                text: 'Cancelar',
                style: {
                    color: '#00a285'
                }
            },
        });

    };

    deleteUser = (user) => {
        let state = update(this.state, {
            excluding: {
                [user.id]:{
                    $set: true
                }
            }
        });

        this.setState(state);
        axios.delete('/api/user/delete?email=' + user.email).then((response) => {
            let state = update(this.state, {
                excluding: {
                    [user.id]:{
                        $set: false
                    }
                },
                users: {
                    $set: response.data
                }
            });

            this.setState(state);
        }).catch(() => {
            let state = update(this.state, {
                excluding: {
                    [user.id]:{
                        $set: false
                    }
                }
            });

            this.setState(state);
        });
    };

    redirect = (toWhere, param = null) => {
        this.props.navigation.dispatch(NavigationActions.navigate({
            routeName: toWhere,
            params: param,
            action: NavigationActions.navigate({ routeName: toWhere })
        }));
    };

    renderLoadind = () => {
        return (
            <Container
                style={{ backgroundColor: 'white',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                <Spinner color='#00a285' />
            </Container>
        );
    };

    doFilter = (search) => {
        let users = [].concat(this.state.users);

        if (search.length && search.length < this.state.search.length) {
            users =  this._allUsers;
        }

        let newUsers = users.filter((user) => user.name.includes(search));

        let newState = update(this.state, {
            search: {
                $set: search
            },
            users: {
                $set: newUsers
            }
        });

        this.setState(newState);
    };

    render() {
        return (
            this.state.loading ? this.renderLoadind() :
                <Container
                    style={{
                        paddingRight: '2%',
                        paddingLeft: '2%'
                    }}
                >
                        <Item floatingLabel>
                            <Label>Pesquisar</Label>
                            <Icon name={'md-search'}/>
                            <Input
                                value={this.state.search}
                                onChangeText={search => this.doFilter(search)}
                            />
                        </Item>
                    <List
                        dataArray={this.state.users}
                        renderRow={(user) =>
                            <ListItem button>
                                <Grid>
                                    <Row>
                                        <Col size={8}>
                                            <Text style={{ width: '90%' }}>{user.name}</Text>
                                        </Col>
                                        <Col>
                                            <Icon
                                                name="md-create"
                                                onPress={() => this.redirect('FormUser', user)}
                                            />
                                        </Col>
                                        <Col>
                                            {!this.state.excluding[user.id] &&
                                            <Icon
                                                name="md-close"
                                                onPress={() => this.confirmDeleteUser(user)}
                                            />
                                            }
                                            {this.state.excluding[user.id] &&
                                            <Spinner color='#00a285' />
                                            }
                                        </Col>
                                    </Row>
                                </Grid>
                            </ListItem>
                        }
                    />
                    <Fab
                        active={true}
                        direction="up"
                        containerStyle={{}}
                        style={{ backgroundColor: Globals.COLOR.PRIMARY_COLOR }}
                        position="bottomRight"
                        onPress={() => this.redirect('FormUser')}>
                        <Icon name="md-add" />
                    </Fab>
                    <Popup ref={(popup) => { this._popup = popup; }} />
                </Container>
        );
    }
}

export { ListUsers };
