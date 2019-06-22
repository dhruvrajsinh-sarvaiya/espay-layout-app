import { Animated, Easing } from 'react-native';


// for transition left to right
export function fromLeft(duration = 300) {
    return {
        transitionSpec: {
            duration,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: ({ layout, position, scene }) => {
            const { index } = scene;
            const { initWidth } = layout;

            const translateX = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [-initWidth, 0, 0],
            });

            const opacity = position.interpolate({
                inputRange: [index - 1, index - 0.99, index],
                outputRange: [0, 1, 1],
            });

            return { opacity, transform: [{ translateX }] };
        },
    };
}

// for transition right to left
export function fromRight(duration = 300) {
    return {
        transitionSpec: {
            duration,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: ({ layout, position, scene }) => {
            const { index } = scene;
            const { initWidth } = layout;

            const translateX = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [initWidth, 0, 0]
            });

            const opacity = position.interpolate({
                inputRange: [index - 1, index - 0.99, index],
                outputRange: [0, 1, 1],
            });

            return { opacity, transform: [{ translateX }] };
        },
    };
}

// for transition Top to Bottm
export function fromTop(duration = 300) {
    return {
        transitionSpec: {
            duration,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: ({ layout, position, scene }) => {
            const { index } = scene;
            const { initHeight } = layout;

            const translateY = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [-initHeight, 0, 0],
            });

            const opacity = position.interpolate({
                inputRange: [index - 1, index - 0.99, index],
                outputRange: [0, 1, 1],
            });

            return { opacity, transform: [{ translateY }] };
        },
    };
}

// for transition Bottom to Top
export function fromBottom(duration = 300) {
    return {
        transitionSpec: {
            duration,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: ({ layout, position, scene }) => {
            const { index } = scene;
            const { initHeight } = layout;

            const translateY = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [initHeight, 0, 0],
            });

            const opacity = position.interpolate({
                inputRange: [index - 1, index - 0.99, index],
                outputRange: [0, 1, 1],
            });

            return { opacity, transform: [{ translateY }] };
        },
    };
}

// for fade in transition
export function fadeIn(duration = 300) {
    return {
        transitionSpec: {
            duration,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: ({ position, scene }) => {
            const { index } = scene;

            const opacity = position.interpolate({
                inputRange: [index - 1, index],
                outputRange: [0, 1],
            });

            return { opacity };
        },
    };
}

// for zoom in transition
export function zoomIn(duration = 300) {
    return {
        transitionSpec: {
            duration,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: ({ position, scene }) => {
            const { index } = scene;

            const scale = position.interpolate({
                inputRange: [index - 1, index],
                outputRange: [0, 1],
            });

            return { transform: [{ scale }] };
        },
    };
}

// for zoom out transition
export function zoomOut(duration = 300) {
    return {
        transitionSpec: {
            duration,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: ({ position, scene }) => {
            const { index } = scene;

            const scale = position.interpolate({
                inputRange: [index - 1, index],
                outputRange: [10, 1],
            });

            return { transform: [{ scale }] };
        },
    };
}

// for flipY transition
export function flipY(duration = 300) {
    return {
        transitionSpec: {
            duration,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: ({ position, scene }) => {
            const { index } = scene;

            const rotateY = position.interpolate({
                inputRange: [index - 1, index],
                outputRange: ['180deg', '0deg'],
            });

            return { transform: [{ rotateY }], backfaceVisibility: 'hidden' };
        },
    };
}

// for flipX transition
export function flipX(duration = 300) {
    return {
        transitionSpec: {
            duration,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: ({ position, scene }) => {
            const { index } = scene;

            const rotateX = position.interpolate({
                inputRange: [index - 1, index],
                outputRange: ['180deg', '0deg'],
            });

            return { transform: [{ rotateX }], backfaceVisibility: 'hidden' };
        },
    };
}

// for collapse and Expand transition
export function collapseExpand(duration = 250) {
    return {
        transitionSpec: {
            duration,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: ({ position, scene }) => {
            const { index, } = scene
            const inputRange = [index - 1, index, index + 1];
            const opacity = position.interpolate({
                inputRange,
                outputRange: [0, 1, 1],
            });

            const scaleY = position.interpolate({
                inputRange,
                outputRange: ([0, 1, 1]),
            });
            return { opacity, transform: [{ scaleY }] };
        },
    }
};