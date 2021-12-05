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

//Listen for the extension messaged the user ID out
window.addEventListener("message", (event) => {
    //Make Sure we're only processing messages from Expert Goggles
    if(!event.data.sender || event.data.sender !== "ExpertGoggles")
        return;

    //If the info was sent, grab the userID
    if(event.data.userID)
    {
        userID = event.data.userID;

        //If the UserHistory data has finished fetching, sort by ID
        if(window.HistoryofViews.state.AllUserHistories)
            window.HistoryofViews.setUser(userID);
        else //Otherwise, wait and try again
            waitToSet(userID);
    }
});

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
            <main style ={{backgroundColor: "#7BBCF4"}}>
                <div className = "container">
                    <h1 class = "text-center" style = {{paddingTop: "2%", fontSize: "4em"}}>
                        History
                    </h1>
                    {
                        this.state.DisplayedUserHistories &&
                        this.state.DisplayedUserHistories.map ( DisplayedUserHistories => {
                            return (
                                <div className = "tablecontent">
                                    <table style = {{boxShadow: "5px 10px #888888"}}>
                                        <thead>
                                            <tr>
                                                <th scope = "col" style = {{height: "50px", width: "50px"}}>Last Accessed:</th>
                                                <th scope = "col" style = {{height: "50px", width: "50px"}}>Type:</th>
                                                <th scope = "col" style = {{height: "50px", width: "50px"}}>Link:</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class = "item1" style = {{height: "50px", width: "50px"}}>{moment(DisplayedUserHistories.last_accessed.toDate()).calendar()}</td>
                                                <td class = "item2" style = {{height: "50px", width: "50px"}}>{String(DisplayedUserHistories.type)}</td>
                                                <td class = "item3" style = {{height: "50px", width: "50px"}}>{String(DisplayedUserHistories.url)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )
                        })
                    }
                </div>
            </main>
        )}
    }
}
export default HistoryofViews;