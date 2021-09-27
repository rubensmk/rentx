import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components';
import * as S from './styles';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Button } from '../../components/Button';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { CarDTO } from '../../dtos/CarDTO';
import Animated, { Extrapolate, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { Accessory } from '../../components/Acessory';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { Car as ModelCar } from '../../database/model/Car';
import { useNetInfo } from '@react-native-community/netinfo';
import { api } from '../../services/api';
interface Params {
    car: ModelCar;
}

export function CarDetails() {
    const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);
    const navigation: NavigationProp<any> = useNavigation();
    const theme = useTheme();
    const netInfo = useNetInfo();
    const route = useRoute();
    const { car } = route.params as Params;

    const scrollY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
    })

    const headerStyleAnimation = useAnimatedStyle(() => {
        return {
            height: interpolate(
                scrollY.value,
                [0, 200],
                [200, 70],
                Extrapolate.CLAMP
            ),
        }
    });

    const sliderCarsStyleAnimation = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollY.value,
                [0, 150],
                [1, 0],
                Extrapolate.CLAMP
            )
        }
    });

    function handleConfirmRental() {
        navigation.navigate('Scheduling', { car })
    }
    function handleGoBack() {
        navigation.goBack();
    }

    useEffect(() => {
        async function fetchCarUpdate() {
            const response = await api.get(`/cars/${car.id}`);
            setCarUpdated(response.data);
        }
        if (netInfo.isConnected === true) {
            fetchCarUpdate();
        }
    }, [netInfo.isConnected])
    return (
        <S.Container>
            <StatusBar
                barStyle="dark-content"
                translucent
                backgroundColor="transparent"
            />

            <Animated.View style={[
                headerStyleAnimation,
                styles.header,
                { backgroundColor: theme.colors.background_secondary }
            ]}>
                <S.Header>
                    <BackButton onPress={() => navigation.goBack()} />
                </S.Header>

                <Animated.View style={sliderCarsStyleAnimation}>
                    <S.CarImages>
                        <ImageSlider imagesUrl={!!carUpdated.photos ? carUpdated.photos : [{ id: car.thumbnail, photo: car.thumbnail }]} />
                    </S.CarImages>
                </Animated.View>
            </Animated.View>

            <Animated.ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: getStatusBarHeight() + 160,
                }}
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
            >
                <S.Details>
                    <S.Description>
                        <S.Brand>{car.brand}</S.Brand>
                        <S.Name>{car.name}</S.Name>
                    </S.Description>
                    <S.Rent>
                        <S.Period>{car.period}</S.Period>
                        <S.Price>
                            R$ {netInfo.isConnected === true ? car.price : '...'}
                        </S.Price>
                    </S.Rent>
                </S.Details>

                {
                    carUpdated.accessories &&
                    <S.Accessories>
                        {carUpdated.accessories.map(accessory => (
                            <Accessory
                                key={accessory.type}
                                name={accessory.name}
                                icon={getAccessoryIcon(accessory.type)}
                            />
                        ))}
                    </S.Accessories>
                }


                <S.About>
                    {car.about}
                </S.About>
            </Animated.ScrollView>


            <S.Footer>
                <Button
                    title="Escolher período do Aluguel"
                    onPress={handleConfirmRental}
                    enabled={netInfo.isConnected === true}
                />
                {
                    netInfo.isConnected === false &&
                    <S.OfflineInfo>
                        Conecte-se a Internet para ver mais detalhes e agendar seu carro.
                    </S.OfflineInfo>
                }
            </S.Footer>
        </S.Container>

    )
}


const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        overflow: 'hidden',
        zIndex: 1,
    },
})