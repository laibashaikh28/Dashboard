import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Col, Row, Container} from 'react-bootstrap'
import WidgetBar from './WidgetBar'
import WidgetText from './WidgetText'
import WidgetDoughnut from './WidgetDoughnut'
import WidgetColumn from './WidgetColumn'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css'
import './Dashboard.css'
//excel import
const config = {
    apiKey: 'AIzaSyDMu-Vw30ykPPmFT3cXeunzKEi4EahzglI',
    spreadsheetId: '1vcDPrMexD8bxNwwzK9IxF8wch6Hfezq2eooJACDiqgg'
}
const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId
    }/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${config.apiKey}`;

class Dashboard extends Component {
    constructor(){
        super();
        this.state ={
            items: [],
            dropdownOptions: [],
            selectedValue: null,
            organicSource: null,
            directSource: null,
            referralSource: null,
            socialSource: null,
            pageViews: null,
            sessions: null,
            users: null,
            newUsers: null,
            sourceArr: [],
            usersArr: [],
            sessionsArr: []
        }
    }
    getData = arg => {
        const arr = this.state.items;
        const arrLen = arr.length;

        let organicSource = 0;
        let directSource = 0;
        let referralSource = 0;
        let pageViews = 0;
        let users = 0;
        let newUsers = 0;
        let socialSource = 0;
        let sessions = 0;
        let selectedValue = null;
        let sourceArr = [];
        let usersArr = [];
        let sessionsArr = [];

        for(let i=0; i< arrLen; i++){
            if(arg == arr[i]["month"]){
                organicSource = arr[i].organic_source;
                directSource = arr[i].direct_source;
                referralSource = arr[i].referral_source;
                pageViews= arr[i].page_views;
                users= arr[i].users;
                newUsers= arr[i].new_users;
                socialSource = arr[i].social_source;
                sessions = arr[i].sessions;
                sourceArr.push(
                    {
                        label: "Organic Source",
                        value: arr[i].organic_source
                    },
                    {
                        label: "Direct Source",
                        value: arr[i].direct_source
                    },
                    {
                        label: "Referral Source",
                        value: arr[i].referral_source
                    },
                    {
                        label: "Social Source",
                        value: arr[i].social_source
                    }
                )
                usersArr.push(
                    {
                        label: "Users",
                        value: arr[i].users
                    },
                    {
                        label: "New Users",
                        value: arr[i].new_users
                    }
                )
                sessionsArr.push(
                    {
                        label: "Page Views",
                        value: arr[i].page_views
                    },
                    {
                        label: "Sessions",
                        value: arr[i].sessions
                    }
                )
            }
        }
        selectedValue = arg;

        this.setState({
            organicSource: organicSource,
            directSource: directSource,
            referralSource: referralSource,
            socialSource: socialSource,
            pageViews: pageViews,
            users: users,
            newUsers: newUsers,
            sessions: sessions,
            sourceArr: sourceArr,
            usersArr: usersArr,
            sessionsArr: sessionsArr
        })
    }
    updateDashboard = event =>{
        this.getData(event.value);
        this.setState({
            selectedValue: event.value
        })
    }
    componentDidMount(){
        fetch(url)
        .then(response => response.json())
        .then(data => {

            let batchRowValues = data.valueRanges[0].values;

            const rows = [];

            for (let i = 1; i < batchRowValues.length; i++) {
                let rowObject = {};
                for (let j = 0; j < batchRowValues[i].length; j++) {
                    rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
                }
                rows.push(rowObject);

                   // dropdown options
        let dropdownOptions = [];

        for (let i = 0; i < rows.length; i++) {
            dropdownOptions.push(rows[i].month);
        }

        dropdownOptions = Array.from(new Set(dropdownOptions)).reverse();
        this.setState(
            {
                items: rows,
                dropdownOptions: dropdownOptions,
                selectedValue: "Jan 2018"
            },
            () => this.getData("Jan 2018")
        );
    }
})}
    render() {
     
          

        return (
            <div>
                <Container fluid>
                    <Row className="TopHeader">
                        <Col>
                            Dashboard
                        </Col>
                        <Col>
                            <Dropdown options={this.state.dropdownOptions} onChange={this.updateDashboard} value={this.state.selectedValue} placeholder="Select an option" />

                        </Col>
                    </Row>
                </Container>

                <Container  className="mainDashboard">
                    <Row>
                        <Col>
                            <WidgetText title="Organic Source" value={this.state.organicSource} />
                        </Col>
                        <Col>
                            <WidgetText title="Direct Source" value={this.state.directSource} />
                        </Col>
                        <Col>
                            <WidgetText title="Referral Source" value={this.state.referralSource} />
                        </Col>
                        <Col>
                            <WidgetText title="Social Source" value={this.state.socialSource} />
                        </Col>
                    </Row>  
                    <Row>
                        
                        
                        <Col>
                            <WidgetBar title="Source Comparison" data={this.state.sourceArr} />
                        </Col>
                        
                    </Row>  
                    <Row>
                        
                        <Col>
                            <WidgetText title="Users" value={this.state.users} />
                        </Col>
                        <Col>
                            <WidgetText title="New Users" value={this.state.newUsers} />
                        </Col> 
                        <Col>
                            <WidgetDoughnut title="Users Comparison" data={this.state.usersArr} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <WidgetText title="Page Views" value={this.state.pageViews} />
                        </Col>
                        <Col>
                            <WidgetText title="Sessions" value={this.state.sessions} />
                        </Col>
                        <Col>
                            <WidgetColumn title="Page Views VS Sessions" data={this.state.sessionsArr} />
                        </Col>
                        
                    </Row>
                    <Row>
                        
                    </Row>
                    
                        
                </Container>
             </div>
           )
    }
}

export default Dashboard
