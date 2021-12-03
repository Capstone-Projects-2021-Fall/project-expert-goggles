/*global chrome*/
import React from 'react'
import './HistoryofViews.css'
//import firebase from 'firebase/compat/app'
import { db, auth} from './services/firebase'
import moment from 'moment'
//const date = dateCreated.toDate().toDateString()

//var hasExtension = false;
const expertGogglesID = "ojdbmjhahmdjlnalcggenpkhkhegckle";
var userID;


try{
    chrome.runtime.sendMessage(expertGogglesID, { message: "user_id" },
    function (reply)
    {
        if(reply)
            if(reply.user_id)
            {
                if(window.HistoryofViews.state.AllUserHistories)
                    window.HistoryofViews.setUser(reply.user_id);
                else
                    waitToSet(reply.user_id);
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

function waitToSet(id)
{
    setTimeout(function()
    {
        if(window.HistoryofViews.state.AllUserHistories)
            window.HistoryofViews.setUser(id);
    }, 1000);
}

class HistoryofViews extends React.Component {

    state =
    {
       AllUserHistories: null,
       DisplayedUserHistories: [],
       userID: 0
    }

    constructor()
    {
        super();
        window.HistoryofViews = this;
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
                    this.setState({ AllUserHistories: UserHistories})
                })
                .catch( error => console.log(error))
        }

    setUser = (newID) => {
      this.setState({
        userID: newID
      })
      this.updateDisplay();
    }

    updateDisplay = (newID) => {
        var newDisplay = []
        for(let user of this.state.AllUserHistories)
        {
            if(user.user === this.state.userID)
                newDisplay.push(user);
        }
        this.setState({ DisplayedUserHistories: newDisplay})
        this.render();
    }

    render() {
        if(this.state.userID === 0)
        {
            return (
                <mainthree>
                    <div id = "historypage">
                        <div className = "container">
                            <h1 className = "history" style = {{paddingTop: "2%"}}>
                                History
                            </h1>
                            <div>
                                <ol class = "extension">
                                    We are not able to load your history for any of the following reasons:
                                    <li>Expert Goggles is not installed.</li>
                                    <li> You are not using Google Chrome.</li>
                                    <li>There was an error. </li>
                                    If you need to install the extension, visit the downloads page!
                                </ol>
                            </div>
                        </div>
                    </div>
                </mainthree>
            )}
        else
        {
        return (
            <bodyhistory>
                <div className = "container">
                    <h1 class = "text-center" style = {{paddingTop: "2%"}}>
                        History
                    </h1>
                    {
                        this.state.DisplayedUserHistories &&
                        this.state.DisplayedUserHistories.map ( DisplayedUserHistories => {
                            return (
                                <div className = "tablecontent">
                                    <table>
                                        <tr>
                                            <th>Last Accessed:</th>
                                            <th>Type:</th>
                                            <th>Link:</th>
                                        </tr>
                                        <tr>
                                            <td>{moment(DisplayedUserHistories.last_accessed.toDate()).calendar()}</td>
                                            <td>{String(DisplayedUserHistories.type)}</td>
                                            <td>{String(DisplayedUserHistories.url)}</td>
                                        </tr>
                                    </table>
                                </div>
                            )
                        })
                    }
                </div>
            </bodyhistory>
        )}
    }
}
export default HistoryofViews;