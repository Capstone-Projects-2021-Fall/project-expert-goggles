import React from 'react'
//import firebase from 'firebase/compat/app'
import { db, auth } from './services/firebase'

class AvailableGuides extends React.Component {
    state = { 
        visualizations: null
    }

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
                                <p>Name: {String(visualizations.Name)}</p>
                                <p>Guide: {String(visualizations.Guide)}</p>
                                <p>Image: {visualizations.img}</p>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
export default AvailableGuides;