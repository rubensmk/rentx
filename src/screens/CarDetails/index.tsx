import React, { useEffect, useState } from 'react';
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
interface Params {
    car: CarDTO
}

export function CarDetails() {
    const [carUpdate, setCarUpdate] = useState();
    const navigation: NavigationProp<any> = useNavigation();
    const theme = useTheme();
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
                        <ImageSlider imagesUrl={car.photos} />
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
                        <S.Price>R$ {car.price}</S.Price>
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
                    {car.about}
                    {car.about}
                    {car.about}
                    {car.about}
                </S.About>
            </Animated.ScrollView>


            <S.Footer>
                <Button title="Escolher período do Aluguel" onPress={handleConfirmRental} />
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