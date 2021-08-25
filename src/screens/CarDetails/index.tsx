import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { useTheme } from 'styled-components';
import * as S from './styles';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Button } from '../../components/Button';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { CarDTO } from '../../dtos/CarDTO';


import speedSVG from '../../assets/speed.svg';
import { Accessory } from '../../components/Acessory';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';

interface Params {
    car: CarDTO
}

export function CarDetails() {
    const [carUpdate, setCarUpdate] = useState();
    const navigation: NavigationProp<any> = useNavigation();
    const theme = useTheme();
    const route = useRoute();
    const { car } = route.params as Params;

    function handleConfirmRental() {
        navigation.navigate('Scheduling', { car })
    }
    return (
        <S.Container>
            <StatusBar
                barStyle="dark-content"
                translucent
                backgroundColor="transparent"
            />

            <S.Header>
                <BackButton onPress={() => navigation.goBack()} />
            </S.Header>

            <S.CarImages>
                <ImageSlider imagesUrl={car.photos} />
            </S.CarImages>

            <S.Details>
                <S.Description>
                    <S.Brand>{car.brand}</S.Brand>
                    <S.Name>{car.name}</S.Name>
                </S.Description>
                <S.Rent>
                    <S.Period>{car.rent.period}</S.Period>
                    <S.Price>R$ {car.rent.price}</S.Price>
                </S.Rent>
            </S.Details>

            <S.Accessories>
                {car.accessories.map(accessory => (
                    <Accessory
                        key={accessory.type}
                        name={accessory.name}
                        icon={getAccessoryIcon(accessory.type)}
                    />
                ))}
            </S.Accessories>

            <S.About>
                {car.about}
            </S.About>

            <S.Footer>
                <Button title="Escolher período do Aluguel" onPress={handleConfirmRental} />
            </S.Footer>
        </S.Container>

    )
}


