import React from 'react'
import './index.css'
//import firebase from 'firebase/compat/app'
import { db, auth } from './services/firebase'
import { ScrollToTop } from './Components/scroll/ScrollToTop'
import './AvailableGuides.css'
//import Guides from "./Data.json"
<link href = "https://fonts.googleapis.com/icon?family=Material+Icons" rel = "stylesheet"/>



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
            <main style = {{backgroundColor: "#f0ead6"}}>
                <div classname = "container" style = {{height: "auto"}}>
                    <h1 className = "text-center" style = {{paddingTop: "2%"}}>
                        Available Guides
                    </h1>
                    {
                        this.state.visualizations &&
                        this.state.visualizations.map ( visualizations => {
                            return (
                                    <div>
                                        <p className = "namees" style = {{fontWeight: "bold"}}>Name: {String(visualizations.Name)}</p>
                                        <p className = "descriptions" style = {{fontWeight: "bold"}}>Guide: {String(visualizations.Guide)}</p>
                                        <p style = {{paddingLeft: "20%"}}><img src={visualizations.img} alt ='guide' class = "emage"/></p>
                                    </div>
                            )
                        })
                    }
                </div>
            </main>
        )
    }
}

export default AvailableGuides;