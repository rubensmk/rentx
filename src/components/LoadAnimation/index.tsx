import React from 'react'
import * as S from './styles'

import LottieView from 'lottie-react-native';
import loadingCar from '../../assets/loading.json';

export function LoadAnimation() {
    return (
        <S.Container>
            <LottieView
                source={loadingCar}
                style={{ height: 200 }}
                resizeMode="contain"
                autoPlay
                loop
            />
        </S.Container>
    )
}
