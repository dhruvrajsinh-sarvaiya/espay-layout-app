import React, { Component } from 'react'
import { Animated } from 'react-native'

export class AnimatableItem extends Component {
    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
        }
    }
    componentDidMount() {
        Animated.timing(                  // Animate over time
            this.state.fadeAnim,            // The animated value to drive
            {
                toValue: 1,                   // Animate to opacity: 1 (opaque)
                duration: 500,               // Make it take a while
                useNativeDriver: true
            }
        ).start();                        // Starts the animation
    }

    render() {
        let { fadeAnim } = this.state;
        return (
            <Animated.View
                style={{ ...this.props.style, opacity: fadeAnim }}
                useNativeDriver={true}>
                {this.props.children}
            </Animated.View>
        )
    }
}

export default AnimatableItem
