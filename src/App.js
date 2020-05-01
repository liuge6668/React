import React, { Component } from 'react';
import img1 from './image/logo192.png'
import './style/three.scss'
export default class App extends Component {
    render() {    
        console.log(45)    
        return(<div>
            <p>hello</p>
            <img src={img1} />
            <div className='three'></div>
        </div>)
    }
}