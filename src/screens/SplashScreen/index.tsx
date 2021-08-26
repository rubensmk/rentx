import React, { useEffect } from 'react'
import * as S from './styles'

import BrandSvg from '../../assets/brand.svg';
import LogoSvg from '../../assets/logo.svg';

import Animated, { Extrapolate, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';


export function SplashScreen() {
    const navigation: NavigationProp<any> = useNavigation();
    const splashAnimation = useSharedValue(0);

    const brandStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(splashAnimation.value, [0, 50], [1, 0]),
            transform: [
                {
                    translateX: interpolate(splashAnimation.value, [0, 50], [0, -50], Extrapolate.CLAMP)
                }
            ],
        }
    });

    const logoStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(splashAnimation.value, [0, 25, 50], [0, 0.3, 1]),
            transform: [
                {
                    translateX: interpolate(splashAnimation.value, [0, 50], [-50, 0], Extrapolate.CLAMP)
                }
            ],
        }
    });

    function startApp() {
        navigation.navigate('Home');
    }
    useEffect(() => {
        splashAnimation.value = withTiming(50, { duration: 1000 }, () => { runOnJS(startApp)() });
    }, []);


    return (
        <S.Container>
            <StatusBar backgroundColor="transparent" translucent />
            <Animated.View style={[brandStyle, { position: 'absolute', }]}>
                <BrandSvg width={80} height={50} />
            </Animated.View>

            <Animated.View style={[logoStyle, { position: 'absolute' }]}>
                <LogoSvg width={180} height={20} />
            </Animated.View>

        </S.Container >
    )
}
