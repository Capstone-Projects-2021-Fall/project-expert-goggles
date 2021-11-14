/*global chrome*/
import React from 'react'
import './HistoryofViews.css'
//import firebase from 'firebase/compat/app'
import { db, auth} from './services/firebase'
import moment from 'moment'
//const date = dateCreated.toDate().toDateString()

//var hasExtension = false;
const expertGogglesID = "oaabhcneffbbgikojonjehejjhaobooe";
var userID;


try{
    chrome.runtime.sendMessage(expertGogglesID, { message: "user_id" },
    function (reply)
    {
        if(reply)
            if(reply.user_id)
            {
                userID = reply.user_id;
                //Callback function to generate custom user history table
                //generateHistoryTable(); //Name it whatever you want
            }
            else
            {
                //Callback to populate page saying no extension was detected or there was an error
                //generateNoExtensionPage(); //Name it Whatever you want
            }
    });
}
catch(err)
{
    //Same as the else statement above
    //Callback to populate page saying no extension was detected or there was an error
    //generateNoExtensionPage(); //Name it Whatever you want
}


class HistoryofViews extends React.Component {
    
    state = {
        UserHistories: null
    }
    
    componentDidMount() {
        console.log('mounted')
        db.collection('UserHistories')
            .get()
            .then( snapshot => {
                const UserHistories = []
                snapshot.forEach( doc => {
                    const data = doc.data()
                    UserHistories.push(data)
                })
                this.setState({ UserHistories: UserHistories})
                console.log(snapshot)
            })
            .catch( error => console.log(error))
    }
    /*
    constructor() {
    try {
        chrome.runtime.sendMessage(expertGogglesID, {message:"user_id"},
        function (reply) {
            if(reply) {
                if (reply.user_id) {
                    hasExtension = true;
        userID = reply.user_id;
                }
            }
        });
    }
    catch(error) {
        //Do Something if that doesn't work
    }
    console.log(userID);
}
*/
    render() {
        return (
            <bodyhistory>
                <div className = "container">
                    <h1 class = "text-center" style = {{paddingTop: "2%"}}>
                        History
                    </h1>
                    {
                        this.state.UserHistories &&
                        this.state.UserHistories.map ( UserHistories => {
                            return (
                                <div className = "tablecontent">
                                    <table>
                                        <tr>
                                            <th>Last Accessed:</th>
                                            <th>Type:</th>
                                            <th>Link:</th>
                                        </tr>
                                        <tr>
                                            <td>{moment(UserHistories.last_accessed.toDate()).calendar()}</td>
                                            <td>{String(UserHistories.type)}</td>
                                            <td>{String(UserHistories.url)}</td>
                                        </tr>
                                        {/*<tr>
                                            <th><p style = {{fontWeight: "bold"}}>Last Accessed: {moment(UserHistories.last_accessed.toDate()).calendar()}</p></th>
                                        </tr>
                                        <tr>
                                            <p style = {{fontWeight: "bold"}}>Type: {String(UserHistories.type)}</p>
                                        </tr>
                                        <tr>
                                            <p style = {{fontWeight: "bold"}}>Link: {String(UserHistories.url)}</p>
                                        </tr>*/}
                                        {/*<p style = {{fontWeight: "bold"}}>Last Accessed: {moment(UserHistories.last_accessed.toDate()).calendar()}</p>
                                        <p style = {{fontWeight: "bold"}}>Type: {String(UserHistories.type)}</p>
                                        <p style = {{fontWeight: "bold"}}>Link: {String(UserHistories.url)}</p>*/}
                                    </table>
                                </div>
                            )
                        })
                    }
                </div>
            </bodyhistory>
        )
    }
}
export default HistoryofViews;

/*
    return (
        <div className = "container">
            <h1 className = "text-center" style = {{paddingTop: "30%"}}>
                History of Views
            </h1>
        </div>
    )

                                    <p style = {{fontWeight: "bold"}}>User: {String(UserHistories.user)}</p>
*/