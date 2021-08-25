import React from 'react';
import { useWindowDimensions, StatusBar } from 'react-native';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';

import LogoSvg from '../../assets/logo_background_gray.svg';
import DoneSvg from '../../assets/done.svg';

import { ConfirmButton } from '../../components/ConfirmButton';

import * as S from './styles';

interface Params {
    title: string;
    message: string;
    nextScreenRoute: string;
}

export function Confirmation() {
    const { width } = useWindowDimensions();
    const navigation: NavigationProp<any> = useNavigation();
    const route = useRoute();
    const { nextScreenRoute, title, message } = route.params as Params;

    function handleConfirm() {
        navigation.navigate(nextScreenRoute)
    }
    return (
        <S.Container>
            <StatusBar
                barStyle="light-content"
                translucent
                backgroundColor="transparent"
            />

            <LogoSvg width={width} />

            <S.Content>
                <DoneSvg width={80} height={80} />
                <S.Title>{title}</S.Title>

                <S.Message>
                    {message}
                </S.Message>
            </S.Content>

            <S.Footer>
                <ConfirmButton title="OK" onPress={handleConfirm} />
            </S.Footer>
        </S.Container>
    );
}