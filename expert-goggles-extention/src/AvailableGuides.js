import React from 'react'
//import firebase from 'firebase/compat/app'
import { db, auth } from './services/firebase'

class AvailableGuides extends React.Component {
    state = { 
        visualizations: null
    }
/*
    generateImage() {
        var sb = document.createElement("div");
        sb.classList.add("sidebar");
        var outerDiv = document.createElement("div");
        var pic = document.createElement("img");
        pic.src = [URL];
        pic.width = "225";
        outerDiv.appendChild(pic);
        return sb;
    }
*/
    componentDidMount() { //will run as soon as this app component gets put on the screen
        console.log('mounted')
        db.collection('visualizations') // creates a reference to the students collection
            .get()
            .then( snapshot => {
                const visualizations = []
                snapshot.forEach( doc => {
                    const data = doc.data()
                    visualizations.push(data)
                })
                this.setState({ visualizations: visualizations})
                console.log(snapshot)
            })
            .catch( error => console.log(error))
    }

    render() {
        return (
            <div classname = "container">
                <h1 class = "text-center" style = {{paddingTop: "2%"}}>
                    Available Guides
                </h1>
                {
                    this.state.visualizations &&
                    this.state.visualizations.map ( visualizations => {
                        return (
                            <div>
                                <p style = {{fontWeight: "bold"}}>Name: {String(visualizations.Name)}</p>
                                <p style = {{fontWeight: "bold"}}>Guide: {String(visualizations.Guide)}</p>
                                <p style = {{paddingLeft: "20%"}}><img src={visualizations.img} alt ='guide'/></p>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
export default AvailableGuides;